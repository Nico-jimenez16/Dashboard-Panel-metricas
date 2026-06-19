# Consolidar barrels sueltos en un único index — Dashboard-Panel-metricas

## Contexto

El refactor anterior (`fc2f587`) convirtió componentes planos en carpetas, dejando en el directorio padre un archivo "barrel" suelto por componente (ej. `KPICards.tsx` re-exporta desde `KPICards/KPICards.tsx`). Esto dejó varios archivos sueltos de una sola línea en dos lugares:

- `src/features/dashboard/components/`: 5 flat barrels (`KPICards.tsx`, `CasesByAreaTable.tsx`, `CasesByTypeChart.tsx`, `MonthlyTrendChart.tsx`, `StatusDonutChart.tsx`), cada uno con `export { default } from './X/X'`.
- `src/components/ui/`: 7 flat barrels (`badge.tsx`, `button.tsx`, `card.tsx`, `input.tsx`, `separator.tsx`, `tabs.tsx`, `text.tsx`), cada uno con named re-exports.

El usuario pidió reemplazar esos múltiples archivos sueltos por **un solo `index.ts` por carpeta** que reexporte todo, y confirmó que está bien actualizar las importaciones existentes en consecuencia (rompe la convención previa de "no tocar imports", pero es el costo necesario de tener un solo archivo).

Alcance: solo estas dos carpetas. No se toca `src/components/layout/` ni `src/features/cases/components/CasesTable` (mismo patrón de carpeta, pero no fueron mencionados).

## Cambios

### 1. `src/features/dashboard/components/index.ts`
Nuevo archivo con named re-exports (los 5 componentes son `export default`, así que se renombran a named en el índice):
```ts
export { default as KPICards } from './KPICards/KPICards';
export { default as CasesByAreaTable } from './CasesByAreaTable/CasesByAreaTable';
export { default as CasesByTypeChart } from './CasesByTypeChart/CasesByTypeChart';
export { default as MonthlyTrendChart } from './MonthlyTrendChart/MonthlyTrendChart';
export { default as StatusDonutChart } from './StatusDonutChart/StatusDonutChart';
```
Borrar los 5 flat barrels listados arriba.

Actualizar `src/app/page.tsx:4-8`: un solo `import { KPICards, MonthlyTrendChart, StatusDonutChart, CasesByTypeChart, CasesByAreaTable } from '@/features/dashboard/components';` en vez de 5 imports default separados.

Actualizar los 5 `.md` de cada subcarpeta (`KPICards.md`, etc.) para que el ejemplo de import use la nueva forma named.

### 2. `src/components/ui/index.ts`
Nuevo archivo con todos los named re-exports (ya son named, sin conflicto de defaults). Incluye también `Table` (que ya vive en `Table/index.ts` con patrón folder-interno) para que todo se importe desde un solo lugar:
```ts
export { Badge, badgeVariants } from './badge/badge';
export type { BadgeProps } from './badge/badge';

export { Button, buttonVariants } from './button/button';
export type { ButtonProps } from './button/button';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card/card';

export { Input } from './input/input';
export type { InputProps } from './input/input';

export { Separator } from './separator/separator';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs/tabs';

export { Text } from './text/text';

export { Table } from './Table';
export type { TableProps } from './Table';
```
Borrar los 7 flat barrels listados arriba. `Table/index.ts` se deja intacto (no es flat barrel, es interno a su propia carpeta).

Actualizar todos los consumidores para importar desde `@/components/ui` (consolidando en un solo import cuando un archivo usa más de un componente):
- `src/app/casos/page.tsx` (Button)
- `src/features/cases/components/CaseInfoTabs.tsx` (Tabs/TabsList/TabsTrigger/TabsContent, Card/CardContent, Button — 3 imports → 1)
- `src/features/cases/components/CaseDetailHeader.tsx` (Badge, Button — 2 → 1)
- `src/features/cases/components/CaseRelated.tsx` (Card/CardContent, Badge — 2 → 1)
- `src/features/cases/components/CaseFilters.tsx` (Input, Button — 2 → 1)
- `src/features/cases/components/CaseProperties.tsx` (Card/CardContent, Badge — 2 → 1)
- `src/features/cases/components/SavedViewsTabs.tsx` (Tabs/TabsList/TabsTrigger)
- `src/features/cases/components/CaseBodyLayout.tsx` (Card/CardContent)
- `src/features/cases/components/CaseMetricsCard.tsx` (Card/CardContent)
- `src/features/cases/components/CaseTimeline.tsx` (Button)
- `src/features/cases/components/CaseRequester.tsx` (Card/CardContent)
- `src/features/cases/constants.ts` (type BadgeProps)
- `src/features/cases/components/CasesTable/CasesTable.tsx` (Table, Badge — 2 → 1)
- `src/features/dashboard/components/StatusDonutChart/StatusDonutChart.tsx` (Card family)
- `src/features/dashboard/components/MonthlyTrendChart/MonthlyTrendChart.tsx` (Card family)
- `src/features/dashboard/components/KPICards/KPICards.tsx` (Card/CardContent)
- `src/features/dashboard/components/CasesByTypeChart/CasesByTypeChart.tsx` (Card family)
- `src/features/dashboard/components/CasesByAreaTable/CasesByAreaTable.tsx` (Card family, Badge — 2 → 1)

