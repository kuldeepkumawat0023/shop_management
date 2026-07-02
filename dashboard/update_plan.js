const fs = require('fs');

const planPath = 'd:/DineshThori/shop_management/project_guide/Frontend_Development_Plan.md';
const treePath = 'd:/DineshThori/shop_management/dashboard/dashboard_tree.txt';

let planContent = fs.readFileSync(planPath, 'utf8');
let treeContent = fs.readFileSync(treePath, 'utf8');

// Clean up tree content (remove generate_ scripts)
treeContent = treeContent
  .split('\n')
  .filter(line => !line.includes('generate_'))
  .join('\n');

// Find the boundaries
const lines = planContent.split('\n');
const startIdx = lines.findIndex((line, i) => i > 60 && line.startsWith('```text'));
const endIdx = lines.findIndex((line, i) => i > startIdx && line.startsWith('```'));

if (startIdx !== -1 && endIdx !== -1) {
  // Replace
  const newContent = [
    ...lines.slice(0, startIdx + 1),
    treeContent.trim(),
    ...lines.slice(endIdx)
  ].join('\n');
  
  fs.writeFileSync(planPath, newContent, 'utf8');
  console.log('Successfully updated Frontend_Development_Plan.md');
} else {
  console.log('Could not find the text block in Frontend_Development_Plan.md');
}
