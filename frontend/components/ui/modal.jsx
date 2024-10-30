'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

export function Modal({ isOpen, onClose, children }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white rounded-md transform -translate-x-1/2 -translate-y-1/2">
          {children}
          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ModalHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function ModalBody({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className="flex justify-end space-x-2">{children}</div>;
}
