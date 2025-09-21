// Debug script to capture console errors
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

const errors = [];

console.error = function(...args) {
  errors.push({ type: 'error', message: args.join(' '), timestamp: new Date().toISOString() });
  originalError.apply(console, args);
};

console.warn = function(...args) {
  errors.push({ type: 'warn', message: args.join(' '), timestamp: new Date().toISOString() });
  originalWarn.apply(console, args);
};

console.log = function(...args) {
  errors.push({ type: 'log', message: args.join(' '), timestamp: new Date().toISOString() });
  originalLog.apply(console, args);
};

// Export errors after 5 seconds
setTimeout(() => {
  console.log('=== CAPTURED ERRORS ===');
  errors.forEach(error => {
    console.log(`[${error.timestamp}] ${error.type.toUpperCase()}: ${error.message}`);
  });
}, 5000);