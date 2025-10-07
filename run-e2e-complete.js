const { spawn } = require('child_process');
const { setupTestUser } = require('./testEntrega3/setup-test-user.js');

async function runE2ETests() {
  console.log('🚀 Iniciando proceso completo de pruebas E2E...\n');
  
  try {
    // Paso 1: Configurar usuario de prueba
    console.log('📋 Paso 1: Configurando usuario de prueba...');
    const userSetup = await setupTestUser();
    
    if (userSetup) {
      console.log('✅ Usuario de prueba listo\n');
    } else {
      console.log('❌ Error configurando usuario de prueba\n');
      process.exit(1);
    }
    
    // Paso 2: Ejecutar pruebas E2E
    console.log('📋 Paso 2: Ejecutando pruebas E2E...\n');
    
    const playwright = spawn('npm', ['run', 'test:e2e', '--', '--reporter=list'], {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd()
    });
    
    playwright.on('close', (code) => {
      console.log(`\n📊 Pruebas E2E terminadas con código: ${code}`);
      if (code === 0) {
        console.log('🎉 ¡Todas las pruebas E2E pasaron exitosamente!');
      } else {
        console.log('⚠️ Algunas pruebas E2E fallaron. Revisa el reporte para más detalles.');
        console.log('💡 Ejecuta: npm run test:e2e:report');
      }
      process.exit(code);
    });
    
    playwright.on('error', (err) => {
      console.error('❌ Error ejecutando pruebas E2E:', err);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
    process.exit(1);
  }
}

runE2ETests();
