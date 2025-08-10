const { exec } = require('child_process');
const os = require('os');

const url = 'http://localhost:3001';

// Detect platform and open browser
const platform = os.platform();
let command;

if (platform === 'win32') {
  command = `start ${url}`;
} else if (platform === 'darwin') {
  command = `open ${url}`;
} else {
  command = `xdg-open ${url}`;
}

console.log('🚀 Opening Palette Haus in your browser...');
console.log(`📍 URL: ${url}`);
console.log('');
console.log('Test Steps:');
console.log('1. Browse to Shop page');
console.log('2. Click on any palette');
console.log('3. Click "Add to Cart"');
console.log('4. Click cart icon in header');
console.log('5. Click "Checkout"');
console.log('6. Use test card: 4242 4242 4242 4242');
console.log('');

exec(command, (error) => {
  if (error) {
    console.error('Could not open browser automatically.');
    console.log(`Please open manually: ${url}`);
  }
});