import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../config/ApiConfig";
import toast from "react-hot-toast";
import RunningLoader from "../../../../assets/loadingAnimation.gif";

const SocialMedia = () => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [loadingRestaurantError, setLoadingRestaurantError] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);
  const [editingSocial, setEditingSocial] = useState(false);

  const [socialMediaLinks, setSocialMediaLinks] = useState([]);

  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);
      const res = await api.get(`/restaurant/get-restaurant-data`, {
        params: { id: user._id },
      });
      setRestaurantData(res.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setRestaurantData(null);
      } else {
        setLoadingRestaurantError(
          error.response?.data?.message ||
            "Unknown error occurred fetching restaurant. Please try again.",
        );
      }
    } finally {
      setIsLoadingRestaurant(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [user]);

  useEffect(() => {
    if (restaurantData) {
      setSocialMediaLinks(restaurantData.socialMediaLinks || []);
    }
  }, [restaurantData]);

  const handleSocialMediaChange = (index, field, value) => {
    const updated = socialMediaLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    );
    setSocialMediaLinks(updated);
  };

  const addSocialMediaLink = () => {
    setSocialMediaLinks([...socialMediaLinks, { platform: "", url: "" }]);
  };

  const removeSocialMediaLink = (index) => {
    setSocialMediaLinks(socialMediaLinks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const payload = {
        socialMediaLinks: JSON.stringify(socialMediaLinks),
      };
      const res = await api.put("/restaurant/update-core-details", payload);
      toast.success(
        res.data.message || "Social media links updated successfully",
      );
      setRestaurantData(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update social media links",
      );
    } finally {
      setIsLoading(false);
      setEditingSocial(false);
    }
  };

  const handleCancel = () => {
    if (restaurantData) {
      setSocialMediaLinks(restaurantData.socialMediaLinks || []);
    }
    setEditingSocial(false);
  };

  return (
    <>
      {isLoadingRestaurant ? (
        <div className="flex flex-col justify-center items-center h-40">
          <img src={RunningLoader} alt="Loading..." className="w-20 h-20" />
          <span className="text-sm text-(--color-primary) font-semibold mt-2 animate-bounce">
            Fetching Social Media
          </span>
        </div>
      ) : loadingRestaurantError ? (
        <div className="flex flex-col justify-center items-center h-40">
          <span className="text-sm text-(--color-error) font-semibold mt-2">
            {loadingRestaurantError}
          </span>
        </div>
      ) : (
        <div className="bg-(--color-base-100) rounded-lg p-3 mb-2 h-full flex flex-col">
          <div className="flex justify-between items-center mb-2 border-b border-(--color-secondary) pb-2">
            <h3 className="w-full text-sm font-semibold text-(--color-primary)">
              Social Media Links
            </h3>

            {editingSocial ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addSocialMediaLink}
                  className="flex items-center text-xs bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded"
                >
                  + Add Link
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center text-xs bg-(--color-primary) text-(--color-primary-content) px-2 py-0.5 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center text-xs bg-(--color-secondary) text-(--color-secondary-content) px-2 py-2.5 rounded"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingSocial(true)}
                className="flex items-center text-xs bg-(--color-primary) text-(--color-primary-content) px-2 py-2.5 rounded"
              >
                <MdEdit /> Edit
              </button>
            )}
          </div>
          <fieldset
            disabled={!editingSocial}
            className="flex flex-col gap-2 h-27 overflow-y-auto border-0 p-0 m-0"
          >
            {socialMediaLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Platform (e.g. Instagram)"
                  value={link.platform}
                  onChange={(e) =>
                    handleSocialMediaChange(index, "platform", e.target.value)
                  }
                  className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingSocial ? "bg-white" : "bg-(--color-base-100)"} rounded text-sm`}
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) =>
                      handleSocialMediaChange(index, "url", e.target.value)
                    }
                    className={`w-full px-1.5 py-1 border border-(--color-secondary) ${editingSocial ? "bg-white" : "bg-(--color-base-100)"} rounded text-sm`}
                  />

                  {editingSocial && (
                    <button
                      type="button"
                      onClick={() => removeSocialMediaLink(index)}
                      className="text-red-500 text-sm px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            {socialMediaLinks.length === 0 && (
              <p className="text-xs text-(--color-secondary)">
                No social media links added.
              </p>
            )}
          </fieldset>
        </div>
      )}
    </>
  );
};

export default SocialMedia;
