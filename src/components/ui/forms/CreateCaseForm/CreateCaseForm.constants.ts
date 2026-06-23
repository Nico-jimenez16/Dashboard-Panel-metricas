import type { SucursalCid, ServicioOption, CausaRaiz } from './CreateCaseForm.types';

export const SUCURSAL_OPTIONS: SucursalCid[] = [
  { cid: 265, descripcion: 'Sucursal 265 - Casa Matriz' },
  { cid: 1, descripcion: 'Sucursal 1 - Centro' },
  { cid: 2, descripcion: 'Sucursal 2 - Norte' },
  { cid: 3, descripcion: 'Sucursal 3 - Sur' },
];

export const SERVICIO_OPTIONS: ServicioOption[] = [
  { code: 1, label: 'Puesto PC/Notebook/CCTV' },
  { code: 2, label: 'Impresoras/Escáneres' },
  { code: 3, label: 'Telefonía' },
  { code: 4, label: 'Conectividad/Red' },
  { code: 5, label: 'Software/Aplicaciones' },
];

export const CAUSA_RAIZ_OPTIONS: CausaRaiz[] = [
  { id: 1, label: 'Falla de Hardware', path: ['Gestión del puesto', 'Falla de Hardware'] },
  { id: 2, label: 'Falla de Software', path: ['Gestión del puesto', 'Falla de Software'] },
  {
    id: 3,
    label: 'Instalación/Configuración de Software',
    path: ['Gestión del puesto', 'Instalación/Configuración de Software'],
  },
  { id: 4, label: 'Conectividad', path: ['Infraestructura', 'Conectividad'] },
  { id: 5, label: 'Accesos y Permisos', path: ['Seguridad', 'Accesos y Permisos'] },
];

export const GERENCIA_OPTIONS: string[] = [
  'Tecnología',
  'Operaciones',
  'Riesgos',
  'Comercial',
  'Recursos Humanos',
  'Finanzas',
  'Auditoría',
  'Compliance',
];
