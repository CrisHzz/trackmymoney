const { spawn } = require('child_process');

console.log('🚀 Ejecutando npm run test:e2e...\n');

const npm = spawn('npm', ['run', 'test:e2e', '--', '--reporter=list', '--max-failures=5'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

npm.on('close', (code) => {
  console.log(`\n📊 npm run test:e2e terminó con código: ${code}`);
  if (code === 0) {
    console.log('✅ Todas las pruebas E2E pasaron');
  } else {
    console.log('❌ Algunas pruebas E2E fallaron');
  }
});

npm.on('error', (err) => {
  console.error('❌ Error ejecutando npm run test:e2e:', err);
});
