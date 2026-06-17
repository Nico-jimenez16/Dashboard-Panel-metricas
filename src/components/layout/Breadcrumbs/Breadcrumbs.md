# Breadcrumbs

Navegación jerárquica con separadores.

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `crumbs` | `Crumb[]` | Array de `{ label, href? }` |

## Ejemplo

```tsx
import Breadcrumbs from '@/components/layout/Breadcrumbs';

<Breadcrumbs crumbs={[{ label: 'Casos', href: '/casos' }, { label: '#12345' }]} />
```
