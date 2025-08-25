# 📋 Programa de Pruebas - TrackMyMoney

## 🎯 Descripción General

Este documento describe el programa completo de pruebas unitarias para la aplicación TrackMyMoney, enfocado en **Next.js + Prisma + Clerk** sin dependencias de Elasticsearch. Las pruebas están diseñadas con enfoque de **caja blanca (whitebox)** para validar la lógica interna, condiciones, flujos, validaciones y cálculos del sistema.

## 📊 Resumen Ejecutivo

- **Total de archivos de prueba:** 7
- **Total de tests esperados:** ~99
- **Tests pasando:** ~86
- **Cobertura objetivo:** >70% (statements, branches, functions, lines)
- **Framework:** Jest + Testing Library
- **Enfoque:** Caja Blanca (Whitebox Testing)

## 🏗️ Estructura del Programa de Pruebas

### 📁 Organización de Archivos

```
src/
├── lib/__tests__/
│   ├── dateUtils.test.ts              # ✅ Utilidades de fecha
│   ├── financeCalculations.test.ts    # ✅ Cálculos financieros
│   └── dataValidations.test.ts        # ✅ Validaciones y seguridad
├── app/api/
│   ├── gastos/__tests__/
│   │   └── route.test.ts              # ✅ API REST de gastos
│   ├── gastos/[id]/__tests__/
│   │   └── route.test.ts              # ✅ CRUD gastos individuales
│   ├── ingresos/__tests__/
│   │   └── route.test.ts              # ✅ API REST de ingresos
│   └── categorias/__tests__/
│       └── route.test.ts              # ✅ API REST de categorías
```

## 🔬 Módulos Probados

### 1. 🗓️ Utilidades de Fecha (`dateUtils.test.ts`)

**Funciones cubiertas:**
- `getTodayLocalDate()` - Fecha actual en formato YYYY-MM-DD
- `formatDateForInput()` - Formateo para inputs HTML
- `getCurrentDateTime()` - Fecha y hora completa ISO
- `parseLocalDate()` - Parsing sin problemas de zona horaria
- `stringToDateForDB()` - Conversión segura para base de datos
- `formatDisplayDate()` - Formato de visualización en español

**Casos de prueba:**
- ✅ **Casos positivos:** funcionalidad normal
- ❌ **Casos negativos:** formatos inválidos
- 🔄 **Casos límite:** fechas extremas, años bisiestos
- 🔗 **Integración:** consistencia entre funciones
- ⚡ **Rendimiento:** múltiples llamadas rápidas

**Ejemplos específicos:**
```javascript
// Casos positivos
test('debe devolver la fecha actual en formato YYYY-MM-DD')
test('debe formatear fecha válida correctamente')
test('debe parsear fecha válida correctamente')

// Casos límite
test('debe manejar primer día del año correctamente')
test('debe manejar años extremos')
test('debe ser rápido para múltiples llamadas')
```

### 2. 💰 Cálculos Financieros (`financeCalculations.test.ts`)

**Funciones cubiertas:**
- `calcularTotalGastos()` - Suma de gastos
- `calcularTotalIngresos()` - Suma de ingresos
- `calcularBalance()` - Balance total (ingresos - gastos)
- `agruparPorCategoria()` - Agrupación por categorías
- `calcularDatosMensuales()` - Estadísticas mensuales

**Casos de prueba:**
- ✅ **Cálculos válidos:** datos correctos
- ❌ **Arrays vacíos:** manejo de datos nulos
- 🔢 **Conversión de tipos:** strings a números
- 📊 **Agrupaciones:** por categoría y tipo
- 📅 **Filtrado temporal:** por fechas y años
- 🎯 **Precisión decimal:** redondeo a 2 decimales
- ⚡ **Grandes volúmenes:** performance con muchos datos

**Ejemplos específicos:**
```javascript
// Cálculos básicos
test('debe calcular total correctamente con gastos válidos')
test('debe calcular balance positivo/negativo correctamente')

// Casos límite
test('debe manejar montos con decimales precisos')
test('debe manejar grandes volúmenes de transacciones')
test('debe redondear valores a 2 decimales')
```

### 3. 🛡️ Validaciones y Seguridad (`dataValidations.test.ts`)

**Funciones cubiertas:**
- `validarMonto()` - Validación de montos monetarios
- `validarFecha()` - Validación de fechas
- `validarEmail()` - Validación de emails
- `validarTipoIngreso()` - Tipos de ingreso válidos
- `validarCategoria()` - IDs de categoría
- `sanitizarTexto()` - Limpieza y prevención XSS
- `validarAccesoUsuario()` - Control de acceso

