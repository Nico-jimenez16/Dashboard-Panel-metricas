# FormField

Envoltorio genérico para campos de formulario: `Label` + control + mensaje de error. Encapsula el patrón repetido en los formularios del proyecto (ver `CreateCaseForm`).

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `label` | `ReactNode` | — | Texto del label. Si no se pasa, no se renderiza `Label` |
| `htmlFor` | `string` | — | Id del control asociado al label |
| `required` | `boolean` | — | Muestra el asterisco de campo obligatorio |
| `error` | `string` | — | Mensaje de error a mostrar debajo del control |
| `className` | `string` | — | Clases extra para el contenedor |
| `children` | `ReactNode` | ✓ | El control del campo (`Input`, `Select`, `Textarea`, etc.) |

## Ejemplo

```tsx
import { FormField, Input } from '@/components/ui';

<FormField htmlFor="titulo" label="Título" required error={errors.titulo}>
  <Input
    id="titulo"
    value={value.titulo}
    onChange={(e) => onChange('titulo', e.target.value)}
    aria-invalid={!!errors.titulo}
  />
</FormField>
```
