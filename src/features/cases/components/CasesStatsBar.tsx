interface CasesStatsBarProps {
  total: number;
  showing: number;
}

export default function CasesStatsBar({ total, showing }: CasesStatsBarProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <span>
        Mostrando <span className="font-medium text-gray-900">{showing}</span> de{' '}
        <span className="font-medium text-gray-900">{total}</span> casos
      </span>
    </div>
  );
}
