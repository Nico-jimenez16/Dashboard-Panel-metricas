export interface SucursalCid {
  cid: number;
  descripcion: string;
}

export interface ServicioOption {
  code: number;
  label: string;
}

export interface CausaRaiz {
  id: number;
  label: string;
  path: string[];
}

export interface CreateCaseFormData {
  titulo: string;
  usuario: string;
  sucursal_cid: SucursalCid | null;
  gerencia: string;
  servicio: ServicioOption | null;
  causa_raiz: CausaRaiz | null;
  nro_puesto: string;
  descripcion: string;
}

export type CreateCaseFormErrors = Partial<Record<keyof CreateCaseFormData, string>>;

export interface CreateCaseFormProps {
  value: CreateCaseFormData;
  onChange: (field: keyof CreateCaseFormData, value: unknown) => void;
  errors?: CreateCaseFormErrors;
  disabled?: boolean;
}
