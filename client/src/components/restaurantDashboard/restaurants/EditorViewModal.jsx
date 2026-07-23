import React from 'react';
import { MdClose, MdImage, MdStar } from "react-icons/md";

const EditorViewModal = ({ isOpen, onClose, viewItem }) => {
  if (!isOpen || !viewItem) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-(--color-base-100) rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative h-48 sm:h-56 bg-gray-100">
          {viewItem.image && viewItem.image.url ? (
            <img src={viewItem.image.url} alt={viewItem.itemName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <MdImage size={40} />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/60 transition-colors p-1.5 rounded-full"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-xs font-semibold text-(--color-primary) uppercase tracking-wider mb-1">
                {viewItem.category}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                {viewItem.itemName}
              </h2>
            </div>
            <div className="text-xl font-bold text-(--color-primary)">
              ${viewItem.price?.toFixed(2)}
            </div>
          </div>
          
          <div className="flex items-center gap-4 my-4 pb-4 border-b border-gray-100">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${viewItem.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {viewItem.isAvailable ? 'Available' : 'Unavailable'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
              <MdStar /> {viewItem.rating > 0 ? viewItem.rating.toFixed(1) : "No ratings yet"}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {viewItem.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorViewModal;
