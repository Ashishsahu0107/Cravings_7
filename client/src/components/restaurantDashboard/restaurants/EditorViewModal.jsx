import React from "react";
import { MdClose, MdImage, MdStar } from "react-icons/md";

const EditorViewModal = ({ isOpen, onClose, viewItem }) => {
  if (!isOpen || !viewItem) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-base-100 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="relative bg-gray-100 flex items-center justify-center">
          {viewItem.image && viewItem.image.url ? (
            <img
              src={viewItem.image.url}
              alt={viewItem.itemName}
              className="w-full h-auto max-h-[60vh] object-contain"
            />
          ) : (
            <div className="w-full h-48 sm:h-56 flex items-center justify-center text-gray-400">
              <MdImage size={40} />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-primary-content bg-black/40 hover:bg-black/60 transition-colors p-1.5 rounded-full"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {viewItem.category}
                </div>
                {viewItem.itemType && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      viewItem.itemType === "Veg" ||
                      viewItem.itemType === "Vegan"
                        ? "bg-success/15 text-success"
                        : viewItem.itemType === "Egg"
                          ? "bg-warning/15 text-warning"
                          : "bg-error/15 text-error"
                    }`}
                  >
                    {viewItem.itemType}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                {viewItem.itemName}
              </h2>
            </div>
            <div className="text-xl font-bold text-primary">
              ₹{viewItem.price?.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-4 my-4 pb-4 border-b border-base-300">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold ${viewItem.isAvailable ? "bg-green-100 text-green-700" : "bg-error-100 text-red-700"}`}
            >
              {viewItem.isAvailable ? "Available" : "Unavailable"}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
              <MdStar />{" "}
              {viewItem.rating > 0
                ? viewItem.rating.toFixed(1)
                : "No ratings yet"}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Description
            </h4>
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
