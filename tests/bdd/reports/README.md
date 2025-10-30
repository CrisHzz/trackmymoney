# 📊 Reportes BDD - TrackMyMoney

Este directorio contiene los reportes generados por las pruebas BDD (Behavior Driven Development).

## 🚀 Tipos de Reportes

### 1. **Cucumber Simple** (Desarrollo rápido)
- **Comando**: `npm run test:bdd`
- **HTML**: `cucumber-report.html`
- **JSON**: `cucumber-report.json`
- **Características**:
  - ⚡ Generación rápida
  - 📝 Reporte básico pero completo
  - 🔧 Ideal para desarrollo diario

### 2. **Cucumber Avanzado** (Demos y documentación)
- **Comando**: `npm run test:bdd:serenity`
- **HTML**: `serenity-cucumber-report.html`
- **JSON**: `serenity-cucumber-report.json`
- **Características**:
  - 📊 Logs más detallados
  - 🎨 Interfaz mejorada
  - 📋 Mejor para presentaciones

## 🎯 Comandos Útiles

```bash
# Ejecutar pruebas y generar reportes
npm run test:bdd                    # Reporte simple
npm run test:bdd:serenity          # Reporte avanzado
npm run test:bdd:all               # Ambos + comparativo

# Ver información de reportes
npm run test:bdd:report

# Abrir reportes en el navegador
npm run test:bdd:open              # Reporte simple
npm run test:bdd:open:advanced     # Reporte avanzado
npm run test:bdd:compare           # Reporte comparativo
```

## 📈 Contenido de los Reportes

Ambos reportes incluyen:
- ✅ **10 escenarios** ejecutados
- ✅ **41 pasos** en total
- 📊 Estadísticas de ejecución
- 🕒 Tiempos de ejecución
- 📝 Logs detallados de cada paso

## 🔍 Diferencias Clave

| Aspecto | Simple | Avanzado |
|---------|--------|----------|
| **Velocidad** | ~4.1s | ~5.4s |
| **Logs** | `[BDD]` | `[Serenity BDD]` |
| **Detalle** | Básico | Mejorado |
| **Uso** | Desarrollo | Demos/Docs |

## 📁 Estructura de Archivos

```
tests/bdd/reports/
├── README.md                           # Este archivo
├── comparison-report.html              # 🆕 Reporte comparativo personalizado
├── cucumber-report.html                # Reporte HTML simple
├── cucumber-report.json                # Datos JSON simple
├── serenity-cucumber-report.html       # Reporte HTML avanzado
├── serenity-cucumber-report.json       # Datos JSON avanzado
└── serenity/                          # Directorio para futuros reportes Serenity
```

---

**Nota**: Los reportes se regeneran cada vez que ejecutas las pruebas BDD.