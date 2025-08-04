# Guía de Pruebas Unitarias - TrackMyMoney

## Descripción

Este documento describe el conjunto completo de pruebas unitarias con enfoque de **caja blanca (whitebox)** desarrolladas para la aplicación de gestión de dinero TrackMyMoney. Las pruebas están diseñadas para validar la lógica interna, condiciones, flujos, validaciones y cálculos del sistema.

## Estructura de Pruebas

### 📁 Organización de Archivos de Prueba

```
src/
├── lib/__tests__/
│   ├── dateUtils.test.ts              # Utilidades de fecha
│   ├── financeCalculations.test.ts    # Cálculos financieros y saldos
│   ├── transactions.test.ts           # Funciones de transacciones
│   └── dataValidations.test.ts        # Validaciones y seguridad
├── app/api/
│   ├── gastos/__tests__/
│   │   └── route.test.ts              # API de gastos
│   ├── gastos/[id]/__tests__/
│   │   └── route.test.ts              # CRUD gastos individuales
│   ├── ingresos/__tests__/
│   │   └── route.test.ts              # API de ingresos
│   └── categorias/__tests__/
│       └── route.test.ts              # API de categorías
```

## Módulos Probados

### 1. 🗓️ Utilidades de Fecha (`dateUtils.test.ts`)
- **Funciones cubiertas:**
  - `getTodayLocalDate()` - Fecha actual en formato YYYY-MM-DD
  - `formatDateForInput()` - Formateo para inputs HTML
  - `getCurrentDateTime()` - Fecha y hora completa
  - `parseLocalDate()` - Parsing sin problemas de zona horaria
  - `stringToDateForDB()` - Conversión segura para base de datos
  - `formatDisplayDate()` - Formato de visualización en español

- **Casos probados:**
  - ✅ Casos positivos: funcionalidad normal
  - ❌ Casos negativos: formatos inválidos
  - 🔄 Casos límite: fechas extremas, años bisiestos
  - 🔗 Integración entre funciones
  - ⚡ Rendimiento con múltiples llamadas

### 2. 💰 Cálculos Financieros (`financeCalculations.test.ts`)
- **Funciones cubiertas:**
  - `calcularTotalGastos()` - Suma de gastos
  - `calcularTotalIngresos()` - Suma de ingresos
  - `calcularBalance()` - Balance total (ingresos - gastos)
  - `agruparPorCategoria()` - Agrupación por categorías
  - `calcularDatosMensuales()` - Estadísticas mensuales

- **Casos probados:**
  - ✅ Cálculos con datos válidos
  - ❌ Arrays vacíos y datos nulos
  - 🔢 Conversión de tipos (strings a números)
  - 📊 Agrupaciones y filtros
  - 📅 Filtrado por fechas y años
  - 🎯 Precisión decimal
  - ⚡ Rendimiento con grandes volúmenes

### 3. 🔍 Funciones de Transacciones (`transactions.test.ts`)
- **Funciones cubiertas:**
  - `indexTransaction()` - Indexado en Elasticsearch
  - `searchTransactions()` - Búsqueda con filtros
  - `getTransactionStats()` - Estadísticas agregadas
  - `deleteTransaction()` - Eliminación de índices

- **Casos probados:**
  - ✅ Indexado correcto de gastos e ingresos
  - 🔍 Búsquedas con diferentes filtros
  - 📊 Agregaciones estadísticas
  - ❌ Manejo de errores de Elasticsearch
  - 🆔 Generación de IDs únicos
  - 🔗 Consistencia entre operaciones

### 4. 🛡️ Validaciones y Seguridad (`dataValidations.test.ts`)
- **Funciones cubiertas:**
  - `validarMonto()` - Validación de montos
  - `validarFecha()` - Validación de fechas
  - `validarEmail()` - Validación de emails
  - `validarTipoIngreso()` - Tipos de ingreso válidos
  - `validarCategoria()` - IDs de categoría
  - `sanitizarTexto()` - Limpieza de texto
  - `validarAccesoUsuario()` - Control de acceso

- **Casos probados:**
  - ✅ Validaciones exitosas
  - ❌ Datos inválidos o malformados
  - 🛡️ Prevención de XSS y scripts maliciosos
  - 🚫 Control de acceso entre usuarios
  - 📏 Límites de longitud
  - 🔒 Casos de seguridad específicos

### 5. 🚀 APIs REST

#### API de Gastos (`gastos/route.test.ts`)
- **Endpoints probados:**
  - `GET /api/gastos` - Listar gastos del usuario
  - `POST /api/gastos` - Crear nuevo gasto

- **Casos probados:**
  - ✅ Operaciones exitosas con datos válidos
  - 🔐 Autenticación y autorización
  - ❌ Validación de campos obligatorios
  - 🔄 Conversión de tipos de datos
  - 👤 Creación automática de usuarios
  - 🏷️ Validación de categorías
  - ⚠️ Manejo de errores de base de datos

#### API de Ingresos (`ingresos/route.test.ts`)
- **Endpoints probados:**
  - `GET /api/ingresos` - Listar ingresos del usuario
  - `POST /api/ingresos` - Crear nuevo ingreso

