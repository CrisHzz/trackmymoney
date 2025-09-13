#!/usr/bin/env node

/**
 * Script para ejecutar todas las pruebas con assert nativo
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const testFiles = [
  'CP001-CP004-OfflineStorage.test.ts',
  'CP005-SearchTransactions.test.ts', 
  'CP006-CP007-UserManagement.test.ts',
  'CP008-UserAuth.test.ts',
  'CP009-CP010-CategoryManagement.test.ts'
];

console.log('🧪 Ejecutando todas las pruebas con assert nativo...\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const testFile of testFiles) {
  const testPath = path.join('pruebas_escenarios', testFile);
  
  if (!fs.existsSync(testPath)) {
    console.log(`❌ Archivo no encontrado: ${testPath}`);
    continue;
  }

  console.log(`📋 Ejecutando: ${testFile}`);
  console.log('═'.repeat(60));
  
  // Contar tests total por archivo (independientemente de si fallan)
  const fileContent = fs.readFileSync(testPath, 'utf8');
  const testMatches = fileContent.match(/test\(/g) || [];
  // Filtrar solo las llamadas a test(), no la definición de función
  const testLines = fileContent.split('\n').filter(line => 
    line.includes('test(') && !line.includes('function test') && !line.includes('emailRegex.test')
  );
  const testCountInFile = testLines.length;
  totalTests += testCountInFile;

  try {
    // Ejecutar el archivo de test con tsx y capturar salida
    const output = execSync(`npx tsx ${testPath}`, { 
      encoding: 'utf8'
    });
    
    // Mostrar la salida
    console.log(output);
    
    // Contar los tests exitosos y fallidos en la salida
    const passedInThisFile = (output.match(/✅/g) || []).length;
    const failedInThisFile = (output.match(/❌/g) || []).length;
    
    passedTests += passedInThisFile;
    failedTests += failedInThisFile;
    
    const totalInFile = passedInThisFile + failedInThisFile;
    console.log(`\n✅ ${testFile}: ${passedInThisFile} exitosos, ${failedInThisFile} fallidos (${totalInFile} total)\n`);
    
  } catch (error) {
    // Si el proceso falla completamente, extraer información del stdout
    const output = error.stdout?.toString() || '';
    console.log(output);
    
    const passedInThisFile = (output.match(/✅/g) || []).length;
    const failedInThisFile = (output.match(/❌/g) || []).length;
    
    passedTests += passedInThisFile;
    failedTests += failedInThisFile;
    
    console.log(`\n❌ ${testFile}: ${passedInThisFile} exitosos, ${failedInThisFile} fallidos (error en ejecución)\n`);
  }
}

console.log('═'.repeat(60));
console.log('📊 RESUMEN DE RESULTADOS:');
console.log(`   Total de archivos: ${testFiles.length}`);
console.log(`   Total de tests: ${totalTests}`);
console.log(`   ✅ Tests exitosos: ${passedTests}`);
console.log(`   ❌ Tests fallidos: ${failedTests}`);
console.log(`   📈 Porcentaje de éxito: ${totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0}%`);

if (failedTests === 0) {
  console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
  process.exit(0);
} else {
  console.log(`\n⚠️  ${failedTests} pruebas fallaron de ${totalTests} total.`);
  process.exit(1);
}