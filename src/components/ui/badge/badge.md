# Badge

Etiqueta de estado/categoría con variantes de color.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'destructive' \| 'warning' \| 'success' \| 'info'` | Estilo visual |
| `className` | `string` | Clases adicionales |

## Ejemplo

```tsx
import { Badge } from '@/components/ui';

<Badge variant="success">Cerrado</Badge>
<Badge variant="warning">Devuelto al Usuario</Badge>
```
