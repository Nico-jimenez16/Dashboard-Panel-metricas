# Refactor general — Dashboard-Panel-metricas

## Contexto

El proyecto es un dashboard Next.js 16 (App Router) full-stack para gestión de "Casos" (incidentes Gestar). La arquitectura de datos ya es razonablemente sólida (Page → Hook (React Query) → apiClient → Route Handler (BFF) → Service → Gestar Client/Cache), pero tiene deuda técnica concreta:

- `CasesTable.tsx` implementa la tabla TanStack directamente inline (sin componente genérico reutilizable).
- `STATUS_VARIANT` / `STATUS_LABEL` / `PRIORITY_VARIANT` están **duplicados** entre `constants.ts` y `CasesTable.tsx`.
- El cálculo de horas transcurridas (`elapsedHours`) está **duplicado** entre `CaseDetailHeader.tsx` y `CaseMetricsCard.tsx`.
- `src/app/casos/page.tsx` mezcla estado de vista (tabs), estado de filtros, derivación de filtros activos, paginación y orquestación de fetch en un solo componente.
- El filtrado de casos en `cases.service.ts` es una cadena de 4 `if` inline (poco abierto a extensión — viola OCP).
- No existe un componente `Table` genérico y reutilizable (estilo el ejemplo `FamiliesTable` que el usuario mostró), ni el patrón de carpeta-por-componente (`Componente/Componente.tsx` + `.types.ts` + `.md`) en `components/ui` ni `components/layout`.

El usuario confirmó por las respuestas:
1. **Entregable**: solo un **prompt** para pegar en otra sesión de Claude Code (no se va a tocar código en esta conversación).
2. **Alcance**: el proyecto completo en una sola pasada (Cases, Dashboard, Notes, librería de componentes compartidos).
3. **Boundary de fetching**: el hook (`useCases`, `useDashboardMetrics`, etc.) se sigue llamando **en la página**; los componentes de tabla por feature (`CasesTable`, etc.) son **puramente presentacionales** y reciben `data` / `isLoading` / `error` por props — igual que el ejemplo `FamiliesTable`.

No existe ningún "Families" en este repo (verificado con grep/find) — el ejemplo es solo un patrón de referencia a aplicar sobre "Cases" y el resto de las features.

## Arquitectura objetivo

```
Page (app/casos/page.tsx)
  └─ usa hook de filtros (useCasesFilters) → estado de vista/filtros/paginación
  └─ usa useCases(activeFilters) → { data, isLoading, error }
  └─ renderiza <CasesStatsBar/> (métricas, ya limpio)
  └─ renderiza <CasesTable data isLoading error />   (presentacional)
        └─ define columnas de dominio (caseColumns)
        └─ renderiza <Table data columns getRowId emptyMessage loading /> (genérico, en components/ui)
```

Mismo patrón para Dashboard (`useDashboardMetrics` en la página, `CasesByAreaTable` presentacional usando el `Table` genérico si aplica).

### 1. Componente `Table` genérico y reutilizable
Nuevo: `src/components/ui/Table/Table.tsx`, `Table.types.ts`, `Table.md`.
- Mantiene `@tanstack/react-table` por debajo (no se pierde el sorting actual).
- Props genéricas, sin conocimiento de dominio: `data`, `columns`, `getRowId`, `emptyMessage`, `loading`, y opcionalmente `onRowClick`.
- Sustituye el JSX de tabla que hoy está escrito directamente dentro de `CasesTable.tsx`.

### 2. Patrón carpeta-por-componente en la librería compartida
Para cada componente en `src/components/ui/` (`badge`, `button`, `card`, `input`, `separator`, `tabs`, `text`) y `src/components/layout/` (`Breadcrumbs`, `Header`, `Sidebar`):
- Mover a `ComponentName/ComponentName.tsx` + `ComponentName.types.ts` (props/variantes) + `ComponentName.md` (doc corta: props + ejemplo de uso).
- Actualizar todos los imports afectados.
- `colorTokens.ts`, `fontTokens.ts`, `spacingTokens.ts` no son componentes — quedan donde están (o se agrupan en `components/ui/tokens/` si se prefiere, sin romper imports).

### 3. Componentes de tabla por feature (presentacionales, props-driven)

**Cases** — `src/features/cases/components/CasesTable/`:
- `CasesTable.tsx` + `.types.ts` + `.md`.
- Props: `{ data: Case[]; isLoading: boolean; error: string | null }`.
- Si `error`, renderiza el mensaje de error (igual que hoy). Si no, define `caseColumns` (usando `STATUS_VARIANT`/`STATUS_LABEL`/`PRIORITY_VARIANT` importados de `constants.ts`, **sin duplicar**) y renderiza `<Table data={data} columns={caseColumns} getRowId={(c) => c.id} emptyMessage="No se encontraron casos." loading={isLoading} />`.

**Dashboard** — `src/features/dashboard/components/CasesByAreaTable/`: mismo patrón (folder + presentacional + usa `Table` genérico si su contenido es tabular). El resto de los componentes de dashboard (`KPICards`, `MonthlyTrendChart`, `StatusDonutChart`, `CasesByTypeChart`) se foldericen igual (`.tsx`/`.types.ts`/`.md`) pero mantienen su lógica de presentación actual, recibiendo datos por props desde la página.

