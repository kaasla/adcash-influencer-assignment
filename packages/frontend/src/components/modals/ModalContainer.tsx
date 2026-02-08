import type { ReactNode } from 'react';

type ModalContainerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidthClass?: string;
};

export const ModalContainer = ({ open, onClose, children, maxWidthClass = 'sm:max-w-lg' }: ModalContainerProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div
          className={[
            'relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full',
            maxWidthClass,
          ].join(' ')}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
