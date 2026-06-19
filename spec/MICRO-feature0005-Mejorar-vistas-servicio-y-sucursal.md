# Mejorar diseño de "Casos por Servicio" y "Casos por Sucursal" — Dashboard-Panel-metricas

## Contexto

En el dashboard (`src/app/page.tsx`) los widgets "Casos por Servicio" (gráfico de barras horizontal) y "Casos por Sucursal" (tabla) necesitan mejoras de diseño:

- **Casos por Sucursal** (`CasesByBranchOfficeTable.tsx`): hoy es una tabla HTML plana sin scroll, sin orden ni búsqueda. Va a pasar a tener ~30 filas (sucursales), lo que la hace muy larga e incómoda de escanear dentro del dashboard.
- **Casos por Servicio** (`CasesByServiceChart.tsx`): el gráfico tiene altura fija (220px) y etiquetas angostas (`width 140`) que se cortan/envuelven mal con nombres largos de servicio ("CONFIGURACION DE EQUIPO", "CAMBIO DE CONTRASEÑA"), fuente pequeña (11px) y no muestra el valor numérico junto a la barra.

## Decisiones confirmadas

- **Sucursal**: mantener el formato tabla, pero con **scroll interno + cabecera fija + buscador por nombre**, reutilizando el componente genérico `Table` (`src/components/ui/Table/`) en vez de la tabla HTML manual actual.
- **Servicio**: priorizar **legibilidad y tamaño** (altura adaptable a la cantidad de servicios, fuente más grande, etiquetas que no se corten, valor numérico visible al final de cada barra). No se cambia el orden de las barras ni la paleta de colores (`PALETTE`).

## Cambios por capa

### 1. `src/components/ui/Table/Table.tsx` y `Table.types.ts` — mejoras genéricas (reutilizables)
- Agregar `sticky top-0 z-10` a la clase del `<thead>` (ya tiene `bg-gray-50`, así que queda visualmente igual cuando no hay scroll, y se "pega" arriba cuando el contenedor padre tiene `overflow-y-auto` + altura fija).
- Agregar soporte opcional de alineación por columna vía `columnDef.meta?.align: 'left' | 'right'` (extender el tipo de `ColumnDef` usado en `TableProps`), aplicando `text-right` tanto al `<th>` como al `<td>` cuando corresponda. Necesario para que "Total", "Cerrados" y "Tasa cierre" queden alineados a la derecha como en el diseño actual.
- Cambios aditivos/opcionales: no afectan el uso actual en `src/features/cases/components/CasesTable/CasesTable.tsx`.

### 2. `src/features/dashboard/components/CasesByBranchOfficeTable/CasesByBranchOfficeTable.tsx` — reescritura
- Pasa a `'use client'` (necesita estado local).
- Estado local: `const [search, setSearch] = useState('')`.
- `useMemo` para filtrar `data` por `area` (case-insensitive) según `search`, y ordenar el resultado por `total` descendente como orden por defecto (tipo "ranking"); el usuario puede reordenar haciendo click en cualquier columna, ya soportado por `Table`.
- Reemplazar la tabla HTML manual por el componente genérico `<Table />` (`@/components/ui`), con columnas vía `createColumnHelper<AreaStats>()`:
  - `area` → "Sucursal" (izquierda, texto en negrita como hoy).
  - `total` → "Total" (derecha).
  - `cerrados` → "Cerrados" (derecha).
  - `tasaCierre` → "Tasa cierre" (derecha), celda con el mismo `<Badge>` y misma lógica de variant (`success` ≥70, `warning` ≥40, `destructive` <40) que ya existe.
- Buscador: input con icono `Search` (lucide-react), reutilizando el patrón visual de `src/features/cases/components/CaseFilters.tsx` (`<Input className="pl-8" />` + icono absoluto), colocado en `CardHeader` o justo arriba de la tabla en `CardContent`.
- Contenedor de scroll: envolver `<Table />` en un `div` con `max-h-[360px] overflow-y-auto` para que la cabecera (ahora `sticky`) quede fija y el body haga scroll a partir de ~8-9 filas visibles.
- Mantener `getRowId={(row) => row.area}` y agregar `emptyMessage="No se encontraron sucursales."` para el caso de búsqueda sin resultados.

