# Tabs

Sistema de pestañas con contexto interno.

## Componentes

- `Tabs` — contenedor raíz, recibe `value` y `onValueChange`
- `TabsList` — barra de pestañas
- `TabsTrigger` — botón de pestaña, recibe `value`
- `TabsContent` — panel de contenido, recibe `value`

## Ejemplo

```tsx
import { Tabs, TabsList, TabsTrigger } from '@/components/ui';

<Tabs value={view} onValueChange={setView}>
  <TabsList>
    <TabsTrigger value="todos">Todos</TabsTrigger>
    <TabsTrigger value="Atendido">Atendidos</TabsTrigger>
  </TabsList>
</Tabs>
```
