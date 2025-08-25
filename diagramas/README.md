# Diagramas de Flujo - Escenarios de Prueba Track My Money

Esta carpeta contiene los diagramas de flujo para cada escenario de prueba del sistema Track My Money.

## 📋 Lista de Diagramas

### Escenarios Implementados

1. **01-registro-gasto-online.xml** - Registro de gasto en línea
2. **02-registro-gasto-offline.xml** - Registro de gasto sin conexión  
3. **03-sincronizacion-offline.xml** - Sincronización de transacciones offline
4. **04-validacion-campos-ingresos.xml** - Validación de campos obligatorios en ingresos
5. **05-edicion-transacciones.xml** - Edición de transacciones existentes
6. **06-eliminacion-transacciones.xml** - Eliminación de transacciones
7. **07-estadisticas-reportes.xml** - Visualización de estadísticas y reportes
8. **08-autenticacion-clerk.xml** - Autenticación con Clerk

### Nuevos Escenarios Propuestos

9. **09-manejo-errores.xml** - Manejo de errores y recuperación del sistema
10. **10-gestion-categorias.xml** - Gestión de categorías de gastos e ingresos

## 🛠️ Cómo usar los diagramas

### Opción 1: draw.io / diagrams.net (Recomendado)
1. Ve a [draw.io](https://app.diagrams.net/)
2. Selecciona "Open Existing Diagram"
3. Sube cualquier archivo `.xml` de esta carpeta
4. El diagrama se cargará automáticamente

### Opción 2: VS Code con extensión
1. Instala la extensión "Draw.io Integration" en VS Code
2. Abre cualquier archivo `.xml` directamente en VS Code
3. El diagrama se renderizará en el editor

### Opción 3: Importar a otras herramientas
Los archivos XML son compatibles con:
- Lucidchart
- Creately
- yEd
- Otras herramientas que soporten formato GraphML/XML

## 📊 Estructura de cada diagrama

Cada diagrama incluye:

- **Inicio**: Punto de entrada del escenario
- **Procesos**: Pasos ejecutados en el sistema
- **Decisiones**: Puntos de validación o bifurcación
- **Errores**: Manejo de casos de falla
- **Fin**: Resultado exitoso del escenario
- **Notas de código**: Ubicaciones específicas en el código fuente

## 🎨 Código de colores

- 🟢 **Verde**: Estados exitosos, inicio/fin
- 🔵 **Azul**: Procesos normales del usuario
- 🟡 **Amarillo**: Decisiones y validaciones
- 🟣 **Morado**: Llamadas a API/Backend
- 🟠 **Naranja**: Operaciones offline/storage
- 🔴 **Rojo**: Errores y manejo de fallos
- ⚪ **Gris**: Notas y documentación

## 📁 Archivos de código referenciados

Cada diagrama incluye referencias específicas a:

### APIs Backend
- `src/app/api/gastos/route.ts`
- `src/app/api/ingresos/route.ts`
- `src/app/api/categorias/route.ts`

### Frontend
- `src/app/pages/expenses/page.tsx`
- `src/app/pages/income/page.tsx`
- `src/app/pages/stats/page.tsx`

### Lógica PWA/Offline
- `src/lib/useOnlineStatus.ts`
- `src/lib/offlineStorage.ts`
- `src/components/OfflineTransactions.tsx`

### Autenticación
- `src/middleware.ts`
- `src/app/layout.tsx`
- `src/components/UserButton.tsx`

### Base de datos
- `prisma/schema.prisma`
- `lib/prisma.ts`

### Tests
- `src/app/api/**/__tests__/*.test.ts`
- `src/lib/__tests__/*.test.ts`

## 🔄 Actualización de diagramas

Para actualizar un diagrama:
1. Abre el archivo XML en draw.io
2. Realiza las modificaciones necesarias
3. Exporta como XML (File > Export as > XML)
4. Reemplaza el archivo en esta carpeta

## 📝 Notas para el equipo

- Cada diagrama mapea exactamente con el código implementado
- Las líneas de código están especificadas para facilitar el desarrollo
- Los diagramas pueden servir como documentación técnica
- Usar estos diagramas para validar la lógica durante las pruebas

---

**Generado para Track My Money - Sistema de Gestión Financiera**


