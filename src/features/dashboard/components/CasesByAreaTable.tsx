import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AreaStats } from '@/types/domain';

interface CasesByAreaTableProps {
  data: AreaStats[];
}

export default function CasesByAreaTable({ data }: CasesByAreaTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos por Área</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Cerrados
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tasa cierre
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row) => (
                <tr key={row.area} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{row.area}</td>
                  <td className="px-6 py-3 text-right text-gray-600">{row.total}</td>
                  <td className="px-6 py-3 text-right text-gray-600">{row.cerrados}</td>
                  <td className="px-6 py-3 text-right">
                    <Badge
                      variant={
                        row.tasaCierre >= 70
                          ? 'success'
                          : row.tasaCierre >= 40
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {row.tasaCierre}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
