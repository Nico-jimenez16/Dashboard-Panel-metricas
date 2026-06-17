# MonthlyTrendChart

Gráfico de líneas con tendencia mensual de casos recibidos vs cerrados.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `data` | `MonthlyData[]` | Array `{ mes, recibidos, cerrados }` |

## Ejemplo

```tsx
import { MonthlyTrendChart } from '@/features/dashboard/components';

<MonthlyTrendChart data={data.tendenciaMensual} />
```
