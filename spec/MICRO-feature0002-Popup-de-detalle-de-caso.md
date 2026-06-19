# Spec: Popup de detalle de caso

## Objetivo

Al hacer clic en una fila de la tabla de casos, abrir un popup/modal con el detalle del caso en lugar de navegar a la página de detalle. La página `/casos/[id]` se conserva intacta y sigue siendo accesible desde el ícono de enlace externo en la columna "Número".

---

## Diseño de referencia

`C:\Users\usuario\Downloads\Popup-detailCase.html`

El header del popup tiene dos paneles:

**Panel izquierdo:**
- Pill `CASO #XXXXXX · CODTYPE` (monospace, fondo neutro)
- Título del caso (`Fraunces` serif, 26 px)
- Badges de estado y prioridad + meta-texto (fecha apertura + tiempo relativo)
- Solicitante: avatar con iniciales, nombre, email, botones icono (historial, email)

**Panel derecho — "Resumen del caso":**
- Header con label "RESUMEN DEL CASO" + botones rápidos: Reasignar / Estado / Cerrar
- Grid 2×3: Tiempo abierto (valor grande), Estado actual, Asignado a (avatar mini + nombre), Equipo, Área SLA, Servicio

**Banner SLA** (debajo del header, ancho completo):
- Fondo ámbar si abierto, verde si cerrado
- Ícono de alerta + texto con horas transcurridas

Luego, debajo del header, el cuerpo del caso (`CaseBodyLayout` existente: Descripción, Timeline, Properties, MetricsCard).

---

## Arquitectura de estado

### Opción elegida: query param `?caso=<id>`

- Clic en fila → `router.push('/casos?caso=123', { scroll: false })` (shallow)
- `CasosPage` lee `searchParams.caso` → si existe, monta el modal
- Cerrar modal → `router.push('/casos', { scroll: false })` (elimina el param)
- Ventajas: URL compartible, botón "Atrás" cierra el modal, consistente con `useCasesFilters`

---

## Archivos a crear

### 1. `src/features/cases/components/CasePopup/CasePopupHeader.tsx`

Componente presentacional. Props: `caso: Case`.

Renderiza el layout de dos columnas del diseño de referencia:

```
┌─────────────────────────────────┬──────────────────────────────┐
│ ID pill / título / badges       │ RESUMEN DEL CASO             │
│ solicitante + botones icono     │ summary-grid 2×3             │
│                                 │ botones rápidos (header)     │
└─────────────────────────────────┴──────────────────────────────┘
[SLA Banner - ancho completo]
```

Reutiliza la lógica de `elapsedHours` / `elapsedLabel` de `CaseDetailHeader.tsx` (importar desde `@/lib/formatters`).
Reutiliza `initials()` — mover a `@/lib/formatters` o duplicar localmente si es la primera vez.
Reutiliza `Badge` de `@/components/ui`.
Reutiliza constantes `STATUS_VARIANT`, `STATUS_LABEL`, `PRIORITY_VARIANT` de `@/features/cases/constants`.

**Datos del summary-grid:**
| Label | Fuente en `Case` |
|---|---|
| Tiempo abierto | `elapsedLabel(caso.createdAt, caso.solvedAt)` |
| Estado actual | `STATUS_LABEL[caso.status]` |
| Asignado a | `caso.assignee` |
| Equipo | `caso.team` (si existe en dominio) |
| Área SLA | `caso.slaArea` |
| Servicio | `caso.serviceType` o `caso.typeName` |

> Verificar qué campos existen en `Case` (`src/types/domain.ts`) y ajustar.

### 2. `src/features/cases/components/CasePopup/CasePopup.tsx`

Modal shell. Props: `caseId: string | null; onClose: () => void`.

Estructura:
```
<dialog / div role="dialog"> (backdrop + panel)
  <button aria-label="Cerrar" onClick={onClose} /> (X, top-right)
  {isLoading && <Loader />}
  {caso && (
    <>
      <CasePopupHeader caso={caso} />
      <div className="overflow-y-auto p-6">
        <CaseBodyLayout caso={caso} />
      </div>
    </>
  )}
</dialog>
```

- Usa `useCase(caseId)` para cargar los datos (hook ya existe en `src/features/cases/hooks/useCase.ts`)
- Cierra con Escape (`useEffect` + `keydown` listener)
- Foco atrapado dentro del modal (o al menos devuelto al trigger al cerrar)
- Backdrop: clic fuera cierra el modal (clic en el overlay llama a `onClose`)
- No desmontar `CaseBodyLayout` si se cierra con animación (opcional, no crítico)
- `'use client'`

### 3. `src/features/cases/components/CasePopup/index.ts`

```ts
export { default as CasePopup } from './CasePopup';
```

---

## Archivos a modificar

### 4. `src/app/casos/page.tsx`

- Convertir a `'use client'` (ya lo es)
- Leer el query param `caso` desde `useSearchParams()`
- Importar y renderizar `CasePopup`
- Lógica de apertura/cierre con `useRouter`

