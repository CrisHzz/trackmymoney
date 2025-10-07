# Script de ayuda para ejecutar pruebas en PowerShell
# Uso: .\tests\run-tests.ps1 [comando]

param(
    [string]$Command = "all"
)

Write-Host "🧪 TrackMyMoney - Test Runner" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

switch ($Command) {
    "all" {
        Write-Host "▶️  Ejecutando todas las pruebas..." -ForegroundColor Green
        npm run test:jest
    }
    "unit" {
        Write-Host "▶️  Ejecutando pruebas unitarias..." -ForegroundColor Green
        npm run test:jest -- tests/unit
    }
    "integration" {
        Write-Host "▶️  Ejecutando pruebas de integración..." -ForegroundColor Green
        npm run test:jest -- tests/integration
    }
    "coverage" {
        Write-Host "▶️  Generando reporte de cobertura..." -ForegroundColor Green
        npm run test:coverage
        Write-Host ""
        Write-Host "📊 Reporte disponible en: coverage/lcov-report/index.html" -ForegroundColor Yellow
    }
    "watch" {
        Write-Host "▶️  Iniciando modo watch..." -ForegroundColor Green
        npm run test:watch
    }
    default {
        Write-Host "Uso: .\tests\run-tests.ps1 [comando]" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Comandos disponibles:"
        Write-Host "  all          - Ejecutar todas las pruebas (por defecto)"
        Write-Host "  unit         - Solo pruebas unitarias"
        Write-Host "  integration  - Solo pruebas de integración"
        Write-Host "  coverage     - Generar reporte de cobertura"
        Write-Host "  watch        - Modo watch para desarrollo"
        Write-Host ""
        exit 1
    }
}