**Notes**: fuera del alcance del patrón Table (no es tabular ni pasa por BFF); solo foldericear si aplica sin alterar su lógica de store Zustand.

### 4. Limpieza de la página `casos`

Nuevo hook `src/features/cases/hooks/useCasesFilters.ts`:
- Encapsula `view`, `filters`, paginación y la derivación de `activeFilters` (lo que hoy está inline en `page.tsx`, líneas ~15-28).
- Expone algo como `{ view, setView, filters, setFilters, activeFilters, nextPage, prevPage }`.

`src/app/casos/page.tsx` queda como orquestador fino:
- `const { view, setView, filters, setFilters, activeFilters, nextPage, prevPage } = useCasesFilters();`
- `const { data, isLoading, error } = useCases(activeFilters);`
- Renderiza `SavedViewsTabs`, `CaseFilters`, `CasesStatsBar` (métricas), `CasesTable` (con `data`, `isLoading`, `error`) y los controles de paginación, sin lógica de negocio inline.

Mismo criterio para `src/app/page.tsx` (dashboard): cualquier derivación de filtros/rango de fechas que tenga debe vivir en un hook de la feature dashboard, no inline en la página.

### 5. Backend — Service layer (SOLID)

`src/server/services/cases.service.ts`:
- Extraer las 4 condiciones de filtrado (`status`, `priority`, `slaArea`, `busqueda`) a predicados componibles, p. ej. nuevo archivo `src/server/services/caseFilters.ts` con funciones puras `byStatus(filters)`, `byPriority(filters)`, `bySlaArea(filters)`, `bySearch(filters)` que devuelven `(c: Case) => boolean`.
- `listCases` compone: `const predicates = buildPredicates(filters); filtered = all.filter(c => predicates.every(p => p(c)))`.
- Esto resuelve el Open/Closed: agregar un filtro nuevo no toca los existentes.

### 6. De-duplicación puntual
- Eliminar el bloque `STATUS_VARIANT`/`STATUS_LABEL`/`PRIORITY_VARIANT` duplicado dentro de `CasesTable.tsx`; usar solo `src/features/cases/constants.ts`.
- Unificar `elapsedHours`/`elapsedLabel` (hoy en `CaseDetailHeader.tsx` y `CaseMetricsCard.tsx`) en una sola utilidad, p. ej. `src/lib/formatters.ts` exportando `elapsedHours(createdAt, solvedAt)`, importada por ambos componentes.

### Explícitamente fuera de alcance (para no romper nada)
- Renombrar rutas/params en español (`/api/casos`, `busqueda`, `pagina`) — atado a la API externa Gestar, alto riesgo y sin beneficio funcional.
- Agregar el filtro de `slaArea` a la UI (existe en el tipo/servicio pero no en `CaseFilters.tsx`) — es una feature nueva, no refactor.
- Cambiar la estrategia de `queryKey` en `useCases` — ya funciona correctamente con React Query v5 (hashing profundo de keys), no es un bug real.

## Verificación (a correr por quien ejecute el prompt)
- `npm run build` y `npm run lint` deben pasar sin errores.
- Navegar `/casos`: tabs de vista, filtros (búsqueda + prioridad), paginación y tabla deben comportarse igual que antes.
- Navegar `/casos/[id]`: detalle, métricas (`CaseMetricsCard`), timeline y casos relacionados sin cambios visuales/funcionales.
- Navegar `/` (dashboard): KPIs, gráficos y tabla por área sin cambios.
- Verificar que no queden imports rotos tras mover archivos a carpetas (`grep` por las rutas viejas).

## Prompt para pegar en Claude Code

