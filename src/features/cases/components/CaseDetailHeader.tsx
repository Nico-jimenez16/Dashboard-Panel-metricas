import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/formatters';
import type { Case, CasePriority, CaseStatus } from '@/types/domain';

const STATUS_VARIANT: Record<CaseStatus, 'info' | 'warning' | 'success' | 'secondary'> = {
  atendido:              'info',
  cerrado:               'success',
  derivado:              'secondary',
  'derivado a proveedor': 'secondary',
  'devuelto al usuario': 'warning',
  suspendido:            'secondary',
};
const STATUS_LABEL: Record<CaseStatus, string> = {
  atendido:              'Atendido',
  cerrado:               'Cerrado',
  derivado:              'Derivado',
  'derivado a proveedor': 'Derivado a Proveedor',
  'devuelto al usuario': 'Devuelto al Usuario',
  suspendido:            'Suspendido',
};
const PRIORITY_VARIANT: Record<CasePriority, 'destructive' | 'warning' | 'secondary' | 'outline'> = {
  critica: 'destructive', alta: 'warning', media: 'secondary', baja: 'outline',
};
const PRIORITY_LABEL: Record<CasePriority, string> = {
  critica: 'Crítica', alta: 'Alta', media: 'Media', baja: 'Baja',
};

interface CaseDetailHeaderProps {
  caso: Case;
}

export default function CaseDetailHeader({ caso }: CaseDetailHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-5">
      <div className="mb-3">
        <Link href="/casos">
          <Button variant="ghost" size="sm" className="-ml-2">
            <ChevronLeft className="h-4 w-4" />
            Volver a casos
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-gray-400">{caso.numero}</span>
            <Badge variant={STATUS_VARIANT[caso.estado]}>{STATUS_LABEL[caso.estado]}</Badge>
            <Badge variant={PRIORITY_VARIANT[caso.prioridad]}>{PRIORITY_LABEL[caso.prioridad]}</Badge>
            {caso.slaVencido && <Badge variant="destructive">SLA Vencido</Badge>}
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{caso.titulo}</h1>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-400">Área</p>
          <p className="font-medium text-gray-900">{caso.area}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Asignado a</p>
          <p className="font-medium text-gray-900">{caso.asignadoA}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Creado</p>
          <p className="font-medium text-gray-900">{formatDateTime(caso.creadoEn)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">SLA</p>
          <p className={`font-medium ${caso.slaVencido ? 'text-[#C53030]' : 'text-gray-900'}`}>
            {formatDateTime(caso.slaFecha)}
          </p>
        </div>
      </div>
    </div>
  );
}
