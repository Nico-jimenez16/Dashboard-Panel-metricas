# CasesTable

Tabla presentacional de casos. Recibe datos por props — no hace fetch internamente.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `data` | `Case[]` | Lista de casos a mostrar |
| `isLoading` | `boolean` | Muestra spinner mientras carga |
| `error` | `string \| null` | Muestra mensaje de error si no es null |

## Ejemplo

```tsx
import CasesTable from '@/features/cases/components/CasesTable';

const { data, isLoading, error } = useCases(activeFilters);

<CasesTable
  data={data?.casos ?? []}
  isLoading={isLoading}
  error={error?.message ?? null}
/>
```
