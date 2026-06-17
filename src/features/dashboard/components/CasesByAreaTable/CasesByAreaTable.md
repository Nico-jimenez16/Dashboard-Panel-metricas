# CasesByAreaTable

Tabla de casos agrupados por área SLA con tasa de cierre.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `data` | `AreaStats[]` | Estadísticas por área |

## Ejemplo

```tsx
import CasesByAreaTable from '@/features/dashboard/components/CasesByAreaTable';

<CasesByAreaTable data={data.porArea} />
```
