# 📑 Índice de Documentación de Pruebas

Guía de navegación para toda la documentación de pruebas del proyecto.

---

## 🚀 Inicio Rápido

**¿Primera vez aquí? Comienza por aquí:**

1. **[RESUMEN_IMPLEMENTACION.md](../RESUMEN_IMPLEMENTACION.md)** ⭐
   - Qué se implementó
   - Cómo ejecutar las pruebas
   - Ejemplos básicos

2. **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)** 
   - Comandos esenciales
   - Plantillas de código
   - Ejemplos copy-paste

---

## 📚 Documentación Completa

### Para Desarrolladores

| Documento | Contenido | Cuándo Leerlo |
|-----------|-----------|---------------|
| **[README.md](README.md)** | Documentación completa de la arquitectura | Cuando necesites entender a fondo cómo funcionan las pruebas |
| **[GUIA_RAPIDA.md](GUIA_RAPIDA.md)** | Referencia rápida de comandos y código | Cuando necesites copiar ejemplos rápidamente |
| **[ARQUITECTURA_PRUEBAS.md](../ARQUITECTURA_PRUEBAS.md)** | Visión general del sistema de pruebas | Para entender decisiones de diseño y estructura |

### Para Verificación

| Documento | Contenido | Cuándo Leerlo |
|-----------|-----------|---------------|
| **[VERIFICACION_PRUEBAS.md](../VERIFICACION_PRUEBAS.md)** | Checklist de verificación paso a paso | Después de implementar o antes de PR |
| **[RESUMEN_IMPLEMENTACION.md](../RESUMEN_IMPLEMENTACION.md)** | Resumen ejecutivo de lo implementado | Para overview rápido del proyecto |

---

## 🗂️ Estructura de Archivos

```
proyecto/
│
├── tests/                          # Carpeta principal de pruebas
│   ├── unit/                       # Pruebas unitarias (5 archivos)
│   │   ├── mathUtils.test.ts
│   │   ├── arrayUtils.test.ts
│   │   ├── dateUtils.test.ts
│   │   ├── stringUtils.test.ts
│   │   └── categoryManagement.test.ts
│   │
│   ├── integration/                # Pruebas de integración (3 archivos)
│   │   ├── gastos.api.test.ts
│   │   ├── ingresos.api.test.ts
│   │   └── categorias.api.test.ts
│   │
│   ├── __mocks__/                  # Mocks centralizados
│   │   ├── prisma.ts
│   │   └── clerk.ts
│   │
│   ├── __fixtures__/               # Datos de prueba
│   │   └── testData.ts
│   │
│   ├── README.md                   # 📖 Documentación completa
│   ├── GUIA_RAPIDA.md             # 🚀 Referencia rápida
│   ├── INDICE.md                  # 📑 Este archivo
│   ├── run-tests.sh               # Script helper Unix
│   └── run-tests.ps1              # Script helper Windows
│
├── ARQUITECTURA_PRUEBAS.md        # 🏗️ Visión general
├── VERIFICACION_PRUEBAS.md        # ✅ Checklist de verificación
├── RESUMEN_IMPLEMENTACION.md      # 📋 Resumen ejecutivo
│
├── jest.config.js                 # Configuración de Jest
└── jest.setup.js                  # Setup global de pruebas
```

---

## 🎯 Rutas de Aprendizaje

### Ruta 1: Ejecutar Pruebas Rápidamente

1. [GUIA_RAPIDA.md](GUIA_RAPIDA.md) → Ver comandos
2. Ejecutar: `npm run test:jest`
3. Ver cobertura: `npm run test:coverage`

### Ruta 2: Escribir Nueva Prueba Unitaria

1. [GUIA_RAPIDA.md](GUIA_RAPIDA.md) → Copiar plantilla de test unitario
2. Ver ejemplo: `tests/unit/mathUtils.test.ts`
3. [README.md](README.md) → Sección "Escribir Nuevas Pruebas"

### Ruta 3: Escribir Nueva Prueba de Integración

1. [GUIA_RAPIDA.md](GUIA_RAPIDA.md) → Copiar plantilla de test integración
2. Ver ejemplo: `tests/integration/gastos.api.test.ts`
3. [README.md](README.md) → Sección "Pruebas de Integración"

### Ruta 4: Entender la Arquitectura

1. [RESUMEN_IMPLEMENTACION.md](../RESUMEN_IMPLEMENTACION.md) → Overview
2. [ARQUITECTURA_PRUEBAS.md](../ARQUITECTURA_PRUEBAS.md) → Detalles
3. [README.md](README.md) → Documentación completa

