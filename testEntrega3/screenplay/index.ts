/**
 * Índice Principal del Patrón Screenplay
 * =======================================
 * 
 * Este archivo centraliza todas las exportaciones del framework Screenplay
 * para facilitar las importaciones en las pruebas.
 * 
 * @example
 * ```typescript
 * // En lugar de múltiples importaciones
 * import { Actor } from '../screenplay/Actor';
 * import { BrowseTheWeb } from '../screenplay/abilities/BrowseTheWeb';
 * import { Navigate } from '../screenplay/interactions/Navigate';
 * 
 * // Puedes hacer una sola importación
 * import { Actor, BrowseTheWeb, Navigate } from '../screenplay';
 * ```
 */

// ==================
// CORE
// ==================
export { Actor } from './Actor';
export type { Ability, Task, Question } from './Actor';

// ==================
// ABILITIES
// ==================
export { BrowseTheWeb } from './abilities/BrowseTheWeb';

// ==================
// INTERACTIONS
// ==================
export { Click, DoubleClick } from './interactions/Click';
export { Fill, Type, Clear } from './interactions/Fill';
export { Navigate, Reload, GoBack } from './interactions/Navigate';
export { Wait, WaitForTimeout } from './interactions/Wait';

// ==================
// TASKS
// ==================
export { 
  CreateExpense, 
  CreateMultipleExpenses 
} from './tasks/CreateExpense';

export { 
  DeleteExpense, 
  DeleteAllExpenses 
} from './tasks/DeleteExpense';

export { 
  CreateIncome, 
  CreateMultipleIncomes 
} from './tasks/CreateIncome';

// ==================
// QUESTIONS
// ==================
export { ExpenseQuestions } from './questions/ExpenseQuestions';
export { PageQuestions } from './questions/PageQuestions';

// ==================
// UI ELEMENTS
// ==================
export { HomePage, HomePageSelectors } from './ui/HomePage';
export { DashboardPage, DashboardPageSelectors } from './ui/DashboardPage';
export { ExpensePage, ExpensePageSelectors } from './ui/ExpensePage';
export { IncomePage, IncomePageSelectors } from './ui/IncomePage';

// ==================
// TYPES
// ==================
export type { ExpenseDetails } from './tasks/CreateExpense';
export type { IncomeDetails } from './tasks/CreateIncome';

