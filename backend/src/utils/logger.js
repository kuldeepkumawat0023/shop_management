const logInfo = (message, meta = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [INFO]: ${message}`, Object.keys(meta).length ? meta : '');
};

const logError = (message, error = {}) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [ERROR]: ${message}`, error.message || error);
  if (error.stack) {
    console.error(error.stack);
  }
};

const logWarn = (message, meta = {}) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] [WARN]: ${message}`, Object.keys(meta).length ? meta : '');
};

module.exports = {
  logInfo,
  logError,
  logWarn
};
