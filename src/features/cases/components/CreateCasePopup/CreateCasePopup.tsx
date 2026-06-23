'use client';

import { useState } from 'react';
import { Popup } from '@/components/ui';
import { CreateCaseForm } from '@/components/ui/forms/CreateCaseForm';
import { createCaseSchema } from '@/components/ui/forms/CreateCaseForm/CreateCaseForm.schema';
import type {
  CreateCaseFormData,
  CreateCaseFormErrors,
} from '@/components/ui/forms/CreateCaseForm';
import { useCreateCase } from '@/features/cases/hooks/useCreateCase';

const INITIAL_STATE: CreateCaseFormData = {
  titulo: '',
  usuario: '',
  sucursal_cid: null,
  gerencia: '',
  servicio: null,
  causa_raiz: null,
  nro_puesto: '',
  descripcion: '',
};

interface CreateCasePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCasePopup({ isOpen, onClose }: CreateCasePopupProps) {
  const [form, setForm] = useState<CreateCaseFormData>(INITIAL_STATE);
  const [errors, setErrors] = useState<CreateCaseFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateCase();

  const updateField = (field: keyof CreateCaseFormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    const parsed = createCaseSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const mapped: CreateCaseFormErrors = {};
      for (const key of Object.keys(fieldErrors) as (keyof CreateCaseFormData)[]) {
        const msgs = fieldErrors[key as keyof typeof fieldErrors];
        if (Array.isArray(msgs) && msgs[0]) mapped[key] = msgs[0];
      }
      setErrors(mapped);
      return;
    }
    setErrors({});
    setSubmitError(null);
    mutate(parsed.data, {
      onSuccess: () => {
        setForm(INITIAL_STATE);
        onClose();
      },
      onError: (err) => {
        setSubmitError(err instanceof Error ? err.message : 'Error al crear el caso');
      },
    });
  };

  const handleClose = () => {
    if (isPending) return;
    setForm(INITIAL_STATE);
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={isPending ? undefined : handleClose}
      title="Crear Caso Gestar"
      size="lg"
      primaryButtonLabel={isPending ? 'Creando...' : 'Crear Caso'}
      primaryButtonDisabled={isPending}
      onClickPrimary={handleSubmit}
      secondaryButtonLabel="Cancelar"
      secondaryButtonDisabled={isPending}
      onClickSecondary={handleClose}
    >
      {submitError && (
        <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}
      <CreateCaseForm
        value={form}
        onChange={updateField}
        errors={errors}
        disabled={isPending}
      />
    </Popup>
  );
}
