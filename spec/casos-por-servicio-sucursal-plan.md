# Cambiar agrupadores del dashboard: Service y BranchOffice — Dashboard-Panel-metricas

## Contexto

Hoy el dashboard (`src/app/page.tsx`) tiene dos componentes que agrupan casos por `slaArea`:

- `CasesByTypeChart` (`src/features/dashboard/components/CasesByTypeChart/`): bar chart horizontal, título **"Casos por Área SLA"**, consume `DashboardMetrics.porTipo: TypeCount[]` (`{ tipo, cantidad }`).
- `CasesByAreaTable` (`src/features/dashboard/components/CasesByAreaTable/`): tabla con total/cerrados/tasa de cierre, título **"Casos por Área"**, consume `DashboardMetrics.porArea: AreaStats[]` (`{ area, total, cerrados, tasaCierre }`).

Ambos se calculan en `src/server/services/metrics.service.ts` agrupando por `c.slaArea` (con fallback `'Sin área'`).

El tipo `Case` (`src/types/domain.ts`) ya expone `service: string | null` y `branchOffice: string | null` (poblados en el mock de `src/server/gestar/mock-generator.ts`), así que no hace falta tocar la capa Gestar/mock.

**Objetivo:** reemplazar el agrupador `slaArea` por:
- El **bar chart** (`CasesByTypeChart`) → agrupado por **`service`**.
- La **tabla** (`CasesByAreaTable`) → agrupado por **`branchOffice`**.

Esto es un *replace*, no un agregado: ambos componentes existentes cambian de qué campo agrupan y de título; no se agregan gráficos nuevos al lado de los actuales.

## Decisiones de nombres (a confirmar al ejecutar)

- Renombrar los componentes para que el nombre refleje el dato real:
  - `CasesByTypeChart` → `CasesByServiceChart`, título **"Casos por Servicio"**.
  - `CasesByAreaTable` → `CasesByBranchOfficeTable`, título **"Casos por Sucursal"**.
- Renombrar las claves en `DashboardMetrics`: `porTipo` → `porServicio`, `porArea` → `porSucursal` (se mantiene la convención en español del resto de la interfaz: `porEstado`, `tendenciaMensual`, etc.).
- Los tipos `TypeCount` y `AreaStats` son contenedores genéricos (`{ tipo, cantidad }` / `{ area, total, cerrados, tasaCierre }`); no es necesario renombrar sus campos internos, solo lo que representan semánticamente. Si se prefiere, se puede dejar `TypeCount`/`AreaStats` con esos mismos nombres de campo (`tipo`, `area`) aunque ahora contengan `service`/`branchOffice` — son etiquetas genéricas, no acopladas al dominio SLA.
- Fallbacks para valores `null`: `'Sin servicio'` y `'Sin sucursal'` (mismo patrón que el `'Sin área'` actual).

## Cambios por capa

### 1. `src/server/services/metrics.service.ts`
- En `getDashboardMetrics`, cambiar el agrupador inline de `porTipo` (hoy itera `c.slaArea ?? 'Sin área'`) para que itere `c.service ?? 'Sin servicio'`, renombrando la variable resultado a `porServicio`.
- Generalizar `buildAreaStats(cases: Case[])` para aceptar un *key extractor*, p. ej. `buildGroupStats(cases: Case[], keyFn: (c: Case) => string | null, fallback: string)`, y usarlo para construir `porSucursal` con `c.branchOffice ?? 'Sin sucursal'`. (Mantiene la lógica de `total`/`cerrados`/`tasaCierre` intacta, solo cambia el campo agrupador.)
- Actualizar el objeto devuelto: `porServicio` en lugar de `porTipo`, `porSucursal` en lugar de `porArea`.

### 2. `src/types/domain.ts`
- Renombrar en `DashboardMetrics`: `porTipo: TypeCount[]` → `porServicio: TypeCount[]`, `porArea: AreaStats[]` → `porSucursal: AreaStats[]`.
- `TypeCount` y `AreaStats` quedan sin cambios de forma (ver decisión de nombres arriba).

### 3. Componentes — folder rename + ajuste de título/prop

**`src/features/dashboard/components/CasesByServiceChart/`** (ex `CasesByTypeChart/`):
- `CasesByServiceChart.tsx`: mismo bar chart (paleta, layout vertical, tooltip), cambia solo el título del `CardTitle` a **"Casos por Servicio"**.
- `CasesByServiceChart.types.ts`: `CasesByServiceChartProps { data: TypeCount[] }`.
- `CasesByServiceChart.md`: doc actualizada (descripción "agrupado por servicio", ejemplo `<CasesByServiceChart data={data.porServicio} />`).

