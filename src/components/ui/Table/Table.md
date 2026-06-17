# Table

Componente genérico de tabla con sorting, estado de carga y mensaje vacío. Usa `@tanstack/react-table` internamente.

## Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `data` | `T[]` | ✓ | Array de datos a mostrar |
| `columns` | `ColumnDef<T, unknown>[]` | ✓ | Definición de columnas (usar `createColumnHelper`) |
| `getRowId` | `(row: T) => string` | — | Función para obtener ID único de fila |
| `emptyMessage` | `string` | — | Mensaje cuando no hay filas (default: "No hay datos.") |
| `loading` | `boolean` | — | Muestra spinner en lugar de la tabla |
| `onRowClick` | `(row: T) => void` | — | Callback al hacer click en una fila |

## Ejemplo

```tsx
import { Table } from '@/components/ui/Table';
import { createColumnHelper } from '@tanstack/react-table';

const col = createColumnHelper<MyType>();
const columns = [
  col.accessor('name', { header: 'Nombre' }),
];

<Table
  data={items}
  columns={columns}
  getRowId={(row) => String(row.id)}
  emptyMessage="Sin resultados."
  loading={isLoading}
/>
```