### 3. `src/features/dashboard/components/CasesByServiceChart/CasesByServiceChart.tsx` — ajustes de legibilidad
- Altura adaptable: `const chartHeight = Math.max(240, chartData.length * 40);`, usado en `ResponsiveContainer height={chartHeight}` en vez del valor fijo 220.
- `YAxis`: aumentar `width` de 140 a ~170-180 y `tick.fontSize` de 11 a 12-13, para que las etiquetas largas no se corten ni se amontonen.
- `XAxis`: subir `tick.fontSize` a 12.
- Agregar `LabelList` (import desde `recharts`) dentro de `<Bar>`, con `dataKey="cantidad"`, `position="right"`, fuente ~11-12px y color `#374151`, para mostrar el valor numérico al final de cada barra.
- Ajustar `margin.right` (de 24 a ~36-40) para que el nuevo label numérico no quede cortado por el borde del card.
- No se modifica el orden de las barras ni la paleta de colores (`PALETTE`).

## Explícitamente fuera de alcance
- `CasesByAreaTable.tsx` (tabla similar pero de "Área SLA") no se toca — no es uno de los dos widgets del dashboard mencionados.
- `src/app/page.tsx` no necesita cambios de layout/props: los componentes siguen recibiendo `data.porServicio` y `data.porSucursal` igual que hoy.
- Sin cambios de backend/API: `useDashboardMetrics` ya trae todos los datos de una sola vez; el filtrado/orden de sucursales es 100% client-side.
- No se agrega paginación de servidor ni nuevos endpoints.

## Verificación
1. `npm run dev` y abrir el dashboard (`/`).
2. **Servicio**: las barras se ven con etiquetas completas (sin corte raro), fuente legible, y un número al final de cada barra; el alto del card se ajusta razonablemente según la cantidad de servicios.
3. **Sucursal**: aparece el buscador, tipear filtra por nombre de sucursal, click en "Total"/"Tasa cierre" ordena la tabla, y con más de ~8-9 filas aparece scroll interno con la cabecera fija.
4. `CasesTable.tsx` (en `/casos`) sigue funcionando igual visualmente tras los cambios en `Table.tsx` (el sticky header sin scroll no debería notarse).
5. `npm run lint` y `npm run build` sin errores de tipos (en particular el nuevo `meta.align` en `ColumnDef`).

## Prompt para pegar en Claude Code

```
Quiero mejorar el diseño de dos widgets del dashboard, sin cambiar los datos que consumen ni el backend.

1. Casos por Sucursal (src/features/dashboard/components/CasesByBranchOfficeTable/CasesByBranchOfficeTable.tsx): hoy es una tabla HTML manual sin scroll/orden/búsqueda, y va a tener ~30 filas. Reescribila usando el componente genérico Table (src/components/ui/Table/) con columnas vía createColumnHelper<AreaStats>() (Sucursal izquierda, Total/Cerrados/Tasa cierre derecha, manteniendo el Badge de tasaCierre con la misma lógica de variant que ya existe). Agregá un buscador por nombre de sucursal (mismo patrón visual que CaseFilters.tsx: Input con icono Search) y ordená por defecto por total descendente. Envolvé la tabla en un contenedor con max-h-[360px] overflow-y-auto para que haya scroll interno una vez superadas ~8-9 filas.

2. En el componente genérico Table (src/components/ui/Table/Table.tsx y Table.types.ts): agregá sticky top-0 z-10 al thead (para que la cabecera quede fija al hacer scroll dentro de un contenedor con overflow-y-auto), y soporte opcional de alineación por columna vía columnDef.meta?.align: 'left' | 'right', aplicando text-right tanto al th como al td cuando corresponda. Estos cambios deben ser aditivos y no romper el uso actual en CasesTable.tsx (src/features/cases/components/CasesTable/CasesTable.tsx).

3. Casos por Servicio (src/features/dashboard/components/CasesByServiceChart/CasesByServiceChart.tsx): mejorá la legibilidad sin cambiar el orden de las barras ni la paleta de colores. Hacé la altura del gráfico adaptable a la cantidad de servicios (ej. Math.max(240, chartData.length * 40)), aumentá el width del YAxis (de 140 a ~170-180) y el fontSize de los ticks (de 11 a 12-13) para que las etiquetas largas no se corten, y agregá un LabelList con el valor numérico al final de cada barra (dataKey="cantidad", position="right"). Ajustá el margin.right del BarChart para que ese número no quede cortado.

No toques CasesByAreaTable.tsx, src/app/page.tsx, ni ningún endpoint/servicio de backend — todo el filtrado/orden de sucursales es client-side sobre los datos que ya trae useDashboardMetrics.

Al terminar, corré npm run lint y npm run build, y navegá / para confirmar visualmente ambos widgets (buscador y scroll en Sucursal, etiquetas y valores legibles en Servicio).
```
