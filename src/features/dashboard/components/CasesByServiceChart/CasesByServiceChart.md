# CasesByServiceChart

Gráfico de barras horizontal con casos agrupados por servicio.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `data` | `TypeCount[]` | Array `{ tipo, cantidad }` |

## Ejemplo

```tsx
import { CasesByServiceChart } from '@/features/dashboard/components';

<CasesByServiceChart data={data.porServicio} />
```
