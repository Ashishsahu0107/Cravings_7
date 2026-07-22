import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineAddAPhoto, MdSave } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../../assets/loadingAnimation.gif";

const RestaurantPhotos = () => {
  const { user } = useAuth();
  const MAX_FILE_SIZE = 1024 * 1024 * 3; // 3MB
  const MAX_GALLERY_IMAGES = 8;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [existingCover, setExistingCover] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  
  const [existingGallery, setExistingGallery] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [errors, setErrors] = useState({ cover: "", gallery: "" });

  const fetchRestaurantData = async () => {
    try {
      setIsFetching(true);
      const res = await api.get(`/restaurant/get-restaurant-data`, {
        params: { id: user._id },
      });
      const data = res.data.data;
      if (data) {
        setExistingCover(data.coverImage || null);
        setExistingGallery(data.restaurantImage || []);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch restaurant photos");
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [user]);

  const coverPreview = useMemo(() => {
    return coverImage ? URL.createObjectURL(coverImage) : existingCover ? existingCover.url : ""; 
  }, [coverImage, existingCover]);

  const galleryPreviews = useMemo(() => {
    const existing = existingGallery.map((img) => ({
      file: null,
      url: img.url,
      publicId: img.publicId,
      name: "Existing Image",
      key: img.publicId,
      size: null,
    }));
    
    const newFiles = galleryImages.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
      publicId: null,
      name: image.name,
      key: `${image.name}-${image.lastModified}`,
      size: image.size,
    }));

    return [...existing, ...newFiles];
  }, [existingGallery, galleryImages]);

  useEffect(() => {
    return () => {
      if (coverImage && coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverImage, coverPreview]);

  useEffect(() => {
    return () => {
      galleryPreviews.forEach((imagePreview) => {
        if (imagePreview.file) {
          URL.revokeObjectURL(imagePreview.url);
        }
      });
    };
  }, [galleryPreviews]);

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverImage(null);
      setErrors((prev) => ({ ...prev, cover: "" }));
      return;
    }

    if (file.size >= MAX_FILE_SIZE) {
      setCoverImage(null);
      setErrors((prev) => ({
        ...prev,
        cover: "Cover image must be less than 3MB.",
      }));
      event.target.value = "";
      return;
    }

    setCoverImage(file);
    setErrors((prev) => ({ ...prev, cover: "" }));
  };

  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    const oversizedFiles = files.filter((file) => file.size >= MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        gallery: "Each restaurant image must be less than 3MB.",
      }));
      event.target.value = "";
      return;
    }

    setGalleryImages((prevImages) => {
      const merged = [...prevImages, ...files];
      if (merged.length + existingGallery.length > MAX_GALLERY_IMAGES) {
        setErrors((prev) => ({
          ...prev,
          gallery: `You can upload up to ${MAX_GALLERY_IMAGES} restaurant images total.`,
        }));
        return merged.slice(0, MAX_GALLERY_IMAGES - existingGallery.length);
      }

      setErrors((prev) => ({ ...prev, gallery: "" }));
      return merged;
    });

    event.target.value = "";
  };

  const removeGalleryImage = (indexToRemove) => {
    const previewToRemove = galleryPreviews[indexToRemove];
    if (previewToRemove.file) {
      setGalleryImages((prev) => prev.filter((f) => f !== previewToRemove.file));
    } else {
      setExistingGallery((prev) => prev.filter((img) => img.publicId !== previewToRemove.publicId));
    }
    setErrors((prev) => ({ ...prev, gallery: "" }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      if (coverImage) {
        formData.append("coverImage", coverImage);
      } else if (!existingCover) {
        formData.append("removeCoverImage", "true");
      }
      
      if (galleryImages.length > 0) {
        galleryImages.forEach((file) => {
          formData.append("galleryImages", file);
        });
      }

      formData.append("retainedGalleryImages", JSON.stringify(existingGallery));

      const res = await api.put("/restaurant/update-restaurant-photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Photos updated successfully");
      const updatedData = res.data.data;
      setExistingCover(updatedData.coverImage || null);
      setExistingGallery(updatedData.restaurantImage || []);
      setCoverImage(null);
      setGalleryImages([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update photos");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center h-40">
        <img src={RunningLoader} alt="Loading..." className="w-20 h-20" />
        <span className="text-sm text-(--color-primary) font-semibold mt-2 animate-bounce">
          Fetching Photos
        </span>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex justify-end mb-3">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-4 py-2 rounded-md text-sm font-semibold shadow-sm hover:opacity-95 transition disabled:opacity-70"
        >
          <MdSave className="text-lg" />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-3 items-start">
        <div className="bg-(--color-base-100) rounded-xl border border-(--color-secondary)/40 shadow-sm p-4 h-full">
          <div className="flex items-center justify-between border-b border-(--color-secondary) pb-2 mb-3">
            <div className="">
              <h3 className="text-sm font-semibold text-(--color-primary)">
                Cover Image
              </h3>
              <p className="text-xs text-(--color-secondary)">
                Upload one hero image under 3MB.
              </p>
            </div>
            <div className="text-[11px] px-2 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">
              1 file
            </div>
          </div>

          <div className="space-y-3">
            {coverPreview ? (
              <div className="overflow-hidden rounded-xl border border-(--color-secondary) bg-white shadow-sm">
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover Preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setExistingCover(null);
                    }}
                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-(--color-error) shadow-sm ring-1 ring-(--color-error)/20 transition hover:bg-(--color-error) hover:text-(--color-error-content)"
                    aria-label="Remove Cover Image"
                  >
                    <IoMdClose className="text-lg" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                  <p className="truncate font-medium">{coverImage ? coverImage.name : "Existing Image"}</p>
                  {coverImage && (
                    <span className="shrink-0 rounded-full bg-(--color-secondary)/20 px-2 py-1 text-[11px]">
                      {(coverImage.size / 1024).toFixed(1)} KB
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-(--color-secondary) bg-linear-to-br from-white to-(--color-base-100) px-4 py-8 text-center">
                <label
                  htmlFor="coverImage"
                  className="inline-flex items-center gap-2 bg-(--color-primary) text-(--color-primary-content) px-3 py-1.5 rounded-md text-xs cursor-pointer shadow-sm hover:opacity-95 transition"
                >
                  <MdOutlineAddAPhoto className="text-2xl" />
                </label>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />

                <p className="text-sm font-semibold text-(--color-primary)">
                  No cover selected
                </p>
                <p className="mt-1 text-xs text-(--color-secondary-content)">
                  Add a clean hero image to make this restaurant stand out.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-(--color-base-100) rounded-xl border border-(--color-secondary)/40 shadow-sm p-4 h-full">
          <div className="flex items-start justify-between gap-3 border-b border-(--color-secondary) mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-(--color-primary)">
                  Other Restaurant Images
                </h3>
                <span className="text-[11px] px-2 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-medium">
                  {galleryPreviews.length}/{MAX_GALLERY_IMAGES}
                </span>
              </div>
              <p className="text-xs text-(--color-secondary-content) mt-0.5">
                Upload up to {MAX_GALLERY_IMAGES} images, each less than 3MB.
              </p>
            </div>

            <div className="shrink-0">
              <label
                htmlFor="galleryImages"
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs shadow-sm transition ${galleryPreviews.length >= MAX_GALLERY_IMAGES ? "bg-(--color-secondary) text-(--color-secondary-content) cursor-not-allowed" : "bg-(--color-primary) text-(--color-primary-content) cursor-pointer hover:opacity-95"}`}
              >
                <MdOutlineAddAPhoto className="text-sm" />
                Upload Restaurant Images
              </label>
              <input
                id="galleryImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                disabled={galleryPreviews.length >= MAX_GALLERY_IMAGES}
                className="hidden"
              />
            </div>
          </div>

          {errors.gallery && (
            <div className="mb-3 rounded-lg border border-(--color-error)/30 bg-(--color-error)/5 px-3 py-2">
              <p className="text-xs text-(--color-error)">{errors.gallery}</p>
            </div>
          )}

          {galleryPreviews.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {galleryPreviews.map((imagePreview, index) => (
                <div
                  key={imagePreview.key}
                  className="group overflow-hidden rounded-xl border border-(--color-secondary) bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative">
                    <img
                      src={imagePreview.url}
                      alt={`Restaurant ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-(--color-error) shadow-sm ring-1 ring-(--color-error)/20 transition hover:bg-(--color-error) hover:text-(--color-error-content)"
                      aria-label={`Remove ${imagePreview.name}`}
                    >
                      <IoMdClose className="text-lg" />
                    </button>
                  </div>

                  <div className="px-3 py-2">
                    <p className="truncate text-xs font-medium text-(--color-primary)">
                      {imagePreview.name}
                    </p>
                    {imagePreview.size && (
                      <p className="mt-0.5 text-[11px] text-(--color-secondary-content)">
                        {(imagePreview.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-(--color-secondary) bg-linear-to-br from-white to-(--color-base-100) px-4 py-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary)/10 text-(--color-primary)">
                <MdOutlineAddAPhoto className="text-2xl" />
              </div>
              <p className="text-sm font-semibold text-(--color-primary)">
                No restaurant images yet
              </p>
              <p className="mt-1 text-xs text-(--color-secondary-content)">
                Add up to 10 supporting photos to show the dining space, food,
                and kitchen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantPhotos;
