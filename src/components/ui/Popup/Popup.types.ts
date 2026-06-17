import type { ReactNode } from 'react';

export interface PopupProps {
  isOpen: boolean;
  /** Clases extra para el panel (section) */
  className?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  onClickPrimary?: () => void;
  onClickSecondary?: () => void;
  /** Muestra el botón X y cierra al hacer clic fuera o presionar Escape */
  onClose?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