### Ruta 5: Verificar Implementación

1. [VERIFICACION_PRUEBAS.md](../VERIFICACION_PRUEBAS.md) → Checklist
2. Ejecutar comandos de verificación
3. Revisar reporte de cobertura

---

## 🔍 Buscar por Tema

### Comandos de Pruebas
→ [GUIA_RAPIDA.md](GUIA_RAPIDA.md) - Sección "Comandos Esenciales"

### Patrón AAA
→ [README.md](README.md) - Sección "Patrón AAA"  
→ [ARQUITECTURA_PRUEBAS.md](../ARQUITECTURA_PRUEBAS.md) - Sección "Principios Aplicados"

### Principios FIRST
→ [README.md](README.md) - Sección "Principios FIRST"  
→ [RESUMEN_IMPLEMENTACION.md](../RESUMEN_IMPLEMENTACION.md) - Sección "Principios Implementados"

### Mocks y Test Doubles
→ [README.md](README.md) - Sección "Mocks y Test Doubles"  
→ Archivos: `tests/__mocks__/prisma.ts`, `tests/__mocks__/clerk.ts`

### Fixtures de Datos
→ [README.md](README.md) - Sección "Fixtures"  
→ Archivo: `tests/__fixtures__/testData.ts`

### Fluent Assertions
→ [GUIA_RAPIDA.md](GUIA_RAPIDA.md) - Sección "Assertions Más Comunes"  
→ [README.md](README.md) - Sección "Fluent Assertions"

### Debugging
→ [README.md](README.md) - Sección "Debugging de Tests"  
→ [GUIA_RAPIDA.md](GUIA_RAPIDA.md) - Sección "Debugging"

### Troubleshooting
→ [VERIFICACION_PRUEBAS.md](../VERIFICACION_PRUEBAS.md) - Sección "Troubleshooting"

---

## 📊 Estadísticas del Proyecto

- **Pruebas Unitarias**: 40+ tests
- **Pruebas de Integración**: 22+ tests
- **Archivos de Prueba**: 8 archivos
- **Mocks Centralizados**: 2 archivos
- **Fixtures**: 1 archivo
- **Documentación**: 6 archivos

---

## 🎓 Recursos Externos

### Testing en General
- [Jest Official Docs](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)

### Patrones y Principios
- [FIRST Principles](https://github.com/ghsukumar/SFDC_Best_Practices/wiki/F.I.R.S.T-Principles-of-Unit-Testing)
- [AAA Pattern](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)
- [Test Doubles](https://martinfowler.com/bliki/TestDouble.html)

---

## ❓ FAQs Rápidas

**¿Cómo ejecuto las pruebas?**
→ `npm run test:jest`

**¿Cómo veo la cobertura?**
→ `npm run test:coverage`

**¿Dónde están las plantillas de código?**
→ [GUIA_RAPIDA.md](GUIA_RAPIDA.md)

**¿Cómo creo un mock?**
→ Ver `tests/__mocks__/` o [README.md](README.md) sección "Mocks"

**¿Cómo uso fixtures?**
→ Ver `tests/__fixtures__/testData.ts` o [GUIA_RAPIDA.md](GUIA_RAPIDA.md)

**¿Qué son los principios FIRST?**
→ [RESUMEN_IMPLEMENTACION.md](../RESUMEN_IMPLEMENTACION.md) sección "Principios FIRST"

**¿Cómo se aplica el patrón AAA?**
→ Ver ejemplos en cualquier archivo `.test.ts` o [README.md](README.md)

---

## 🔗 Enlaces Rápidos

| Acción | Enlace |
|--------|--------|
| 🚀 Empezar rápido | [RESUMEN_IMPLEMENTACION.md](../RESUMEN_IMPLEMENTACION.md) |
| 📖 Leer todo | [README.md](README.md) |
| 💻 Copiar código | [GUIA_RAPIDA.md](GUIA_RAPIDA.md) |
| ✅ Verificar | [VERIFICACION_PRUEBAS.md](../VERIFICACION_PRUEBAS.md) |
| 🏗️ Arquitectura | [ARQUITECTURA_PRUEBAS.md](../ARQUITECTURA_PRUEBAS.md) |

---

## 📝 Notas

- Todos los documentos están en español
- Los ejemplos de código incluyen comentarios explicativos
- La documentación sigue el principio DRY (Don't Repeat Yourself)
- Se excluyen pruebas de PWA, offline, E2E según requisitos

---

*Última actualización: Octubre 2025*