**Casos de prueba:**
- ✅ **Validaciones exitosas:** datos correctos
- ❌ **Datos inválidos:** formatos incorrectos
- 🛡️ **Prevención XSS:** scripts maliciosos
- 🚫 **Control de acceso:** verificación de permisos
- 📏 **Límites de longitud:** texto máximo
- 🔒 **Casos de seguridad:** overflow, inyección

**Ejemplos específicos:**
```javascript
// Validaciones básicas
test('debe validar montos válidos')
test('debe rechazar fechas futuras')
test('debe validar emails válidos')

// Seguridad
test('debe prevenir XSS en nombres de categorías')
test('debe validar montos máximos para prevenir overflow')
test('debe rechazar acceso a recursos de otros usuarios')
```

### 4. 🚀 APIs REST

#### 4.1 API de Gastos (`gastos/route.test.ts`)

**Endpoints probados:**
- `GET /api/gastos` - Listar gastos del usuario
- `POST /api/gastos` - Crear nuevo gasto

**Casos de prueba:**
- ✅ **Operaciones exitosas:** datos válidos
- 🔐 **Autenticación:** verificación de usuario
- ❌ **Validación de campos:** obligatorios y opcionales
- 🔄 **Conversión de tipos:** strings a números
- 👤 **Gestión de usuarios:** creación automática
- 🏷️ **Validación de categorías:** existencia
- ⚠️ **Manejo de errores:** base de datos

**Ejemplos específicos:**
```javascript
// Operaciones CRUD
test('debe devolver gastos del usuario autenticado')
test('debe crear gasto con datos válidos')

// Validaciones
test('debe rechazar monto cero')
test('debe devolver 400 si categoría no existe')
test('debe convertir categoria_id de string a número')

// Seguridad
test('debe devolver 401 si usuario no está autenticado')
test('debe crear usuario si no existe en BD')
```

#### 4.2 API de Ingresos (`ingresos/route.test.ts`)

**Endpoints probados:**
- `GET /api/ingresos` - Listar ingresos del usuario
- `POST /api/ingresos` - Crear nuevo ingreso

**Casos específicos:**
- 📋 **Tipos de ingreso:** validación de categorías
- 🔄 **Ingresos recurrentes:** frecuencias
- 📅 **Rangos de fechas:** validación temporal
- 💰 **Campos específicos:** tipo_ingreso, recurrente, frecuencia

#### 4.3 CRUD Individual (`gastos/[id]/route.test.ts`)

**Endpoints probados:**
- `GET /api/gastos/[id]` - Obtener gasto específico
- `PUT /api/gastos/[id]` - Actualizar gasto
- `DELETE /api/gastos/[id]` - Eliminar gasto

**Casos específicos:**
- 🆔 **Validación de IDs:** formato y existencia
- 🔒 **Verificación de propiedad:** control de acceso
- ✏️ **Actualizaciones parciales:** campos opcionales
- 🗑️ **Eliminación segura:** verificaciones
- ❌ **Recursos inexistentes:** manejo de errores 404

#### 4.4 API de Categorías (`categorias/route.test.ts`)

**Endpoints probados:**
- `GET /api/categorias` - Listar todas las categorías
- `POST /api/categorias` - Crear nueva categoría

**Casos específicos:**
- 📝 **Validación de nombres:** formato y unicidad
- 🔤 **Caracteres especiales:** tildes y ñ
- 📏 **Límites de longitud:** texto máximo
- 🚫 **Manejo de duplicados:** nombres únicos

## ⚙️ Configuración y Ejecución

### 🛠️ Dependencias de Testing

```json
{
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.2"
  }
}
```

