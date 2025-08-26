# Pruebas de Escenarios - TrackMyMoney

Este directorio contiene las pruebas unitarias específicas para todos los escenarios definidos en el archivo `Test sheet.xlsx - Escenarios.csv`.

## Estructura de Archivos

### CP001-CP004-OfflineStorage.test.ts
**Escenarios cubiertos:**
- **CP001** - CreateOfflineGasto: Validar creación de gastos offline
- **CP002** - SaveOfflineGastos: Verificar persistencia de gastos offline  
- **CP003** - GetOfflineGastos: Consultar lista de gastos offline
- **CP004** - RemoveOfflineGasto: Eliminar gastos almacenados offline

**Funcionalidades probadas:**
- Almacenamiento en localStorage
- Validación de campos obligatorios
- Manejo de errores de almacenamiento
- Persistencia de datos
- Rendimiento y métricas

### CP005-SearchTransactions.test.ts
**Escenarios cubiertos:**
- **CP005** - SearchTransactions: Búsqueda y filtros de transacciones

**Funcionalidades probadas:**
- Filtros por categoría
- Filtros por fecha (rango)
- Filtros por descripción
- Filtros por tipo de transacción
- Combinación de múltiples filtros
- Rendimiento de búsqueda (< 2 segundos)
- Precisión de resultados

### CP006-CP007-UserManagement.test.ts
**Escenarios cubiertos:**
- **CP006** - DeleteUser: Eliminación segura de usuarios
- **CP007** - GetUserTransaction: Consulta de transacciones de usuario

**Funcionalidades probadas:**
- Confirmación antes de eliminación
- Eliminación de datos asociados
- Autenticación de usuarios
- Filtrado por usuario autenticado
- Ordenamiento por fecha
- Manejo de usuarios sin datos

### CP008-UserAuth.test.ts
**Escenarios cubiertos:**
- **CP008** - UserAuth: Autenticación de usuarios con Clerk

**Funcionalidades probadas:**
- Autenticación con credenciales correctas
- Manejo de credenciales incorrectas
- Validación de campos
- Implementación de CAPTCHA
- Verificación de email
- Integración con Clerk
- Métricas de rendimiento

### CP009-CP010-CategoryManagement.test.ts
**Escenarios cubiertos:**
- **CP009** - GetCategory: Consulta de categorías disponibles
- **CP010** - CreateCategory: Creación de categorías personalizadas

**Funcionalidades probadas:**
- Listado de categorías por usuario
- Ordenamiento alfabético
- Creación de nuevas categorías
- Validación de duplicados
- Validación de campos
- Autorización por usuario

## Ejecutar las Pruebas

### Ejecutar todas las pruebas de escenarios:
```bash
npm test pruebas_escenarios/
```

### Ejecutar pruebas específicas:
```bash
# Solo pruebas de almacenamiento offline
npm test pruebas_escenarios/CP001-CP004-OfflineStorage.test.ts

# Solo pruebas de búsqueda
npm test pruebas_escenarios/CP005-SearchTransactions.test.ts

# Solo pruebas de gestión de usuarios  
npm test pruebas_escenarios/CP006-CP007-UserManagement.test.ts

# Solo pruebas de autenticación
npm test pruebas_escenarios/CP008-UserAuth.test.ts

# Solo pruebas de categorías
npm test pruebas_escenarios/CP009-CP010-CategoryManagement.test.ts
```

### Ejecutar con cobertura:
```bash
npm run test:coverage -- pruebas_escenarios/
```

### Ejecutar en modo watch:
```bash
npm run test:watch -- pruebas_escenarios/
```

## Criterios de Aceptación

Todas las pruebas están diseñadas para validar los criterios de aceptación específicos definidos en cada escenario:

### Métricas de Rendimiento
- **Búsqueda de transacciones**: < 2 segundos
- **Operaciones CRUD**: < 100ms
- **Autenticación**: < 100ms
- **Carga de grandes volúmenes**: < 200ms

### Validaciones de Seguridad
- Autenticación requerida para operaciones sensibles
- Validación de autorización por usuario
- Implementación de CAPTCHA tras intentos fallidos
- Sanitización de entradas

### Integridad de Datos
- Validación de campos obligatorios
- Prevención de duplicados
- Consistencia de datos entre operaciones
- Manejo de errores y casos edge

## Cobertura de Pruebas

Estas pruebas unitarias cubren:
- ✅ **100%** de los escenarios definidos en el CSV
- ✅ **Casos positivos**: Flujos exitosos
- ✅ **Casos negativos**: Manejo de errores
- ✅ **Casos edge**: Situaciones límite
- ✅ **Validaciones**: Campos obligatorios y formatos
- ✅ **Rendimiento**: Tiempos de respuesta
- ✅ **Seguridad**: Autenticación y autorización

## Mantenimiento

Para agregar nuevos escenarios:

1. Actualizar el archivo CSV con el nuevo escenario
2. Crear las pruebas correspondientes en el archivo apropiado
3. Seguir la estructura de pruebas existente:
   - Descripción del escenario
   - Casos positivos y negativos
   - Validaciones
   - Métricas de rendimiento
4. Actualizar este README si es necesario

## Notas Importantes

- Todas las pruebas son **unitarias**: No dependen de APIs externas, bases de datos reales, o servicios externos
- Se utilizan **mocks y simulaciones** para aislar la lógica de negocio
- Las funciones probadas son **puras** y **determinísticas**
- Se incluyen **métricas de rendimiento** para cada operación crítica
- Se validan **todos los criterios de aceptación** especificados en los escenarios