```tsx
// Añadir:
import { useSearchParams, useRouter } from 'next/navigation';
import { CasePopup } from '@/features/cases/components/CasePopup';

// Dentro del componente:
const searchParams = useSearchParams();
const router = useRouter();
const selectedCaseId = searchParams.get('caso');

const handleOpenCase = (id: string) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set('caso', id);
  router.push(`/casos?${params.toString()}`, { scroll: false });
};

const handleClosePopup = () => {
  const params = new URLSearchParams(searchParams.toString());
  params.delete('caso');
  router.push(`/casos?${params.toString()}`, { scroll: false });
};

// Pasar onRowClick a CasesTable:
<CasesTable
  data={data?.casos ?? []}
  isLoading={isLoading}
  error={error?.message ?? null}
  onRowClick={(caso) => handleOpenCase(String(caso.id))}
/>

// Al final del JSX, fuera de <main>:
{selectedCaseId && (
  <CasePopup caseId={selectedCaseId} onClose={handleClosePopup} />
)}
```

### 5. `src/features/cases/components/CasesTable/CasesTable.types.ts`

Agregar prop opcional:

```ts
import type { Case } from '@/types/domain';

export interface CasesTableProps {
  data: Case[];
  isLoading: boolean;
  error: string | null;
  onRowClick?: (caso: Case) => void;  // NUEVO
}
```

### 6. `src/features/cases/components/CasesTable/CasesTable.tsx`

- Recibir `onRowClick` desde props
- Pasar `onRowClick` al componente `<Table>` (ya tiene la prop `onRowClick?` según la arquitectura existente)
- Cambiar la celda "Número": el `<Link>` se convierte en solo el ícono de enlace externo (abre la página de detalle en la misma pestaña), y el número en texto plano — el clic en la fila abre el popup

```tsx
col.accessor('caseNumber', {
  header: 'Número',
  cell: (info) => (
    <div className="flex items-center gap-1">
      <span className="font-mono text-xs font-medium text-gray-700">
        {String(info.getValue())}
      </span>
      <Link
        href={`/casos/${info.row.original.id}`}
        onClick={(e) => e.stopPropagation()}  // evitar que el clic en el link dispare onRowClick
        className="text-[#0F4C3A] hover:text-[#0F4C3A]/70"
        title="Abrir página completa"
      >
        <ExternalLink className="h-3 w-3 opacity-60" />
      </Link>
    </div>
  ),
}),
```

---

## Estilos del popup

Usar Tailwind, mapeando los tokens del HTML de referencia a los tokens ya definidos en el proyecto:

| Variable HTML | Token / clase Tailwind |
|---|---|
| `--bg: #FAFAF7` | `bg-[#FAFAF7]` o `bg-gray-50` |
| `--surface: #FFFFFF` | `bg-white` |
| `--border: #ECECE6` | `border-[#ECECE6]` o `border-gray-200` |
| `--accent: #0F4C3A` | `bg-[#0F4C3A]` (ya usado en el proyecto) |
| `--warning: #C2691A` | `text-amber-700` |
| `--warning-soft: #FBF6E8` | `bg-amber-50` |
| `--proveedor: #6B4A7E` | `text-[#6B4A7E]` |
| `--proveedor-soft: #EDE4F0` | `bg-[#EDE4F0]` |

El panel del popup:
- Ancho máximo: `max-w-5xl w-full` (≈ 1024 px)
- Alto máximo: `max-h-[90vh]` con `overflow-y-auto` en el cuerpo
- Bordes redondeados: `rounded-xl`
- Sombra: `shadow-2xl`
- Backdrop: `fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4`

---

## Checklist de implementación

- [ ] Verificar campos del tipo `Case` en `src/types/domain.ts` (team, serviceType, etc.) antes de implementar `CasePopupHeader`
- [ ] Crear `CasePopupHeader.tsx`
- [ ] Crear `CasePopup.tsx`
- [ ] Crear `CasePopup/index.ts`
- [ ] Modificar `CasesTable.types.ts` — agregar `onRowClick?`
- [ ] Modificar `CasesTable.tsx` — cambiar celda "Número" + pasar `onRowClick`
- [ ] Modificar `src/app/casos/page.tsx` — leer `?caso`, renderizar `CasePopup`
- [ ] Verificar que la página `/casos/[id]` sigue funcionando sin cambios
- [ ] Verificar que el link externo (ExternalLink) en la tabla abre la página de detalle
- [ ] Verificar cierre con Escape y clic en backdrop

---

## Lo que NO cambia

- `src/app/casos/[id]/page.tsx` — no se toca
- `CaseDetailHeader.tsx` — no se toca (sigue siendo el header de la página de detalle)
- `CaseBodyLayout.tsx` — se reutiliza tal cual dentro del popup
- `useCase.ts` — se reutiliza tal cual
- Todas las rutas API y servicios backend — sin cambios
