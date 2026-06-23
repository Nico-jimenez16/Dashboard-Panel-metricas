'use client';

import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { Input, Button, FormField } from '@/components/ui';
import { useLogin } from '@/features/auth/hooks/useLogin';

interface LoginFormProps {
  defaultLoginName?: string;
  defaultPassword?: string;
}

interface LoginFields {
  loginName: string;
  password: string;
}

interface LoginErrors {
  loginName?: string;
  password?: string;
}

export default function LoginForm({ defaultLoginName = '', defaultPassword = '' }: LoginFormProps) {
  const { mutate: login, isPending, isError } = useLogin();
  const [form, setForm] = useState<LoginFields>({ loginName: defaultLoginName, password: defaultPassword });
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: LoginErrors = {};
    if (!form.loginName) nextErrors.loginName = 'Ingresá tu usuario.';
    if (!form.password) nextErrors.password = 'Ingresá tu contraseña.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    login({ loginName: form.loginName, password: form.password });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <h1 className="text-2xl font-semibold text-gray-900">Bienvenido de nuevo</h1>

      <FormField htmlFor="loginName" error={errors.loginName}>
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="loginName"
            type="text"
            placeholder="Usuario"
            className="pl-9"
            value={form.loginName}
            onChange={(e) => setForm({ ...form, loginName: e.target.value })}
            aria-invalid={!!errors.loginName}
          />
        </div>
      </FormField>

      <FormField
        htmlFor="password"
        error={errors.password ?? (isError ? 'Usuario o contraseña incorrectos.' : undefined)}
      >
        <div className="relative">
          <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Contraseña"
            className="pl-9"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            aria-invalid={!!errors.password}
          />
        </div>
      </FormField>

      <Button type="submit" variant="default" className="w-full" disabled={isPending}>
        {isPending ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  );
}
