const fs = require('fs');
const path = require('path');

const DIRECTORY = path.join(__dirname, 'src', 'components', 'dashboard');
const EN_JSON_PATH = path.join(__dirname, 'src', 'locales', 'en.json');
const HI_JSON_PATH = path.join(__dirname, 'src', 'locales', 'hi.json');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.tsx')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

function generateKey(englishText) {
  let key = englishText.trim().replace(/[^a-zA-Z0-9]/g, ' ').trim().split(' ').map((word, i) => {
    if (i === 0) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('');
  if (key.length > 25) key = key.substring(0, 25);
  return key;
}

const allFiles = walkSync(DIRECTORY);
let dictionary = {};
let modifiedFilesCount = 0;

let enData = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
let hiData = JSON.parse(fs.readFileSync(HI_JSON_PATH, 'utf8'));
if (!enData.common) enData.common = {};
if (!hiData.common) hiData.common = {};

// We use highly specific regexes to ensure we don't match math expressions or code
// 1. JSX Text Nodes: > Text / टेक्स्ट <
const TAG_REGEX = />\s*([A-Za-z0-9\s.,'?!()&:;%-]+?)\s*\/\s*([\u0900-\u097F\s.,'?!()&:;%-]+?)\s*</g;
// 2. Toast messages: toast.error('Text / टेक्स्ट')
const TOAST_REGEX = /(toast\.(?:error|success|loading)\()(['"])([A-Za-z0-9\s.,'?!()&:;%-]+?)\s*\/\s*([\u0900-\u097F\s.,'?!()&:;%-]+?)\2(\))/g;
// 3. Placeholders/Labels: placeholder="Text / टेक्स्ट"
const PROP_REGEX = /([a-zA-Z]+)=(['"])([A-Za-z0-9\s.,'?!()&:;%-]+?)\s*\/\s*([\u0900-\u097F\s.,'?!()&:;%-]+?)\2/g;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let needsTranslationHook = false;

  // Replace tags
  content = content.replace(TAG_REGEX, (match, eng, hin) => {
    // Check if hindi really contains hindi chars
    if (!/[\u0900-\u097F]/.test(hin)) return match;
    const key = generateKey(eng);
    dictionary[key] = { en: eng.trim(), hi: hin.trim() };
    enData.common[key] = eng.trim();
    hiData.common[key] = hin.trim();
    needsTranslationHook = true;
    return `>{t('common.${key}')}<`;
  });

  // Replace toasts
  content = content.replace(TOAST_REGEX, (match, prefix, quote, eng, hin, suffix) => {
    if (!/[\u0900-\u097F]/.test(hin)) return match;
    const key = generateKey(eng);
    dictionary[key] = { en: eng.trim(), hi: hin.trim() };
    enData.common[key] = eng.trim();
    hiData.common[key] = hin.trim();
    needsTranslationHook = true;
    return `${prefix}t('common.${key}')${suffix}`;
  });

  // Replace props (like placeholder="..")
  content = content.replace(PROP_REGEX, (match, propName, quote, eng, hin) => {
    if (!/[\u0900-\u097F]/.test(hin)) return match;
    const key = generateKey(eng);
    dictionary[key] = { en: eng.trim(), hi: hin.trim() };
    enData.common[key] = eng.trim();
    hiData.common[key] = hin.trim();
    needsTranslationHook = true;
    return `${propName}={t('common.${key}')}`;
  });

  if (needsTranslationHook && content !== originalContent) {
    if (!content.includes("import { useTranslation }")) {
      const importStatement = "import { useTranslation } from 'react-i18next';\n";
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLine = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
      } else {
        content = importStatement + content;
      }
    }

    if (!content.includes("const { t } = useTranslation();")) {
      const funcRegex = /export\s+default\s+function\s+\w+\s*\([^)]*\)\s*{/;
      const match = funcRegex.exec(content);
      if (match) {
        const insertPos = match.index + match[0].length;
        content = content.slice(0, insertPos) + "\n  const { t } = useTranslation();" + content.slice(insertPos);
      }
    }
    
    fs.writeFileSync(file, content);
    modifiedFilesCount++;
  }
}

fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enData, null, 2));
fs.writeFileSync(HI_JSON_PATH, JSON.stringify(hiData, null, 2));
console.log(`Successfully refactored ${modifiedFilesCount} TSX files safely.`);
