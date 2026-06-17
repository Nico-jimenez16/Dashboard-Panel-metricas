# Text

Componente de texto polimórfico con tokens de tipografía.

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `as` | `ElementType` | `'p'` | Elemento HTML a renderizar |
| `fontSize` | `FONT_SIZE` | `FONT_SIZE.MD` | Tamaño de fuente |
| `fontWeight` | `FONT_WEIGHT` | `FONT_WEIGHT.REGULAR` | Peso de fuente |

## Ejemplo

```tsx
import { Text } from '@/components/ui/text';
import { FONT_SIZE, FONT_WEIGHT } from '@/components/ui/fontTokens';

<Text as="h2" fontSize={FONT_SIZE.LG} fontWeight={FONT_WEIGHT.BOLD}>Título</Text>
```
