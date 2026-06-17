# StatusDonutChart

Gráfico de dona con distribución de casos por estado.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `data` | `StatusCount[]` | Array `{ estado, cantidad }` |
| `total` | `number` | Total de casos (se muestra en el centro) |

## Ejemplo

```tsx
import { StatusDonutChart } from '@/features/dashboard/components';

<StatusDonutChart data={data.porEstado} total={data.totalCasos} />
```
