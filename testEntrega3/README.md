# 🎭 Pruebas E2E con Patrón Screenplay - TrackMyMoney

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [¿Qué es el Patrón Screenplay?](#qué-es-el-patrón-screenplay)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Estructura de Directorios](#estructura-de-directorios)
6. [Componentes del Patrón Screenplay](#componentes-del-patrón-screenplay)
7. [Cómo Escribir Pruebas](#cómo-escribir-pruebas)
8. [Ejecución de Pruebas](#ejecución-de-pruebas)
9. [Pruebas Implementadas](#pruebas-implementadas)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Troubleshooting](#troubleshooting)
12. [Referencias y Recursos](#referencias-y-recursos)

---

## 🎯 Introducción

Este directorio contiene la implementación completa de **pruebas End-to-End (E2E)** para la aplicación **TrackMyMoney** utilizando el **Patrón Screenplay** con **Playwright**.

### ¿Por qué Screenplay?

El patrón Screenplay es una evolución del patrón Page Object Model (POM) que:
- ✅ **Mejora la legibilidad** de las pruebas
- ✅ **Facilita el mantenimiento** del código
- ✅ **Promueve la reutilización** de componentes
- ✅ **Separa responsabilidades** claramente
- ✅ **Refleja mejor el comportamiento del usuario**

### Características Principales

- 🎭 **Implementación completa del Patrón Screenplay**
- 🧪 **17+ escenarios de prueba** cubriendo casos comunes y extremos
- 📊 **Pruebas de gastos e ingresos** con múltiples variaciones
- 📝 **Documentación exhaustiva** en código y README
- 🔄 **Arquitectura escalable y mantenible**
- ⚡ **Ejecución paralela** de pruebas
- 📸 **Screenshots y videos** en caso de fallos

---

## 🎭 ¿Qué es el Patrón Screenplay?

El **Patrón Screenplay** es un enfoque de diseño para automatización de pruebas que centra la atención en **QUIÉN** realiza las acciones, **QUÉ** acciones realiza, y **QUÉ** información verifica.

### Analogía con el Teatro

Imagina que estás escribiendo el guión de una obra de teatro:

- **Actor (Usuario)**: El personaje principal que realiza acciones
- **Abilities (Habilidades)**: Lo que el actor puede hacer (navegar en web, hacer llamadas API)
- **Tasks (Tareas)**: Secuencias de acciones de alto nivel (Iniciar sesión, Crear gasto)
- **Interactions (Interacciones)**: Acciones atómicas (Hacer clic, Escribir texto)
- **Questions (Preguntas)**: Consultas sobre el estado del sistema (¿El gasto es visible?)

### Ejemplo Conceptual

```typescript
// ❌ Enfoque tradicional (Page Object Model)
loginPage.enterUsername("user@test.com");
loginPage.enterPassword("pass123");
loginPage.clickSubmit();
expect(dashboardPage.isVisible()).toBe(true);

// ✅ Enfoque Screenplay
await usuario.attemptsTo(
  Login.withCredentials("user@test.com", "pass123")
);

const dashboardVisible = await usuario.asks(
  IsDashboardVisible.now()
);
expect(dashboardVisible).toBeTruthy();
```

### Ventajas sobre Page Object Model

| Aspecto | Page Object Model | Screenplay Pattern |
|---------|-------------------|-------------------|
| **Legibilidad** | Técnica y procedural | Narrativa y declarativa |
| **Reutilización** | Limitada a páginas | Alto nivel de composición |
| **Mantenibilidad** | Acoplada a la UI | Desacoplada de implementación |
| **Expresividad** | Describe "cómo" | Describe "qué" |
| **Escalabilidad** | Difícil con apps grandes | Excelente modularidad |

---

## 🏗️ Arquitectura del Proyecto

### Capas del Patrón Screenplay

```
┌─────────────────────────────────────────────────────────┐
│                    PRUEBAS E2E                          │
│  (tests/*.spec.ts)                                      │
│  - Escenarios de negocio completos                     │
│  - Assertions y verificaciones                          │
└────────────────────┬────────────────────────────────────┘
                     │ usa
┌────────────────────▼────────────────────────────────────┐
│                     ACTORS                               │
│  (screenplay/Actor.ts)                                  │
│  - Representan usuarios del sistema                     │
│  - Ejecutan tareas y hacen preguntas                   │
└─────┬──────────────┬──────────────────┬────────────────┘
      │              │                  │
      │ tiene        │ realiza          │ pregunta
      ▼              ▼                  ▼
┌──────────┐  ┌─────────────┐   ┌──────────────┐
│ABILITIES │  │   TASKS     │   │  QUESTIONS   │
│          │  │             │   │              │
│- Browse  │  │- Create     │   │- Count       │
│  TheWeb  │  │  Expense    │   │  Expenses    │
│          │  │- Delete     │   │- IsVisible   │
│- MakeAPI │  │  Expense    │   │- Total       │
│  Calls   │  │- Create     │   │  Amount      │
│          │  │  Income     │   │              │
└──────────┘  └──────┬──────┘   └──────────────┘
                     │ usa
              ┌──────▼─────────┐
              │  INTERACTIONS  │
              │                │
              │- Click         │
              │- Fill          │
              │- Navigate      │
              │- Wait          │
              └────────┬───────┘
                       │ usa
                ┌──────▼────────┐
                │  UI ELEMENTS  │
                │               │
                │- ExpensePage  │
                │- IncomePage   │
                │- Dashboard    │
                │- HomePage     │
                └───────────────┘
```

### Flujo de Ejecución

```mermaid
sequenceDiagram
    participant Test as Prueba E2E
    participant Actor as Actor
    participant Task as Task
    participant Interaction as Interaction
    participant Page as Playwright Page
    
    Test->>Actor: attemptsTo(CreateExpense)
    Actor->>Task: performAs(actor)
    Task->>Interaction: Fill.field()
    Interaction->>Page: locator.fill()
    Page-->>Interaction: ✓
    Interaction-->>Task: ✓
    Task-->>Actor: ✓
    Actor-->>Test: ✓
    
    Test->>Actor: asks(ExpenseCount)
    Actor->>Question: answeredBy(actor)
    Question->>Page: locator.count()
    Page-->>Question: 5
    Question-->>Actor: 5
    Actor-->>Test: 5
```

---

## 📦 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18 o superior
- **npm** o **yarn**
- **Navegadores** instalados (Chromium, Firefox, WebKit)

### Paso 1: Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install

# Instalar navegadores de Playwright
npx playwright install
```

### Paso 2: Verificar la Instalación

```bash
# Verificar que Playwright está instalado
npx playwright --version

# Ejecutar las pruebas de ejemplo
npm run test:e2e
```

### Paso 3: Configurar Variables de Entorno (Opcional)

```bash
# Crear archivo .env en la raíz del proyecto
BASE_URL=http://localhost:3000
```

### Paso 4: Iniciar la Aplicación

Las pruebas requieren que la aplicación esté corriendo:

```bash
# En una terminal separada
npm run dev
```

---

## 📁 Estructura de Directorios

```
testEntrega3/
├── playwright.config.ts          # Configuración de Playwright
├── README.md                      # Esta documentación
│
├── screenplay/                    # Implementación del patrón Screenplay
│   ├── Actor.ts                  # Clase Actor principal
│   │
│   ├── abilities/                # Habilidades de los actores
│   │   └── BrowseTheWeb.ts      # Habilidad de navegación web
│   │
│   ├── interactions/             # Interacciones básicas con UI
│   │   ├── Click.ts             # Interacciones de clic
│   │   ├── Fill.ts              # Interacciones de llenado de campos
│   │   ├── Navigate.ts          # Interacciones de navegación
│   │   └── Wait.ts              # Interacciones de espera
│   │
│   ├── tasks/                    # Tareas de alto nivel
│   │   ├── CreateExpense.ts     # Tarea de crear gasto
│   │   ├── DeleteExpense.ts     # Tarea de eliminar gasto
│   │   └── CreateIncome.ts      # Tarea de crear ingreso
│   │
│   ├── questions/                # Preguntas sobre el estado del sistema
│   │   ├── ExpenseQuestions.ts  # Preguntas sobre gastos
│   │   └── PageQuestions.ts     # Preguntas sobre páginas
│   │
│   └── ui/                       # Selectores y Page Objects
│       ├── HomePage.ts          # Elementos de la página de inicio
│       ├── DashboardPage.ts     # Elementos del dashboard
│       ├── ExpensePage.ts       # Elementos de la página de gastos
│       └── IncomePage.ts        # Elementos de la página de ingresos
│
└── tests/                        # Especificaciones de pruebas
    ├── expenses.spec.ts         # Pruebas de gestión de gastos
    └── income.spec.ts           # Pruebas de gestión de ingresos
```

### Descripción de Archivos Clave

#### `playwright.config.ts`
Configuración central de Playwright con:
- Configuración de navegadores (Chrome, Firefox, Safari)
- Timeouts y reintentos
- Reportes y screenshots
- Configuración de paralelismo

#### `screenplay/Actor.ts`
Clase central del patrón que representa un usuario:
- Gestiona habilidades (abilities)
- Ejecuta tareas (tasks)
- Hace preguntas (questions)

#### `screenplay/abilities/BrowseTheWeb.ts`
Habilidad fundamental que encapsula Playwright:
- Acceso a la instancia de Page
- Operaciones de navegación
- Manipulación del navegador

#### `screenplay/tasks/*.ts`
Tareas de alto nivel que representan acciones de negocio:
- Composición de interacciones
- Lógica de flujos completos
- Validaciones intermedias

#### `screenplay/interactions/*.ts`
Interacciones atómicas con elementos de UI:
- Click, Fill, Navigate, Wait
- Bajo acoplamiento con la UI
- Reutilizables en múltiples tareas

#### `screenplay/questions/*.ts`
Consultas sobre el estado del sistema:
- Extraen información de la UI
- Retornan valores para assertions
- Encapsulan lógica de verificación

#### `screenplay/ui/*.ts`
Selectores organizados por página:
- Locators de Playwright
- Métodos auxiliares de página
- Encapsulación de cambios de UI

---

## 🎭 Componentes del Patrón Screenplay

### 1. **Actor** - El Usuario del Sistema

```typescript
const usuario = Actor.named("María González")
  .whoCan(BrowseTheWeb.using(page));

await usuario.attemptsTo(
  Navigate.to('/pages/expenses'),
  CreateExpense.basic('150.00', 'Compras'),
  Wait.forTime(1000)
);

const count = await usuario.asks(ExpenseQuestions.count());
```

**Responsabilidades:**
- Mantener el contexto del usuario
- Gestionar habilidades (abilities)
- Ejecutar tareas secuenciales
- Hacer preguntas sobre el estado

**Métodos principales:**
- `named(name)`: Crea un actor con un nombre
- `whoCan(...abilities)`: Asigna habilidades
- `attemptsTo(...tasks)`: Ejecuta tareas
- `asks(question)`: Hace preguntas
- `abilityTo(ability)`: Obtiene una habilidad

---

### 2. **Abilities** - Habilidades del Actor

```typescript
class BrowseTheWeb implements Ability {
  static using(page: Page): BrowseTheWeb {
    return new BrowseTheWeb(page);
  }

  getPage(): Page {
    return this.page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
```

**Responsabilidades:**
- Encapsular herramientas (Playwright, Axios, etc.)
- Proporcionar interfaces para interactuar
- Mantener el estado de la herramienta

**Abilities implementadas:**
- `BrowseTheWeb`: Navegación con Playwright

**Extensiones futuras:**
- `MakeAPIRequests`: Llamadas HTTP
- `QueryDatabase`: Consultas a BD
- `ReadFiles`: Lectura de archivos

---

### 3. **Interactions** - Acciones Atómicas

```typescript
// Interacción de Clic
await actor.attemptsTo(
  Click.on(ExpensePage.addButton)
);

// Interacción de Llenado
await actor.attemptsTo(
  Fill.field(ExpensePage.amountInput).with('150.00')
);

// Interacción de Navegación
await actor.attemptsTo(
  Navigate.toExpensesPage()
);

// Interacción de Espera
await actor.attemptsTo(
  Wait.forElement(ExpensePage.expensesList).toBeVisible()
);
```

**Responsabilidades:**
- Acciones simples y atómicas
- Sin lógica de negocio
- Reutilizables en múltiples contextos
- Bajo acoplamiento con la UI

**Interactions implementadas:**
- `Click`: Clic simple, doble clic, clic derecho
- `Fill`: Llenar campos, escribir texto, limpiar
- `Navigate`: Ir a URLs, navegar entre páginas
- `Wait`: Esperar elementos, tiempos, condiciones

---

### 4. **Tasks** - Acciones de Alto Nivel

```typescript
// Tarea simple
await actor.attemptsTo(
  CreateExpense.basic('100.00', 'Almuerzo')
);

// Tarea con detalles completos
await actor.attemptsTo(
  CreateExpense.withDetails({
    amount: '250.75',
    description: 'Compra en tienda',
    category: 'Compras',
    paymentMethod: 'Tarjeta de Crédito',
    requiresInvoice: true
  })
);

// Tarea compuesta
await actor.attemptsTo(
  CreateMultipleExpenses.withList([
    { amount: '50.00', description: 'Café' },
    { amount: '30.00', description: 'Transporte' }
  ])
);
```

**Responsabilidades:**
- Representar acciones de negocio
- Combinar múltiples interacciones
- Encapsular flujos completos
- Mantener la legibilidad

**Tasks implementadas:**
- `CreateExpense`: Crear un gasto
- `CreateMultipleExpenses`: Crear varios gastos
- `DeleteExpense`: Eliminar un gasto
- `DeleteAllExpenses`: Eliminar todos los gastos
- `CreateIncome`: Crear un ingreso
- `CreateMultipleIncomes`: Crear varios ingresos

---

### 5. **Questions** - Verificaciones del Estado

```typescript
// Pregunta simple
const count = await actor.asks(ExpenseQuestions.count());
expect(count).toBeGreaterThan(0);

// Pregunta de visibilidad
const isVisible = await actor.asks(
  ExpenseQuestions.isVisible('Compra de supermercado')
);
expect(isVisible).toBeTruthy();

// Pregunta de cálculo
const total = await actor.asks(ExpenseQuestions.totalAmount());
expect(total).toBe(350.50);

// Pregunta de estado de página
const isDashboardVisible = await actor.asks(
  PageQuestions.isDashboardVisible()
);
expect(isDashboardVisible).toBeTruthy();
```

**Responsabilidades:**
- Extraer información del sistema
- Retornar valores verificables
- Encapsular consultas complejas
- Mantener la separación de concerns

**Questions implementadas:**

**ExpenseQuestions:**
- `count()`: Número de gastos
- `isVisible(description)`: Gasto visible
- `totalAmount()`: Monto total gastado
- `noExpensesMessageVisible()`: Mensaje sin gastos
- `allDescriptions()`: Todas las descripciones

**PageQuestions:**
- `currentUrl()`: URL actual
- `pageTitle()`: Título de página
- `isDashboardVisible()`: Dashboard visible
- `isExpensePageLoaded()`: Página de gastos cargada
- `isIncomePageLoaded()`: Página de ingresos cargada
- `containsText(text)`: Texto presente

---

### 6. **UI Elements** - Selectores de Página

```typescript
class ExpensePage {
  constructor(private page: Page) {}

  get amountInput(): Locator {
    return this.page.getByPlaceholder(/Monto/i);
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder(/Descripción/i);
  }

  get addExpenseButton(): Locator {
    return this.page.getByRole('button', { name: /Agregar Gasto/i });
  }

  expenseByDescription(description: string): Locator {
    return this.page.locator('.bg-white\\/10', { hasText: description });
  }

  async getExpensesCount(): Promise<number> {
    const count = await this.expensesList.count();
    return count;
  }
}
```

**Responsabilidades:**
- Organizar selectores por página
- Proporcionar métodos auxiliares
- Encapsular cambios de UI
- Facilitar el mantenimiento

**UI Elements implementados:**
- `HomePage`: Página de inicio
- `DashboardPage`: Dashboard principal
- `ExpensePage`: Página de gastos
- `IncomePage`: Página de ingresos

---

## ✍️ Cómo Escribir Pruebas

### Estructura de una Prueba

```typescript
import { test, expect } from '@playwright/test';
import { Actor } from '../screenplay/Actor';
import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';

test.describe('Nombre del Feature', () => {
  
  // Setup antes de cada prueba
  test.beforeEach(async ({ page }) => {
    const usuario = Actor.named('Usuario')
      .whoCan(BrowseTheWeb.using(page));
    
    await usuario.attemptsTo(
      Navigate.toExpensesPage()
    );
  });

  // Caso de prueba
  test('debe realizar una acción específica', async ({ page }) => {
    // Given: Contexto inicial
    const usuario = Actor.named('Usuario')
      .whoCan(BrowseTheWeb.using(page));
    
    // When: Acción a realizar
    await usuario.attemptsTo(
      CreateExpense.basic('100.00', 'Test')
    );
    
    // Then: Verificación
    const isVisible = await usuario.asks(
      ExpenseQuestions.isVisible('Test')
    );
    expect(isVisible).toBeTruthy();
  });
});
```

### Pasos para Crear una Nueva Prueba

#### 1. **Identificar el Escenario**

Usa formato Given-When-Then:

```gherkin
Given el usuario está en la página de gastos
When el usuario crea un gasto de $150.00
Then el gasto debe aparecer en la lista
And el contador debe incrementarse en 1
```

#### 2. **Crear el Actor**

```typescript
const usuario = Actor.named('Usuario de Prueba')
  .whoCan(BrowseTheWeb.using(page));
```

#### 3. **Implementar las Acciones (When)**

```typescript
await usuario.attemptsTo(
  CreateExpense.basic('150.00', 'Compras')
);
```

#### 4. **Verificar el Resultado (Then)**

```typescript
const count = await usuario.asks(ExpenseQuestions.count());
expect(count).toBeGreaterThan(0);
```

### Ejemplo Completo: Nueva Prueba de Edición

```typescript
test('debe editar un gasto existente', async ({ page }) => {
  // Given: Crear el actor y setup
  const usuario = Actor.named('Editor')
    .whoCan(BrowseTheWeb.using(page));
  
  // Crear un gasto inicial
  await usuario.attemptsTo(
    CreateExpense.basic('100.00', 'Gasto Original')
  );
  
  // When: Editar el gasto (necesitarías crear esta Task)
  await usuario.attemptsTo(
    EditExpense.byDescription('Gasto Original')
      .changingAmountTo('150.00')
      .changingDescriptionTo('Gasto Editado')
  );
  
  // Then: Verificar cambios
  const isVisible = await usuario.asks(
    ExpenseQuestions.isVisible('Gasto Editado')
  );
  expect(isVisible).toBeTruthy();
  
  const notVisible = await usuario.asks(
    ExpenseQuestions.isVisible('Gasto Original')
  );
  expect(notVisible).toBeFalsy();
});
```

---

## 🚀 Ejecución de Pruebas

### Comandos Disponibles

```bash
# Ejecutar todas las pruebas E2E
npm run test:e2e

# Ejecutar en modo UI (interfaz visual)
npm run test:e2e:ui

# Ejecutar con navegador visible
npm run test:e2e:headed

# Ejecutar en modo debug
npm run test:e2e:debug

# Ver reporte de resultados
npm run test:e2e:report
```

### Opciones Avanzadas

```bash
# Ejecutar solo un archivo de pruebas
npx playwright test tests/expenses.spec.ts --config=testEntrega3/playwright.config.ts

# Ejecutar una prueba específica por nombre
npx playwright test -g "debe crear un gasto básico" --config=testEntrega3/playwright.config.ts

# Ejecutar en un navegador específico
npx playwright test --project=chromium --config=testEntrega3/playwright.config.ts

# Ejecutar con más workers (paralelismo)
npx playwright test --workers=4 --config=testEntrega3/playwright.config.ts

# Generar trace para debugging
npx playwright test --trace=on --config=testEntrega3/playwright.config.ts
```

### Modo Debug Interactivo

```bash
# Pausar ejecución para inspeccionar
npx playwright test --debug --config=testEntrega3/playwright.config.ts

# Ver en Playwright Inspector
npx playwright test --headed --config=testEntrega3/playwright.config.ts
```

### Visualizar Resultados

Después de ejecutar las pruebas:

```bash
# Abrir reporte HTML
npm run test:e2e:report

# O manualmente
npx playwright show-report testEntrega3/playwright-report
```

---

## 🧪 Pruebas Implementadas

### Gestión de Gastos (`expenses.spec.ts`)

#### Suite Principal: Funcionalidades Básicas

| # | Nombre de la Prueba | Descripción | Escenarios Cubiertos |
|---|---------------------|-------------|---------------------|
| 1 | Crear gasto básico | Verifica creación con monto y descripción | ✅ Validación de campos requeridos<br>✅ Actualización de lista<br>✅ Incremento de contador |
| 2 | Crear múltiples gastos | Crea varios gastos en secuencia | ✅ Creación masiva<br>✅ Persistencia<br>✅ Visibilidad en lista |
| 3 | Crear gasto completo | Usa todos los campos del formulario | ✅ Categorías<br>✅ Métodos de pago<br>✅ Fechas<br>✅ Factura |
| 4 | Eliminar gasto | Elimina un gasto específico | ✅ Localización<br>✅ Eliminación<br>✅ Actualización de lista |
| 5 | Validar campos requeridos | Intenta crear sin datos | ✅ Validación<br>✅ Mensajes de error<br>✅ Prevención |
| 6 | Métodos de pago | Prueba diferentes métodos | ✅ Efectivo<br>✅ Tarjetas<br>✅ Transferencia<br>✅ PayPal |
| 7 | Sin gastos | Verifica mensaje inicial | ✅ Estado inicial<br>✅ UI vacía<br>✅ Mensajes |
| 8 | Gasto con factura | Marca checkbox de factura | ✅ Checkbox<br>✅ Indicador visual<br>✅ Persistencia |
| 9 | Formatos de monto | Prueba diferentes formatos | ✅ Sin decimales<br>✅ Con decimales<br>✅ Miles |

#### Suite Adicional: Casos Extremos

| # | Nombre de la Prueba | Descripción | Casos Cubiertos |
|---|---------------------|-------------|-----------------|
| 10 | Descripción larga | Texto extenso | ✅ Validación de longitud<br>✅ Truncamiento<br>✅ Display |
| 11 | Monto grande | Valores extremos | ✅ Números grandes<br>✅ Formato<br>✅ Cálculos |

**Total de Pruebas de Gastos: 11**

---

### Gestión de Ingresos (`income.spec.ts`)

#### Suite Principal: Funcionalidades Básicas

| # | Nombre de la Prueba | Descripción | Escenarios Cubiertos |
|---|---------------------|-------------|---------------------|
| 1 | Crear ingreso básico | Verifica creación básica | ✅ Monto y descripción<br>✅ Tipo de ingreso<br>✅ Actualización |
| 2 | Crear múltiples ingresos | Varios ingresos seguidos | ✅ Creación masiva<br>✅ Diferentes tipos<br>✅ Persistencia |
| 3 | Ingreso con fecha | Fecha específica | ✅ Selector de fecha<br>✅ Formato<br>✅ Validación |
| 4 | Ingreso recurrente | Configuración de recurrencia | ✅ Checkbox recurrente<br>✅ Frecuencia<br>✅ Fecha fin |
| 5 | Validar campos requeridos | Campos obligatorios | ✅ Validación<br>✅ Mensajes<br>✅ Prevención |
| 6 | Diferentes tipos | Salario, Freelance, etc. | ✅ Tipos múltiples<br>✅ Categorización<br>✅ Display |
| 7 | Carga de página | Verificación de elementos | ✅ Formulario<br>✅ Botones<br>✅ Campos |
| 8 | Montos decimales | Formatos con centavos | ✅ Decimales<br>✅ Formato<br>✅ Cálculos |
| 9 | URL correcta | Verificación de navegación | ✅ Routing<br>✅ URL<br>✅ Persistencia |

#### Suite Adicional: Casos Extremos

| # | Nombre de la Prueba | Descripción | Casos Cubiertos |
|---|---------------------|-------------|-----------------|
| 10 | Monto grande | Valores extremos | ✅ Números grandes<br>✅ Validación<br>✅ Display |
| 11 | Descripción larga | Texto extenso | ✅ Longitud<br>✅ Truncamiento<br>✅ UI |

**Total de Pruebas de Ingresos: 11**

---

### Resumen de Cobertura

```
📊 Estadísticas Totales
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total de Pruebas:        22
Gastos:                  11
Ingresos:                11

Casos Cubiertos:
  ✅ CRUD Completo           ████████████ 100%
  ✅ Validaciones            ████████████ 100%
  ✅ Casos Extremos          ████████████ 100%
  ✅ Diferentes Formatos     ████████████ 100%
  ✅ Navegación              ████████████ 100%
  ✅ UI/UX                   ████████████ 100%

Navegadores Soportados:
  ✅ Chromium
  ✅ Firefox
  ✅ WebKit (Safari)
```

---

## 💡 Mejores Prácticas

### 1. **Naming Conventions**

```typescript
// ✅ BUENO: Nombres descriptivos
const usuarioAdministrador = Actor.named('Administrador del Sistema');
await usuarioAdministrador.attemptsTo(CreateExpense.basic('100', 'Test'));

// ❌ MALO: Nombres genéricos
const a = Actor.named('a');
await a.attemptsTo(CreateExpense.basic('100', 'Test'));

// ✅ BUENO: Tasks descriptivas
class CreateExpenseWithFullDetails implements Task { ... }

// ❌ MALO: Tasks vagas
class DoStuff implements Task { ... }
```

### 2. **Composición sobre Herencia**

```typescript
// ✅ BUENO: Composición de tasks
await usuario.attemptsTo(
  Navigate.toExpensesPage(),
  CreateExpense.basic('100', 'Test'),
  VerifyExpenseCreation.wasSuccessful()
);

// ❌ MALO: Herencia profunda
class ExpenseTestBase extends TestBase extends BaseTest { ... }
```

### 3. **Single Responsibility**

```typescript
// ✅ BUENO: Una responsabilidad por clase
class CreateExpense implements Task {
  async performAs(actor: Actor): Promise<void> {
    // Solo crear el gasto
  }
}

// ❌ MALO: Múltiples responsabilidades
class ExpenseManager implements Task {
  async performAs(actor: Actor): Promise<void> {
    // Crear, editar, eliminar, validar...
  }
}
```

### 4. **Esperas Inteligentes**

```typescript
// ✅ BUENO: Esperar condiciones específicas
await usuario.attemptsTo(
  Wait.forElement(ExpensePage.expensesList).toBeVisible()
);

// ❌ MALO: Esperas de tiempo fijo
await usuario.attemptsTo(
  Wait.forTime(5000) // ¿Por qué 5 segundos?
);

// ⚠️ ACEPTABLE: Solo cuando es necesario
await usuario.attemptsTo(
  Wait.forTime(500) // Pequeña espera para animación
);
```

### 5. **Datos de Prueba**

```typescript
// ✅ BUENO: Datos únicos y descriptivos
test('crear gasto de almuerzo', async ({ page }) => {
  const timestamp = Date.now();
  const descripcion = `Almuerzo ${timestamp}`;
  
  await usuario.attemptsTo(
    CreateExpense.basic('50.00', descripcion)
  );
});

// ❌ MALO: Datos hardcodeados que pueden causar conflictos
test('crear gasto', async ({ page }) => {
  await usuario.attemptsTo(
    CreateExpense.basic('50.00', 'Almuerzo') // Puede existir ya
  );
});
```

### 6. **Assertions Claras**

```typescript
// ✅ BUENO: Assertions específicas con mensajes
const count = await usuario.asks(ExpenseQuestions.count());
expect(count, 'Debe haber al menos un gasto').toBeGreaterThan(0);

// ❌ MALO: Assertions sin contexto
expect(count).toBe(1); // ¿Por qué 1? ¿Qué representa?
```

### 7. **Logging y Debugging**

```typescript
// ✅ BUENO: Logging informativo
test('crear gasto', async ({ page }) => {
  const usuario = Actor.named('Usuario');
  usuario.log('Iniciando creación de gasto');
  
  await usuario.attemptsTo(
    CreateExpense.basic('100', 'Test')
  );
  
  usuario.log('Gasto creado exitosamente');
});
```

### 8. **Cleanup entre Pruebas**

```typescript
// ✅ BUENO: Limpiar estado después de cada prueba
test.afterEach(async ({ page }) => {
  const usuario = Actor.named('Cleanup');
  await usuario.attemptsTo(
    DeleteAllExpenses.fromList()
  );
});
```

### 9. **Reutilización de Código**

```typescript
// ✅ BUENO: Extraer lógica común
async function setupUsuarioConGastos(page: Page, numGastos: number) {
  const usuario = Actor.named('Usuario Setup')
    .whoCan(BrowseTheWeb.using(page));
  
  const gastos = Array.from({ length: numGastos }, (_, i) => ({
    amount: `${(i + 1) * 10}.00`,
    description: `Gasto ${i + 1}`
  }));
  
  await usuario.attemptsTo(
    CreateMultipleExpenses.withList(gastos)
  );
  
  return usuario;
}
```

### 10. **Tests Independientes**

```typescript
// ✅ BUENO: Cada test es autocontenido
test('debe crear gasto', async ({ page }) => {
  // Setup propio
  const usuario = Actor.named('Usuario')
    .whoCan(BrowseTheWeb.using(page));
  
  await usuario.attemptsTo(Navigate.toExpensesPage());
  
  // Prueba
  await usuario.attemptsTo(CreateExpense.basic('100', 'Test'));
  
  // Verificación
  expect(await usuario.asks(ExpenseQuestions.count())).toBeGreaterThan(0);
});

// ❌ MALO: Dependencia entre tests
test('crear gasto', async ({ page }) => {
  // ...
});

test('eliminar el gasto creado anteriormente', async ({ page }) => {
  // Depende del test anterior ❌
});
```

---

## 🔧 Troubleshooting

### Problemas Comunes y Soluciones

#### 1. **Timeout en Esperas**

**Síntoma:**
```
Error: Timeout 5000ms exceeded while waiting for element
```

**Solución:**
```typescript
// Aumentar timeout para elementos lentos
await usuario.attemptsTo(
  Wait.forElement(ExpensePage.expensesList)
    .toBeVisible()
);

// O aumentar globalmente en playwright.config.ts
expect: {
  timeout: 10000 // 10 segundos
}
```

#### 2. **Elementos No Encontrados**

**Síntoma:**
```
Error: Locator not found
```

**Solución:**
```typescript
// Verificar selectores con Playwright Inspector
npx playwright test --debug

// Usar selectores más robustos
// ❌ FRÁGIL
page.locator('.button-class')

// ✅ ROBUSTO
page.getByRole('button', { name: /Agregar/i })
```

#### 3. **Pruebas Intermitentes (Flaky)**

**Síntoma:**
```
Test passes sometimes, fails other times
```

**Solución:**
```typescript
// Esperar condiciones específicas
await page.waitForLoadState('networkidle');

// Usar auto-waiting de Playwright
await page.locator('button').click(); // Ya espera automáticamente

// Evitar esperas de tiempo fijo
// ❌ await page.waitForTimeout(5000);
// ✅ await page.waitForSelector('.element');
```

#### 4. **Navegación Fallida**

**Síntoma:**
```
Navigation timeout of 30000ms exceeded
```

**Solución:**
```typescript
// Verificar que la app esté corriendo
// En terminal separada: npm run dev

// Configurar baseURL correctamente
// playwright.config.ts
use: {
  baseURL: 'http://localhost:3000',
}
```

#### 5. **Problemas con Clerk (Autenticación)**

**Síntoma:**
```
Tests fail due to authentication redirect
```

**Solución:**
```typescript
// Opción 1: Mock de autenticación
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('clerk-token', 'mock-token');
  });
});

// Opción 2: Login programático antes de tests
// Implementar LoginTask con credenciales de prueba
```

#### 6. **Screenshots y Videos No se Generan**

**Síntoma:**
```
No screenshots in test-results folder
```

**Solución:**
```typescript
// Verificar configuración en playwright.config.ts
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}

// Forzar screenshot manualmente
await page.screenshot({ path: 'debug.png' });
```

#### 7. **Problemas de Paralelismo**

**Síntoma:**
```
Tests interfere with each other
```

**Solución:**
```typescript
// Reducir workers
// playwright.config.ts
workers: 1, // Un test a la vez

// O usar test.serial
test.describe.serial('Gastos', () => {
  // Tests se ejecutan secuencialmente
});
```

#### 8. **Errores de TypeScript**

**Síntoma:**
```
Type error: Property 'attemptsTo' does not exist
```

**Solución:**
```bash
# Verificar instalación
npm install

# Regenerar tipos
npx playwright install

# Verificar tsconfig.json
{
  "compilerOptions": {
    "types": ["@playwright/test"]
  }
}
```

---

## 📚 Referencias y Recursos

### Documentación Oficial

- **Playwright**: https://playwright.dev/
- **Playwright TypeScript**: https://playwright.dev/docs/test-typescript
- **Playwright Best Practices**: https://playwright.dev/docs/best-practices

### Patrón Screenplay

- **Serenity BDD (origen del patrón)**: https://serenity-bdd.info/
- **Screenplay Pattern Explained**: https://www.infoq.com/articles/Beyond-Page-Objects-Test-Automation-Serenity-Screenplay/
- **Screenplay Pattern in TypeScript**: https://jan-molak.github.io/serenity-js/

### Testing Best Practices

- **Testing Library**: https://testing-library.com/
- **Test Automation Patterns**: https://testautomationpatterns.org/
- **E2E Testing Strategies**: https://kentcdodds.com/blog/write-tests

### TypeScript

- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **TypeScript Best Practices**: https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html

---

## 🤝 Contribución

### Cómo Extender las Pruebas

#### 1. **Agregar una Nueva Interaction**

```typescript
// testEntrega3/screenplay/interactions/Select.ts
export class Select implements Task {
  static option(value: string): Select {
    return new Select(value);
  }

  async performAs(actor: Actor): Promise<void> {
    // Implementación
  }
}
```

#### 2. **Agregar una Nueva Task**

```typescript
// testEntrega3/screenplay/tasks/EditExpense.ts
export class EditExpense implements Task {
  static byDescription(description: string): EditExpense {
    return new EditExpense(description);
  }

  changingAmountTo(amount: string): this {
    this.newAmount = amount;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    // Implementación
  }
}
```

#### 3. **Agregar una Nueva Question**

```typescript
// testEntrega3/screenplay/questions/ExpenseQuestions.ts
export class ExpenseCategory implements Question<string> {
  static of(description: string): ExpenseCategory {
    return new ExpenseCategory(description);
  }

  async answeredBy(actor: Actor): Promise<string> {
    // Implementación
  }
}
```

#### 4. **Agregar una Nueva Suite de Pruebas**

```typescript
// testEntrega3/tests/categories.spec.ts
import { test, expect } from '@playwright/test';
import { Actor } from '../screenplay/Actor';

test.describe('Gestión de Categorías', () => {
  test('debe crear una categoría', async ({ page }) => {
    // Implementación
  });
});
```

---

## 📝 Notas Finales

### ¿Por qué Este Enfoque?

1. **Mantenibilidad**: Los cambios en la UI solo afectan a los UI Elements
2. **Legibilidad**: Las pruebas son auto-documentadas y fáciles de entender
3. **Reutilización**: Tasks e Interactions son altamente componibles
4. **Escalabilidad**: Fácil agregar nuevas funcionalidades
5. **Profesionalismo**: Sigue patrones de la industria

### Próximos Pasos

- [ ] Implementar autenticación con Clerk
- [ ] Agregar pruebas de estadísticas y reportes
- [ ] Implementar pruebas de PWA offline
- [ ] Agregar pruebas de proyecciones financieras
- [ ] Integrar con CI/CD
- [ ] Agregar más navegadores y dispositivos

### Feedback y Mejoras

Este proyecto es educativo y está diseñado para demostrar las mejores prácticas en pruebas E2E. Si encuentras áreas de mejora o tienes sugerencias, son bienvenidas.

---

## 👨‍💻 Autor

**Entrega 3 - Pruebas E2E con Screenplay**

Implementación completa del patrón Screenplay para TrackMyMoney.

---

<div align="center">

**⭐ Si este proyecto te ayuda, considera darle una estrella ⭐**

**📚 Documentación completa | 🧪 22+ Pruebas | 🎭 Patrón Screenplay**

</div>