### 📝 Scripts de Prueba

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar en modo watch (desarrollo)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar pruebas específicas
npm run test -- dateUtils.test.ts
npm run test -- --testPathPattern=api/gastos
```

### ⚙️ Configuración de Jest

```javascript
// jest.config.js
{
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

### 🔧 Configuración de Mocks

```javascript
// jest.setup.js - Mocks globales
- Next.js Router
- Clerk Authentication (@clerk/nextjs/server)
- Prisma Client (@prisma/client)
- Utilidades de fecha (@/lib/dateUtils)
```

## 🧪 Tipos de Pruebas Implementadas

### ✅ Pruebas Positivas
- Casos donde todo funciona correctamente
- Datos válidos y flujos normales
- Respuestas exitosas esperadas

### ❌ Pruebas Negativas
- Entradas incorrectas, vacías o mal formateadas
- Errores de validación
- Casos de fallo controlado

### 🔄 Pruebas de Bordes
- Valores en límites permitidos
- Montos en cero, fechas extremas
- Tamaños máximos y mínimos

### 🌐 Pruebas de Lógica Condicional
- Cobertura de todas las ramas de decisión
- Flujos if/else complejos
- Switch statements y validaciones

### 🔢 Pruebas de Tipos de Datos
- Conversiones automáticas
- Tipos inesperados
- Combinaciones que generen resultados específicos

## 📊 Datos de Prueba

### 💰 Montos
- ✅ **Positivos:** 100.50, 2500.00, 0.01
- ❌ **Negativos:** -50.00, -100.25
- 🔢 **Strings:** "150.75", "abc"
- 🚫 **Ceros:** 0, "0"
- ⚡ **Extremos:** Number.MAX_SAFE_INTEGER

### 📅 Fechas
- ✅ **Válidas:** "2024-01-15", "2023-12-31"
- ❌ **Inválidas:** "2024-02-30", "fecha-invalida"
- 📋 **Formatos:** "15/01/2024", "2024-1-15"
- 🚀 **Futuras:** fecha > hoy
- 📜 **Históricas:** fechas muy antiguas

### 📝 Textos
- 📄 **Vacíos:** "", null, undefined
- 📏 **Largos:** 500+ caracteres
- 🌍 **Especiales:** tildes, ñ, símbolos
- 🛡️ **Maliciosos:** scripts, iframes

### 🏷️ Categorías
- ✅ **Válidas:** IDs numéricos positivos
- ❌ **Inválidas:** 0, negativos, strings
- 🔍 **Inexistentes:** ID 999999

### 🆔 Identificadores
- ✅ **Existentes:** IDs válidos en BD
- ❌ **Inexistentes:** IDs no encontrados
- 🚫 **Nulos:** null, undefined
- 🔢 **Inválidos:** strings, negativos

## 📈 Métricas y Cobertura

### 📊 Objetivos de Cobertura
- **Líneas:** > 70%
- **Funciones:** > 70%
- **Branches:** > 70%
- **Statements:** > 70%

### 📈 Métricas de Calidad
- ⚡ **Rendimiento:** < 100ms para operaciones unitarias
- 🎯 **Precisión:** 2 decimales en cálculos financieros
- 🔒 **Seguridad:** Validación de todos los inputs
- 🚫 **Errores:** Manejo controlado de todos los fallos

## 🛠️ Herramientas y Tecnologías

- **Jest** - Framework de pruebas principal
- **@testing-library** - Utilidades de testing para React
- **TypeScript** - Tipado estático
- **Prisma Mocks** - Simulación de base de datos
- **Clerk Mocks** - Simulación de autenticación
- **Next.js Testing** - Pruebas de APIs y componentes

## 🔄 Mantenimiento

### 🔄 Actualización de Pruebas
- Revisar pruebas al modificar lógica de negocio
- Agregar casos para nuevas funcionalidades
- Mantener mocks actualizados con APIs reales

### 📋 Checklist de Nuevas Funciones
- [ ] Casos positivos implementados
- [ ] Casos negativos cubiertos
- [ ] Validaciones de entrada probadas
- [ ] Manejo de errores verificado
- [ ] Casos límite incluidos
- [ ] Cobertura > 70% mantenida

### 🐛 Debug de Pruebas

```bash
# Ejecutar prueba específica con debug
npm run test -- --verbose dateUtils.test.ts

# Ver detalles de cobertura
npm run test:coverage -- --verbose

# Ejecutar con modo watch para desarrollo
npm run test:watch
```

## 🎯 Conclusiones

Este programa de pruebas proporciona una cobertura exhaustiva de la lógica de negocio de TrackMyMoney con enfoque de caja blanca. Las pruebas están diseñadas para:

1. **Detectar errores lógicos** en cálculos financieros
2. **Validar correctamente** todos los datos de entrada
3. **Asegurar la seguridad** del sistema
4. **Mantener la integridad** de los datos
5. **Verificar el rendimiento** en operaciones críticas

### 🚀 Beneficios Logrados

- ✅ **Sin dependencias de Elasticsearch/ELK**
- ✅ **Enfoque en core de Next.js + Prisma + Clerk**
- ✅ **Cobertura exhaustiva de APIs REST**
- ✅ **Validaciones de seguridad robustas**
- ✅ **Cálculos financieros precisos**
- ✅ **Manejo correcto de fechas y zona horaria**

Al ejecutar estas pruebas regularmente, se garantiza que el sistema mantenga su calidad y confiabilidad a medida que evoluciona.

---

**📅 Última actualización:** $(date)  
**📧 Responsable:** Equipo de Desarrollo TrackMyMoney  
**📄 Versión:** 1.0 