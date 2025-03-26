import React from 'react';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import clsx from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

// Alert type definition
export type AlertType = 'info' | 'error' | 'warning' | 'success';

// Alert props interface
export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: AlertType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

// Alert Dialog Component that receives props
export const AlertDialogComponent: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type,
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false,
}) => {
  const handleConfirm = () => {
    onClose();
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    onClose();
    if (onCancel) {
      onCancel();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Info size={24} />;
      case 'error':
        return <AlertCircle size={24} />;
      case 'warning':
        return <AlertTriangle size={24} />;
      case 'success':
        return <CheckCircle size={24} />;
      default:
        return <Info size={24} />;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'info':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-500';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'info':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-amber-500';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  return (
    <RadixAlertDialog.Root open={isOpen} onOpenChange={onClose}>
      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay className="bg-black/50 fixed inset-0 transition-opacity duration-150" />
        <RadixAlertDialog.Content
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md 
          bg-white rounded-lg shadow-xl p-6 transition-all duration-150"
          onEscapeKeyDown={onClose}
        >
          {/* 将图标和标题放在一起显示 */}
          <div className="flex items-center mb-4">
            <span className={getIconColor()}>{getIcon()}</span>
            <RadixAlertDialog.Title
              className={clsx('text-lg font-medium ml-2', getTitleColor())}
            >
              {title}
            </RadixAlertDialog.Title>
          </div>

          <RadixAlertDialog.Description className="text-gray-600 mb-6">
            {message}
          </RadixAlertDialog.Description>

          <div className="flex justify-end gap-3">
            {showCancel && (
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium text-sm"
                onClick={handleCancel}
              >
                {cancelText}
              </button>
            )}
            <button
              className={clsx(
                'px-4 py-2 rounded font-medium text-sm',
                getButtonClass()
              )}
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  );
};

// Export the component that can be used in other files
export default AlertDialogComponent;
