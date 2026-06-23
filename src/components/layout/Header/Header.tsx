import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onCreateCase?: () => void;
}

export default function Header({ title, subtitle, actions, onCreateCase }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <Button size="sm" onClick={onCreateCase}>
          <Plus className="h-3.5 w-3.5" />
          Crear Caso Gestar
        </Button>
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-500">
          <RefreshCw className="h-3 w-3" />
          <span>Datos en tiempo real</span>
        </div>
      </div>
    </header>
  );
}