Actualizar los `.md` (`badge.md`, `card.md`, `button.md`, `input.md`, `tabs.md`, `separator.md`, `text.md`, `Table.md`) para que el import de ejemplo use `@/components/ui`.

## Verificación
1. `npm run build` (o `npx tsc --noEmit`) sin errores de imports rotos.
2. `npm run lint` para detectar imports no usados.
3. Levantar el dev server y revisar `/` (dashboard) y `/casos` (lista y detalle de caso) — debe verse y comportarse igual.

## Prompt para pegar en Claude Code

```
Quiero consolidar los barrels sueltos de dos carpetas en un único index.ts por carpeta, sin cambiar ningún comportamiento visible.

## 1. src/features/dashboard/components/
Hoy hay 5 archivos sueltos en la raíz de esta carpeta (KPICards.tsx, CasesByAreaTable.tsx, CasesByTypeChart.tsx, MonthlyTrendChart.tsx, StatusDonutChart.tsx), cada uno re-exportando el default de su subcarpeta homónima (ej. `export { default } from './KPICards/KPICards'`). Reemplázalos por un único `src/features/dashboard/components/index.ts` con named re-exports:
export { default as KPICards } from './KPICards/KPICards';
export { default as CasesByAreaTable } from './CasesByAreaTable/CasesByAreaTable';
export { default as CasesByTypeChart } from './CasesByTypeChart/CasesByTypeChart';
export { default as MonthlyTrendChart } from './MonthlyTrendChart/MonthlyTrendChart';
export { default as StatusDonutChart } from './StatusDonutChart/StatusDonutChart';
Borra los 5 archivos sueltos. Actualiza `src/app/page.tsx` (líneas 4-8) para que use un solo `import { KPICards, MonthlyTrendChart, StatusDonutChart, CasesByTypeChart, CasesByAreaTable } from '@/features/dashboard/components';` en vez de 5 imports default. Actualiza también el ejemplo de import en los `.md` de cada subcarpeta (KPICards.md, CasesByAreaTable.md, CasesByTypeChart.md, MonthlyTrendChart.md, StatusDonutChart.md).

## 2. src/components/ui/
Hoy hay 7 archivos sueltos en la raíz (badge.tsx, button.tsx, card.tsx, input.tsx, separator.tsx, tabs.tsx, text.tsx), cada uno con named re-exports hacia su subcarpeta homónima. Reemplázalos por un único `src/components/ui/index.ts`:
export { Badge, badgeVariants } from './badge/badge';
export type { BadgeProps } from './badge/badge';
export { Button, buttonVariants } from './button/button';
export type { ButtonProps } from './button/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card/card';
export { Input } from './input/input';
export type { InputProps } from './input/input';
export { Separator } from './separator/separator';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs/tabs';
export { Text } from './text/text';
export { Table } from './Table';
export type { TableProps } from './Table';
Borra los 7 archivos sueltos (no toques `Table/index.ts`, que ya es interno a su propia carpeta — solo se reexporta desde el índice raíz).

Actualiza TODOS los archivos que importan desde `@/components/ui/<nombre>` para que importen desde `@/components/ui`, consolidando en un solo import statement por archivo cuando se use más de un componente. Los archivos a revisar (usa grep por "@/components/ui/" para confirmar que no falta ninguno):
- src/app/casos/page.tsx
- src/features/cases/components/CaseInfoTabs.tsx
- src/features/cases/components/CaseDetailHeader.tsx
- src/features/cases/components/CaseRelated.tsx
- src/features/cases/components/CaseFilters.tsx
- src/features/cases/components/CaseProperties.tsx
- src/features/cases/components/SavedViewsTabs.tsx
- src/features/cases/components/CaseBodyLayout.tsx
- src/features/cases/components/CaseMetricsCard.tsx
- src/features/cases/components/CaseTimeline.tsx
- src/features/cases/components/CaseRequester.tsx
- src/features/cases/constants.ts
- src/features/cases/components/CasesTable/CasesTable.tsx
- src/features/dashboard/components/StatusDonutChart/StatusDonutChart.tsx
- src/features/dashboard/components/MonthlyTrendChart/MonthlyTrendChart.tsx
- src/features/dashboard/components/KPICards/KPICards.tsx
- src/features/dashboard/components/CasesByTypeChart/CasesByTypeChart.tsx
- src/features/dashboard/components/CasesByAreaTable/CasesByAreaTable.tsx

Actualiza también el ejemplo de import en los .md de cada subcarpeta (badge.md, card.md, button.md, input.md, tabs.md, separator.md, text.md, Table.md) para que usen `@/components/ui`.

## Verificación final
Corré `npm run build` y `npm run lint`, arreglá cualquier error de tipos o import roto. Navegá `/` (dashboard) y `/casos` (lista y detalle de caso) y confirmá que el comportamiento visible es idéntico al que había antes. Reportá un resumen de archivos creados/eliminados/modificados al final.
```
