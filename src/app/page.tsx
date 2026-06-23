import { env } from '@/server/env';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="flex w-full flex-col justify-center gap-4 bg-[#0F4C3A] px-10 py-12 text-white md:w-2/5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
          <span className="text-sm font-bold text-[#0F4C3A]">M</span>
        </div>
        <div>
          <p className="text-xl font-semibold">Microinformática</p>
          <p className="text-sm text-white/70">Banco de Córdoba</p>
        </div>
        <p className="max-w-sm text-sm text-white/80">
          Accedé a la gestión de incidentes IT. Seguimiento, estados y casos centralizados.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <LoginForm defaultLoginName={env.LOGIN_NAME} defaultPassword={env.PASSWORD} />
      </div>
    </div>
  );
}
