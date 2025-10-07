#!/bin/bash
# Script de ayuda para ejecutar pruebas
# Uso: ./tests/run-tests.sh [comando]

set -e

echo "🧪 TrackMyMoney - Test Runner"
echo "=============================="
echo ""

case "${1:-all}" in
  all)
    echo "▶️  Ejecutando todas las pruebas..."
    npm run test:jest
    ;;
  unit)
    echo "▶️  Ejecutando pruebas unitarias..."
    npm run test:jest -- tests/unit
    ;;
  integration)
    echo "▶️  Ejecutando pruebas de integración..."
    npm run test:jest -- tests/integration
    ;;
  coverage)
    echo "▶️  Generando reporte de cobertura..."
    npm run test:coverage
    echo ""
    echo "📊 Reporte disponible en: coverage/lcov-report/index.html"
    ;;
  watch)
    echo "▶️  Iniciando modo watch..."
    npm run test:watch
    ;;
  *)
    echo "Uso: ./tests/run-tests.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  all          - Ejecutar todas las pruebas (por defecto)"
    echo "  unit         - Solo pruebas unitarias"
    echo "  integration  - Solo pruebas de integración"
    echo "  coverage     - Generar reporte de cobertura"
    echo "  watch        - Modo watch para desarrollo"
    echo ""
    exit 1
    ;;
esac

