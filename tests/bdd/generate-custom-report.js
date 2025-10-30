/**
 * Generador de reporte HTML personalizado para BDD
 */

const fs = require('fs');
const path = require('path');

function generateCustomReport() {
  try {
    // Leer los reportes JSON
    const simpleReport = JSON.parse(fs.readFileSync('tests/bdd/reports/cucumber-report.json', 'utf8'));
    const advancedReport = JSON.parse(fs.readFileSync('tests/bdd/reports/serenity-cucumber-report.json', 'utf8'));
    
    // Generar HTML personalizado
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrackMyMoney - Reportes BDD Comparativos</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .reports { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .report-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .report-card h2 { margin-top: 0; color: #2c3e50; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
        .stat { background: #ecf0f1; padding: 15px; border-radius: 4px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #27ae60; }
        .stat-label { font-size: 12px; color: #7f8c8d; }
        .scenarios { margin-top: 20px; }
        .scenario { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #27ae60; }
        .scenario-name { font-weight: bold; color: #2c3e50; }
        .scenario-steps { font-size: 12px; color: #7f8c8d; margin-top: 5px; }
        .simple { border-left-color: #3498db; }
        .advanced { border-left-color: #e74c3c; }
        .footer { text-align: center; margin-top: 40px; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 TrackMyMoney - Reportes BDD Comparativos</h1>
            <p>Comparación entre configuración Simple vs Avanzada</p>
            <p><strong>Generado:</strong> ${new Date().toLocaleString('es-ES')}</p>
        </div>
        
        <div class="reports">
            <div class="report-card">
                <h2>📊 Cucumber Simple</h2>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">${countScenarios(simpleReport)}</div>
                        <div class="stat-label">Escenarios</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${countSteps(simpleReport)}</div>
                        <div class="stat-label">Pasos</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${calculateDuration(simpleReport)}ms</div>
                        <div class="stat-label">Duración</div>
                    </div>
                </div>
                <div class="scenarios">
                    ${generateScenarioList(simpleReport, 'simple')}
                </div>
                <p><strong>Características:</strong></p>
                <ul>
                    <li>⚡ Ejecución rápida</li>
                    <li>📝 Logs básicos [BDD]</li>
                    <li>🔧 Ideal para desarrollo</li>
                </ul>
            </div>
            
            <div class="report-card">
                <h2>🎯 Cucumber Avanzado</h2>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">${countScenarios(advancedReport)}</div>
                        <div class="stat-label">Escenarios</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${countSteps(advancedReport)}</div>
                        <div class="stat-label">Pasos</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${calculateDuration(advancedReport)}ms</div>
                        <div class="stat-label">Duración</div>
                    </div>
                </div>
                <div class="scenarios">
                    ${generateScenarioList(advancedReport, 'advanced')}
                </div>
                <p><strong>Características:</strong></p>
                <ul>
                    <li>📊 Logs detallados [Serenity BDD]</li>
                    <li>🎨 Interfaz mejorada</li>
                    <li>📋 Mejor para demos</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>🚀 <strong>Comandos:</strong> <code>npm run test:bdd</code> | <code>npm run test:bdd:serenity</code></p>
            <p>📁 <strong>Reportes:</strong> tests/bdd/reports/</p>
        </div>
    </div>
</body>
</html>`;

    // Escribir el reporte personalizado
    fs.writeFileSync('tests/bdd/reports/comparison-report.html', html);
    console.log('✅ Reporte comparativo generado: tests/bdd/reports/comparison-report.html');
    
  } catch (error) {
    console.error('❌ Error generando reporte:', error.message);
  }
}

function countScenarios(report) {
  return report.reduce((total, feature) => total + feature.elements.length, 0);
}

function countSteps(report) {
  return report.reduce((total, feature) => {
    return total + feature.elements.reduce((stepTotal, scenario) => {
      return stepTotal + scenario.steps.filter(step => !step.hidden).length;
    }, 0);
  }, 0);
}

function calculateDuration(report) {
  const totalNs = report.reduce((total, feature) => {
    return total + feature.elements.reduce((scenarioTotal, scenario) => {
      return scenarioTotal + scenario.steps.reduce((stepTotal, step) => {
        return stepTotal + (step.result?.duration || 0);
      }, 0);
    }, 0);
  }, 0);
  return Math.round(totalNs / 1000000); // Convert nanoseconds to milliseconds
}

function generateScenarioList(report, type) {
  let html = '';
  report.forEach(feature => {
    feature.elements.forEach(scenario => {
      const status = scenario.steps.every(step => step.result?.status === 'passed') ? '✅' : '❌';
      html += `
        <div class="scenario ${type}">
          <div class="scenario-name">${status} ${scenario.name}</div>
          <div class="scenario-steps">${scenario.steps.filter(s => !s.hidden).length} pasos</div>
        </div>
      `;
    });
  });
  return html;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateCustomReport();
}

module.exports = { generateCustomReport };