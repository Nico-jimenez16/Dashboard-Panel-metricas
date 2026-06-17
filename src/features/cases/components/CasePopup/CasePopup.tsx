'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useCase } from '@/features/cases/hooks/useCase';
import CaseBodyLayout from '@/features/cases/components/CaseBodyLayout';
import CasePopupHeader from './CasePopupHeader';

interface CasePopupProps {
  caseId: string;
  onClose: () => void;
}

export default function CasePopup({ caseId, onClose }: CasePopupProps) {
  const { data: caso, isLoading } = useCase(caseId);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label="Detalle del caso"
    >
      <div
        className="relative bg-[#FAFAF7] rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            Cargando caso...
          </div>
        )}

        {/* Content */}
        {caso && (
          <>
            <CasePopupHeader caso={caso} />
            <div className="overflow-y-auto p-6 flex-1">
              <CaseBodyLayout caso={caso} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
