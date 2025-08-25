# 📅 Cronograma de Pruebas - TrackMyMoney

## Programa de Ejecución de Pruebas

| **Fase** | **Módulo/API** | **Archivo de Prueba** | **Tiempo Estimado** | **Orden** | **Dependencias** | **Comando** |
|----------|----------------|----------------------|-------------------|-----------|-----------------|-------------|
| 1 | Utilidades Base | `dateUtils.test.ts` | 5 min | 1 | Ninguna | `npm test dateUtils` |
| 2 | Validaciones | `dataValidations.test.ts` | 8 min | 2 | dateUtils | `npm test dataValidations` |
| 3 | Cálculos Financieros | `financeCalculations.test.ts` | 10 min | 3 | dateUtils | `npm test financeCalculations` |
| 4 | API Categorías | `categorias/route.test.ts` | 6 min | 4 | Prisma mocks | `npm test categorias` |
| 5 | API Gastos | `gastos/route.test.ts` | 12 min | 5 | Categorías, Clerk | `npm test gastos/route` |
| 6 | CRUD Gastos | `gastos/[id]/route.test.ts` | 10 min | 6 | API Gastos | `npm test gastos/\\[id\\]` |
| 7 | API Ingresos | `ingresos/route.test.ts` | 12 min | 7 | Categorías, Clerk | `npm test ingresos` |

## Cronograma Diario

| **Momento** | **Tipo de Prueba** | **Frecuencia** | **Duración** |
|-------------|-------------------|----------------|--------------|
| **Pre-commit** | Pruebas rápidas (dateUtils + validations) | Cada commit | 13 min |
| **Build local** | Todas las pruebas | Antes de push | 60 min |
| **CI/CD** | Cobertura completa | Cada PR | 60 min |
| **Regresión** | Suite completa + cobertura | Semanal | 75 min |

## Cronograma Semanal

| **Día** | **Actividad** | **Tests** | **Responsable** |
|---------|---------------|-----------|-----------------|
| **Lunes** | Pruebas de integración | APIs completas (fases 4-7) | Dev Team |
| **Martes** | Pruebas unitarias | Lógica core (fases 1-3) | Dev Team |
| **Miércoles** | Pruebas de seguridad | dataValidations + APIs | Security |
| **Jueves** | Pruebas de rendimiento | financeCalculations | Performance |
| **Viernes** | Regresión completa | Todas las fases | QA Team |

## Cronograma por Sprint

| **Semana** | **Enfoque** | **Cobertura Objetivo** | **Entregable** |
|------------|-------------|----------------------|----------------|
| **Semana 1** | Setup y core | 60% | Fases 1-3 funcionando |
| **Semana 2** | APIs básicas | 70% | Fases 4-5 completas |
| **Semana 3** | CRUD completo | 75% | Fases 6-7 finalizadas |
| **Semana 4** | Optimización | 80% | Suite completa optimizada |

## Ejecución Rápida

| **Escenario** | **Comando** | **Tiempo** | **Casos de Uso** |
|---------------|-------------|------------|------------------|
| **Desarrollo** | `npm test:watch` | Continuo | Codificación activa |
| **Pre-commit** | `npm test -- --changed` | 5-15 min | Verificación rápida |
| **Deploy** | `npm run test:coverage` | 60 min | Verificación completa |
| **Debug** | `npm test -- --verbose [archivo]` | Variable | Investigación de fallos | 