**`src/features/dashboard/components/CasesByBranchOfficeTable/`** (ex `CasesByAreaTable/`):
- `CasesByBranchOfficeTable.tsx`: misma tabla (columnas Total/Cerrados/Tasa cierre), cambia el título del `CardTitle` a **"Casos por Sucursal"** y la columna `Área` → `Sucursal`. La prop sigue siendo `data: AreaStats[]` pero ahora el campo `area` de cada fila contiene el nombre de sucursal.
- `CasesByBranchOfficeTable.types.ts`: `CasesByBranchOfficeTableProps { data: AreaStats[] }`.
- `CasesByBranchOfficeTable.md`: doc actualizada.

- Borrar las carpetas viejas `CasesByTypeChart/` y `CasesByAreaTable/` tras el rename (no deben quedar archivos huérfanos).

### 4. `src/features/dashboard/components/index.ts`
Actualizar el barrel:
```ts
export { default as CasesByServiceChart } from './CasesByServiceChart/CasesByServiceChart';
export { default as CasesByBranchOfficeTable } from './CasesByBranchOfficeTable/CasesByBranchOfficeTable';
```

### 5. `src/app/page.tsx`
- Actualizar el import: `CasesByServiceChart`, `CasesByBranchOfficeTable`.
- Actualizar el render:
```tsx
<CasesByServiceChart data={data.porServicio} />
<CasesByBranchOfficeTable data={data.porSucursal} />
```

### Explícitamente fuera de alcance
- No se toca `/casos` (lista/tabla de casos) ni sus filtros — el `slaArea` sigue existiendo en `Case`/`CasesFilters` para esa página, esto solo afecta los dos componentes del dashboard.
- No se agrega UI nueva para filtrar el dashboard por servicio o sucursal — solo se cambia el agrupador de los dos componentes existentes.
- No se cambia la capa Gestar/mock (`service` y `branchOffice` ya existen en `Case`).

## Verificación
- `npm run build` y `npm run lint` sin errores.
- Navegar `/`: el bar chart debe mostrar "Casos por Servicio" con barras agrupadas por servicio (no por área SLA), y la tabla debe mostrar "Casos por Sucursal" con filas por sucursal, manteniendo el cálculo de total/cerrados/tasa de cierre.
- Confirmar que no quedan referencias a `porTipo`/`porArea`/`CasesByTypeChart`/`CasesByAreaTable` en el código (`grep`).

## Prompt para pegar en Claude Code

```
Quiero reemplazar los dos componentes del dashboard que agrupan por slaArea, para que agrupen por otros campos de Case. Es un replace, no un agregado: no quiero gráficos nuevos al lado de los actuales, quiero que los dos existentes cambien de agrupador.

1. CasesByTypeChart (bar chart horizontal, título "Casos por Área SLA", hoy agrupa por slaArea) → debe agrupar por `service` (campo `service: string | null` en Case, fallback 'Sin servicio'). Renombrá el componente a CasesByServiceChart (carpeta, .tsx, .types.ts, .md) y el título a "Casos por Servicio". Borrá la carpeta vieja CasesByTypeChart/.

2. CasesByAreaTable (tabla con Total/Cerrados/Tasa cierre, título "Casos por Área", hoy agrupa por slaArea) → debe agrupar por `branchOffice` (campo `branchOffice: string | null` en Case, fallback 'Sin sucursal'). Renombrá el componente a CasesByBranchOfficeTable (carpeta, .tsx, .types.ts, .md), el título a "Casos por Sucursal" y la columna "Área" a "Sucursal". Borrá la carpeta vieja CasesByAreaTable/.

3. En src/server/services/metrics.service.ts: cambiá el cálculo de `porTipo` para que agrupe por `c.service` en vez de `c.slaArea`, y renombralo a `porServicio`. Generalizá `buildAreaStats` (hoy fija a slaArea) para aceptar un key extractor, y usalo para construir `porSucursal` agrupando por `c.branchOffice`. Mantené intacta la lógica de cálculo de total/cerrados/tasaCierre.

4. En src/types/domain.ts: renombrá en DashboardMetrics `porTipo` → `porServicio` y `porArea` → `porSucursal`. Los tipos TypeCount y AreaStats quedan iguales en forma (son contenedores genéricos label+cantidad / label+stats).

5. Actualizá el barrel src/features/dashboard/components/index.ts y el render en src/app/page.tsx para usar los nuevos nombres de componente y las nuevas claves (`data.porServicio`, `data.porSucursal`).

No toques /casos, sus filtros, ni la capa Gestar/mock (service y branchOffice ya existen en el tipo Case y en el generador mock). No agregues filtros nuevos de servicio/sucursal en la UI, solo cambiá el agrupador de estos dos componentes.

Al terminar, corré npm run build y npm run lint, navegá / para confirmar que el bar chart y la tabla muestran los nuevos agrupadores correctamente, y verificá con grep que no quedan referencias a porTipo, porArea, CasesByTypeChart o CasesByAreaTable.
```
