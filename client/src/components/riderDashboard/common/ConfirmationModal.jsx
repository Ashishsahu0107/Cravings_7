import React from "react";
import { MdClose } from "react-icons/md";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-base-100 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-base-200">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-base-200 rounded-md">
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-base-content/80">{message}</p>
        </div>
        <div className="p-4 border-t border-base-200 flex justify-end gap-3 bg-base-200/30">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium hover:bg-base-300 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
              isDestructive ? "bg-error hover:bg-error/90" : "bg-primary hover:bg-primary/90"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
