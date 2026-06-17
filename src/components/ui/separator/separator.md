# Separator

Línea divisoria horizontal o vertical.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Dirección |
| `color` | `COLOR` | `COLOR.GRIS_BORDE` | Color de la línea |
| `thickness` | `string` | `'1px'` | Grosor |

## Ejemplo

```tsx
import { Separator } from '@/components/ui';

<Separator />
<Separator orientation="vertical" thickness="2px" />
```
