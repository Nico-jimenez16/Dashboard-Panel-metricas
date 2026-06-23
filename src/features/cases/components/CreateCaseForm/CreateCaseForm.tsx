'use client';

import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/select/select';
import { Textarea } from '@/components/ui/textarea/textarea';
import { FormField } from '@/components/ui/formField/formField';
import type { CreateCaseFormProps } from './CreateCaseForm.types';
import {
  SUCURSAL_OPTIONS,
  SERVICIO_OPTIONS,
  CAUSA_RAIZ_OPTIONS,
  GERENCIA_OPTIONS,
} from './CreateCaseForm.constants';

export function CreateCaseForm({ value, onChange, errors, disabled }: CreateCaseFormProps) {
  return (
    <div className="px-6 py-5 space-y-4">
      <FormField htmlFor="titulo" label="Título" required error={errors?.titulo}>
        <Input
          id="titulo"
          value={value.titulo}
          onChange={(e) => onChange('titulo', e.target.value)}
          disabled={disabled}
          placeholder="Descripción breve del problema"
          aria-invalid={!!errors?.titulo}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField htmlFor="usuario" label="Usuario" required error={errors?.usuario}>
          <Input
            id="usuario"
            value={value.usuario}
            onChange={(e) => onChange('usuario', e.target.value)}
            disabled={disabled}
            placeholder="ej. u901936"
            aria-invalid={!!errors?.usuario}
          />
        </FormField>
        <FormField htmlFor="gerencia" label="Gerencia" required error={errors?.gerencia}>
          <Select
            id="gerencia"
            value={value.gerencia}
            onChange={(e) => onChange('gerencia', e.target.value)}
            disabled={disabled}
            placeholder="Seleccionar gerencia"
            options={GERENCIA_OPTIONS.map((g) => ({ value: g, label: g }))}
            error={!!errors?.gerencia}
          />
        </FormField>
      </div>

      <FormField htmlFor="sucursal_cid" label="Sucursal" required error={errors?.sucursal_cid}>
        <Select
          id="sucursal_cid"
          value={value.sucursal_cid?.cid ?? ''}
          onChange={(e) => {
            const found = SUCURSAL_OPTIONS.find((o) => o.cid === Number(e.target.value));
            onChange('sucursal_cid', found ?? null);
          }}
          disabled={disabled}
          placeholder="Seleccionar sucursal"
          options={SUCURSAL_OPTIONS.map((s) => ({ value: s.cid, label: s.descripcion }))}
          error={!!errors?.sucursal_cid}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField htmlFor="nro_puesto" label="Nro. Puesto" required error={errors?.nro_puesto}>
          <Input
            id="nro_puesto"
            value={value.nro_puesto}
            onChange={(e) => onChange('nro_puesto', e.target.value)}
            disabled={disabled}
            placeholder="ej. NO591008"
            aria-invalid={!!errors?.nro_puesto}
          />
        </FormField>
        <FormField htmlFor="servicio" label="Servicio" required error={errors?.servicio}>
          <Select
            id="servicio"
            value={value.servicio?.code ?? ''}
            onChange={(e) => {
              const found = SERVICIO_OPTIONS.find((o) => o.code === Number(e.target.value));
              onChange('servicio', found ?? null);
            }}
            disabled={disabled}
            placeholder="Seleccionar servicio"
            options={SERVICIO_OPTIONS.map((s) => ({ value: s.code, label: s.label }))}
            error={!!errors?.servicio}
          />
        </FormField>
      </div>

      <FormField htmlFor="causa_raiz" label="Causa Raíz" required error={errors?.causa_raiz}>
        <Select
          id="causa_raiz"
          value={value.causa_raiz?.id ?? ''}
          onChange={(e) => {
            const found = CAUSA_RAIZ_OPTIONS.find((o) => o.id === Number(e.target.value));
            onChange('causa_raiz', found ?? null);
          }}
          disabled={disabled}
          placeholder="Seleccionar causa raíz"
          options={CAUSA_RAIZ_OPTIONS.map((c) => ({ value: c.id, label: c.label }))}
          error={!!errors?.causa_raiz}
        />
      </FormField>

      <FormField htmlFor="descripcion" label="Descripción" required error={errors?.descripcion}>
        <Textarea
          id="descripcion"
          value={value.descripcion}
          onChange={(e) => onChange('descripcion', e.target.value)}
          disabled={disabled}
          placeholder="Describe el problema en detalle..."
          rows={4}
          error={!!errors?.descripcion}
        />
      </FormField>
    </div>
  );
}
