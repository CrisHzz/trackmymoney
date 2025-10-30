# Pruebas Automatizadas con Cucumber

Este proyecto utiliza **Cucumber** para pruebas automatizadas siguiendo el enfoque BDD (Behavior Driven Development).

## Estructura del Proyecto

```
features/
├── transacciones.feature          # Archivos de características (escenarios)
└── step_definitions/
    ├── transacciones_steps.js     # Implementación de los pasos
    └── testUtils.js               # Utilidades para las pruebas
```

## Comandos Disponibles

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas en modo watch (se ejecutan automáticamente cuando cambias archivos)
```bash
npm run test:watch
```

### Generar reporte JSON
```bash
npm run test:report
```

## Cómo Agregar Nuevos Escenarios

### 1. Crear o editar archivo .feature

Crea un nuevo archivo `.feature` en el directorio `features/` o edita uno existente:

```gherkin
Feature: Nueva Funcionalidad
  Como usuario
  Quiero poder hacer algo específico
  Para lograr un objetivo

  Scenario: Descripción del escenario
    Given que tengo una condición inicial
    When realizo una acción
    Then espero un resultado específico
```

### 2. Implementar los pasos

En el directorio `features/step_definitions/`, crea o edita un archivo JavaScript que implemente los pasos:

```javascript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';

Given('que tengo una condición inicial', function () {
  // Implementar la condición inicial
});

When('realizo una acción', function () {
  // Implementar la acción
});

Then('espero un resultado específico', function () {
  // Verificar el resultado esperado
});
```

### 3. Ejecutar las pruebas

```bash
npm test
```

## Ejemplos de Escenarios

### Escenario con tabla de datos
```gherkin
Scenario: Calcular estadísticas de transacciones
  Given que tengo las siguientes transacciones:
    | tipo    | monto | categoria    |
    | ingreso | 2000  | salario      |
    | gasto   | 500   | alimentación |
    | gasto   | 200   | transporte   |
  When calculo las estadísticas totales
  Then el total de ingresos debe ser "2000" euros
  And el total de gastos debe ser "700" euros
```

### Escenario con parámetros
```gherkin
Scenario: Calcular balance mensual
  Given que tengo ingresos por valor de "1500" euros
  And que tengo gastos por valor de "800" euros
  When calculo el balance mensual
  Then el resultado debe ser "700" euros
```

## Configuración

El archivo `cucumber.js` contiene la configuración de Cucumber:

- **import**: Directorio donde están los step definitions
- **format**: Formato de salida de las pruebas
- **strict**: Modo estricto para pasos no implementados
- **tags**: Filtros por etiquetas

## Librerías Utilizadas

- **@cucumber/cucumber**: Framework principal de BDD
- **chai**: Librería de aserciones para las verificaciones

## Consejos para Escribir Buenas Pruebas

1. **Usa lenguaje natural**: Los escenarios deben ser legibles por cualquier persona
2. **Un escenario = un comportamiento**: Cada escenario debe probar una funcionalidad específica
3. **Given-When-Then**: Estructura clara de precondiciones, acción y resultado
4. **Reutiliza pasos**: Los mismos pasos pueden usarse en múltiples escenarios
5. **Mantén las pruebas simples**: Evita lógica compleja en los step definitions

## Troubleshooting

### Error de módulos ES
Si encuentras errores relacionados con módulos ES, asegúrate de que:
- El `package.json` tenga `"type": "module"`
- Los imports usen la sintaxis ES6: `import { ... } from '...'`
- Los archivos tengan extensión `.js`

### Pasos no implementados
Si Cucumber muestra pasos no implementados, copia el código sugerido y pégalo en tu archivo de step definitions.

### Errores de importación
Verifica que las rutas de importación sean correctas y que los archivos existan.