```
Quiero que hagas un refactor general de este proyecto (Dashboard-Panel-metricas, Next.js 16 App Router) siguiendo SOLID y separación de responsabilidades, SIN cambiar ningún comportamiento visible: todo debe funcionar exactamente igual que antes (mismas rutas, mismos filtros, misma UI, mismo BFF). No renombres rutas de API ni parámetros en español (busqueda, pagina, /api/casos), no agregues filtros nuevos (ej. slaArea en la UI), y no cambies la estrategia de queryKey de React Query.

## 1. Componente Table genérico reutilizable
Crea `src/components/ui/Table/Table.tsx`, `Table.types.ts` y `Table.md`. Debe ser un componente de tabla genérico y agnóstico de dominio, usando @tanstack/react-table por debajo (mismo sorting que hoy tiene CasesTable). Props: `data`, `columns`, `getRowId`, `emptyMessage`, `loading`, y opcionalmente `onRowClick`. Toma como referencia la implementación actual de la tabla embebida en `src/features/cases/components/CasesTable.tsx` (estructura HTML, clases Tailwind, manejo de sorting con flechas, estado vacío) y muévela ahí, generalizada.

## 2. Patrón carpeta-por-componente en la librería compartida
Para cada componente en `src/components/ui/` (badge, button, card, input, separator, tabs, text) y `src/components/layout/` (Breadcrumbs, Header, Sidebar): muévelo a su propia carpeta `ComponentName/ComponentName.tsx` + `ComponentName.types.ts` (tipos/props/variantes extraídos del .tsx) + `ComponentName.md` (doc corta: props y un ejemplo de uso). Actualiza todos los imports en el proyecto que referencian estos archivos. Los archivos `colorTokens.ts`, `fontTokens.ts`, `spacingTokens.ts` no son componentes, no los muevas a carpetas de componente (podés agruparlos en `components/ui/tokens/` si simplifica, pero sin romper imports).

## 3. CasesTable presentacional + hook de fetching en la página
Crea `src/features/cases/components/CasesTable/CasesTable.tsx` + `.types.ts` + `.md`. Debe ser puramente presentacional: recibe `{ data: Case[], isLoading: boolean, error: string | null }` por props (el fetching NO ocurre acá). Si hay error, renderiza el mensaje de error. Si no, define las columnas de dominio (usando `STATUS_VARIANT`, `STATUS_LABEL`, `PRIORITY_VARIANT` importados desde `src/features/cases/constants.ts` — eliminá el bloque duplicado de esas constantes que hoy está inline en CasesTable.tsx) y renderiza el componente `Table` genérico de `components/ui/Table` pasándole `data`, `columns`, `getRowId={(c) => c.id}`, `emptyMessage="No se encontraron casos."`, `loading={isLoading}`.

Borra el `src/features/cases/components/CasesTable.tsx` viejo (queda reemplazado por la carpeta).

## 4. Hook de filtros para la página de casos
Crea `src/features/cases/hooks/useCasesFilters.ts`. Debe encapsular el estado de `view` (tabs), `filters` (CasesFilters) y la derivación de `activeFilters` que hoy vive inline en `src/app/casos/page.tsx` (combina `view` con `filters.status`, resetea `pagina` al cambiar filtro/vista). Expone algo como `{ view, setView, filters, setFilters, activeFilters, nextPage, prevPage }` (revisa la lógica de paginación actual en page.tsx para no perder comportamiento).

Refactoriza `src/app/casos/page.tsx` para que sea un orquestador fino: usa `useCasesFilters()` para el estado/derivación de filtros, usa `useCases(activeFilters)` para el fetch (el hook se sigue llamando en la página), y renderiza `SavedViewsTabs`, `CaseFilters`, `CasesStatsBar` (métricas, sin lógica), `<CasesTable data={data?.casos ?? []} isLoading={isLoading} error={error?.message ?? null} />` y los controles de paginación usando `nextPage`/`prevPage` del hook. No debe quedar lógica de negocio (cálculo de filtros activos, etc.) inline en el componente de página.

Aplica el mismo criterio de "página fina + hook de filtros" a `src/app/page.tsx` (dashboard) si tiene lógica de filtros/rango de fechas inline — muévela a un hook dentro de `src/features/dashboard/hooks/`.

## 5. Dashboard: mismo patrón de componentes
Foldericea `src/features/dashboard/components/` (CasesByAreaTable, CasesByTypeChart, KPICards, MonthlyTrendChart, StatusDonutChart) al patrón `ComponentName/ComponentName.tsx` + `.types.ts` + `.md`, manteniendo su lógica actual de presentación. Si `CasesByAreaTable` renderiza una tabla de datos genuina, migrala para usar el componente `Table` genérico de `components/ui/Table`, igual que CasesTable. Todos deben recibir sus datos por props desde `src/app/page.tsx`, que sigue llamando a `useDashboardMetrics()`.

## 6. Backend: filtros componibles (Open/Closed)
En `src/server/services/cases.service.ts`, extrae la lógica de filtrado (hoy 4 bloques `if` para status/priority/slaArea/busqueda) a un nuevo archivo `src/server/services/caseFilters.ts` con funciones puras tipo `byStatus(filters: CasesFilters): (c: Case) => boolean`, `byPriority(...)`, `bySlaArea(...)`, `bySearch(...)`. En `listCases`, compone los predicados aplicables (solo los que tienen filtro definido) y filtra con `.every()`. No cambies el comportamiento de filtrado, solo la estructura.

## 7. De-duplicación de utilidades
Unifica el cálculo de horas transcurridas (`elapsedHours`/`elapsedLabel`), hoy duplicado entre `src/features/cases/components/CaseDetailHeader.tsx` y `src/features/cases/components/CaseMetricsCard.tsx`, en una sola función exportada desde `src/lib/formatters.ts` (ej. `elapsedHours(createdAt: string, solvedAt: string | null): number`), e impórtala en ambos componentes en vez de redefinirla.

## 8. Verificación final
Después de todos los cambios:
- Corré `npm run build` y `npm run lint`, y arreglá cualquier error de tipos o de imports rotos (rutas movidas a carpetas).
- Navegá `/casos` (tabs, filtros, paginación, tabla), `/casos/[id]` (detalle, métricas, timeline, relacionados) y `/` (dashboard: KPIs, gráficos, tabla por área) y confirmá que el comportamiento visible es idéntico al que había antes del refactor.
- Reportá un resumen de archivos movidos/creados/eliminados al final.
```
