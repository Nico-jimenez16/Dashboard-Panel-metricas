'use client';

import { Popup } from '@/components/ui';
import { useCase } from '@/features/cases/hooks/useCase';
import CaseBodyLayout from '@/features/cases/components/CaseBodyLayout';
import { CaseHeader } from '@/features/cases/components/CaseHeader';

interface CasePopupProps {
  caseId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CasePopup({ caseId, isOpen, onClose }: CasePopupProps) {
  const { data: caso, isLoading } = useCase(caseId ?? '');

  return (
    <Popup isOpen={isOpen} onClose={onClose} size="xl" className="bg-[#FAFAF7]">
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-sm text-gray-400">
          Cargando caso...
        </div>
      )}
      {caso && (
        <>
          <CaseHeader caso={caso} variant="popup" />
          <div className="p-6">
            <CaseBodyLayout caso={caso} />
          </div>
        </>
      )}
    </Popup>
  );
}
