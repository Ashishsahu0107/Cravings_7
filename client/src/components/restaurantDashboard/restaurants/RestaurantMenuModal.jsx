import React from "react";
import { MdClose, MdImage } from "react-icons/md";
import Select from "../../ui/Select";

const RestaurantMenuModal = ({
  isOpen,
  onClose,
  isEditMode,
  formData,
  setFormData,
  handleChange,
  handleImageChange,
  handleAddMenu,
  isSubmitting,
  fileInputRef,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-primary-content rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Edit Dish" : "Add New Dish"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-error-50"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleAddMenu} className="p-5">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side: Image Upload */}
            <div className="w-full md:w-1/3 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dish Image {isEditMode ? "" : "*"}
              </label>
              <div className="flex-1 mt-1 flex justify-center px-4 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors items-center min-h-[200px]">
                <div className="space-y-1 text-center w-full">
                  {formData.imagePreview ? (
                    <div className="relative inline-block w-full">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-48 rounded-lg object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            imageFile: null,
                            imagePreview: "",
                          }));
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-error-500 text-primary-content rounded-full p-1 shadow hover:bg-error-600 transition"
                      >
                        <MdClose size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <MdImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center mt-2">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            required={!isEditMode}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 2MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right side: Form Fields */}
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Margherita Pizza"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-primary-content text-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-primary-content text-black"
                    required
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Starters">Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Breads">Breads</option>
                    <option value="Soups">Soups</option>
                    <option value="Salads">Salads</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Type *
                  </label>
                  <Select
                    name="itemType"
                    value={formData.itemType || "Veg"}
                    onChange={handleChange}
                    className="w-full bg-primary-content text-black"
                    required
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Egg">Egg</option>
                    <option value="Vegan">Vegan</option>
                  </Select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-primary-content text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the ingredients and flavor..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none bg-primary-content text-black h-[116px]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3 justify-end border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-primary-content font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : isEditMode ? (
                "Update Dish"
              ) : (
                "Save Dish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantMenuModal;
