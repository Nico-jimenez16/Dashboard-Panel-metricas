# KPICards

Grid de tarjetas con métricas principales del dashboard.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `metrics` | `DashboardMetrics` | Objeto con totales por estado |

## Ejemplo

```tsx
import { KPICards } from '@/features/dashboard/components';

<KPICards metrics={data} />
```