- **Casos específicos:**
  - 📋 Validación de tipos de ingreso
  - 🔄 Ingresos recurrentes y frecuencias
  - 📅 Validación de rangos de fechas
  - 💰 Campos específicos de ingresos

#### CRUD Individual (`gastos/[id]/route.test.ts`)
- **Endpoints probados:**
  - `GET /api/gastos/[id]` - Obtener gasto específico
  - `PUT /api/gastos/[id]` - Actualizar gasto
  - `DELETE /api/gastos/[id]` - Eliminar gasto

- **Casos probados:**
  - 🆔 Validación de IDs
  - 🔒 Verificación de propiedad
  - ✏️ Actualizaciones parciales
  - 🗑️ Eliminación segura
  - ❌ Manejo de recursos inexistentes

#### API de Categorías (`categorias/route.test.ts`)
- **Endpoints probados:**
  - `GET /api/categorias` - Listar todas las categorías
  - `POST /api/categorias` - Crear nueva categoría

- **Casos probados:**
  - 📝 Validación de nombres
  - 🔤 Caracteres especiales y tildes
  - 📏 Límites de longitud
  - 🚫 Manejo de duplicados

## Configuración y Ejecución

### Instalación de Dependencias

```bash
# Instalar dependencias de testing
npm install
```

### Comandos de Prueba

```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar pruebas específicas
npm run test -- dateUtils.test.ts
npm run test -- --testPathPattern=api/gastos
```

### Configuración de Jest

El proyecto utiliza Jest con las siguientes configuraciones:

- **Entorno:** jsdom para pruebas de componentes
- **Cobertura mínima:** 70% en branches, functions, lines, statements
- **Mocks:** Automáticos para Prisma, Clerk, Elasticsearch
- **Timeout:** Por defecto para operaciones asíncronas

## Tipos de Pruebas Implementadas

### 🎯 Pruebas Positivas
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

## Técnicas Aplicadas

### 📦 Caja Blanca (Whitebox)
- Revisión de caminos internos del código
- Cobertura de cada bloque y condición
- Validación de lógica interna

### 🔍 Partición de Clases de Equivalencia
- Agrupación de datos con comportamientos similares
- Prueba de valores representativos de cada grupo

### ⚖️ Análisis de Valores Límite
- Pruebas en, antes y después de valores límite
- Casos extremos y condiciones boundary

## Datos de Prueba

### 💰 Montos
- ✅ Positivos: 100.50, 2500.00, 0.01
- ❌ Negativos: -50.00, -100.25
- 🔢 Strings: "150.75", "abc"
- 🚫 Ceros: 0, "0"
- ⚡ Extremos: Number.MAX_SAFE_INTEGER

### 📅 Fechas
- ✅ Válidas: "2024-01-15", "2023-12-31"
- ❌ Inválidas: "2024-02-30", "fecha-invalida"
- 📋 Formatos: "15/01/2024", "2024-1-15"
- 🚀 Futuras: fecha > hoy
- 📜 Históricas: fechas muy antiguas

### 📝 Textos
- 📄 Vacíos: "", null, undefined
- 📏 Largos: 500+ caracteres
- 🌍 Especiales: tildes, ñ, símbolos
- 🛡️ Maliciosos: scripts, iframes

### 🏷️ Categorías
- ✅ Válidas: IDs numéricos positivos
- ❌ Inválidas: 0, negativos, strings
- 🔍 Inexistentes: ID 999999

### 🆔 Identificadores
- ✅ Existentes: IDs válidos en BD
- ❌ Inexistentes: IDs no encontrados
- 🚫 Nulos: null, undefined
- 🔢 Inválidos: strings, negativos

## Cobertura y Métricas

### 📊 Objetivos de Cobertura
- **Líneas:** > 70%
- **Funciones:** > 70%
- **Branches:** > 70%
- **Statements:** > 70%

### 📈 Métricas de Calidad
- ⚡ Rendimiento: < 100ms para operaciones unitarias
- 🎯 Precisión: 2 decimales en cálculos financieros
- 🔒 Seguridad: Validación de todos los inputs
- 🚫 Errores: Manejo controlado de todos los fallos

## Herramientas y Tecnologías

- **Jest** - Framework de pruebas
- **@testing-library** - Utilidades de testing
- **TypeScript** - Tipado estático
- **Prisma Mocks** - Simulación de base de datos
- **Clerk Mocks** - Simulación de autenticación
- **Elasticsearch Mocks** - Simulación de búsquedas

## Mantenimiento

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

## Conclusión

Este conjunto de pruebas unitarias proporciona una cobertura exhaustiva de la lógica de negocio de TrackMyMoney con enfoque de caja blanca. Las pruebas están diseñadas para:

1. **Detectar errores lógicos** en cálculos financieros
2. **Validar correctamente** todos los datos de entrada
3. **Asegurar la seguridad** del sistema
4. **Mantener la integridad** de los datos
5. **Verificar el rendimiento** en operaciones críticas

Al ejecutar estas pruebas regularmente, se garantiza que el sistema mantenga su calidad y confiabilidad a medida que evoluciona. 