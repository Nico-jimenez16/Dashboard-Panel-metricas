# CasesByTypeChart

Gráfico de barras horizontal con casos por área SLA.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `data` | `TypeCount[]` | Array `{ tipo, cantidad }` |

## Ejemplo

```tsx
import CasesByTypeChart from '@/features/dashboard/components/CasesByTypeChart';

<CasesByTypeChart data={data.porTipo} />
```
