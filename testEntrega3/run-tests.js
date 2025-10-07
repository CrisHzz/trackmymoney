const { spawn } = require('child_process');

console.log('🚀 Ejecutando pruebas E2E...\n');

const playwright = spawn('node', [
  '../node_modules/@playwright/test/cli.js',
  'test',
  '--project=chromium',
  '--reporter=list'
], {
  stdio: 'inherit',
  shell: true
});

playwright.on('close', (code) => {
  console.log(`\n📊 Proceso terminado con código: ${code}`);
  if (code === 0) {
    console.log('✅ Todas las pruebas pasaron');
  } else {
    console.log('❌ Algunas pruebas fallaron');
  }
});

playwright.on('error', (err) => {
  console.error('❌ Error ejecutando pruebas:', err);
});
