# Button

Botón con variantes de estilo y tamaño.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `variant` | `'default' \| 'outline' \| 'ghost' \| 'link' \| 'destructive' \| 'success'` | Estilo visual |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | Tamaño |

## Ejemplo

```tsx
import { Button } from '@/components/ui';

<Button variant="outline" size="sm">Anterior</Button>
<Button variant="success">Cerrar caso</Button>
```
