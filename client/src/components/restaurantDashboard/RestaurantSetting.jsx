import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/ApiConfig";
import toast from "react-hot-toast";
import { MdOutlineAddAPhoto, MdOutlineLockReset } from "react-icons/md";
import PasswordChangeModal from "../commonModals/PasswordChangeModal";

const RestaurantSetting = () => {
  const { user, setUser } = useAuth();
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);

  const [editingRestaurant, setEditingRestaurant] = useState(false);

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [restaurantImageFiles, setRestaurantImageFiles] = useState([]);

  const [socialMediaLinks, setSocialMediaLinks] = useState([
    {
      platform: "",
      url: "",
    },
  ]);

  const handleSocialChange = (index, field, value) => {
    const updated = [...socialMediaLinks];
    updated[index][field] = value;
    setSocialMediaLinks(updated);
  };

  const addSocialLink = () => {
    setSocialMediaLinks([
      ...socialMediaLinks,
      {
        platform: "",
        url: "",
      },
    ]);
  };

  const removeSocialLink = (index) => {
    const updated = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(updated);
  };

  const [restaurantData, setRestaurantData] = useState({
    restaurantName: "",
    description: "",
    restaurantType: "both",

    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",

    latitude: "",
    longitude: "",

    legalName: "",
    companyType: "",
    gstCertificate: "",
    fssaiCertificate: "",
    panCard: "",

    bankName: "",
    accountNumber: "",
    ifscCode: "",

    email: "",
    phone: "",

    openingTime: "",
    closingTime: "",

    cuisineTypes: "",

    facebook: "",
    instagram: "",
    twitter: "",

    isOpen: false,
  });

  const handleRestaurantChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRestaurantData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
    }
  };

  const handleRestaurantImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setRestaurantImageFiles(files);
    }
  };

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);

      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email.toLowerCase());
      payload.append("phone", formData.phone);

      payload.append("displayPic", profilePic);

      const response = await api.put(`/user/edit-profile`, payload);

      setUser(response.data.data);
      sessionStorage.setItem("cravingUser", JSON.stringify(response.data.data));

      setEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRestaurant = async () => {
    try {
      setIsLoadingRestaurant(true);

      const payload = new FormData();
      payload.append("restaurantName", restaurantData.restaurantName);
      payload.append("description", restaurantData.description);
      payload.append("restaurantType", restaurantData.restaurantType);
      payload.append("address", restaurantData.address);
      payload.append("city", restaurantData.city);
      payload.append("state", restaurantData.state);
      payload.append("pinCode", restaurantData.pinCode);
      payload.append("country", restaurantData.country);
      payload.append("latitude", restaurantData.latitude);
      payload.append("longitude", restaurantData.longitude);
      payload.append("legalName", restaurantData.legalName);
      payload.append("companyType", restaurantData.companyType);
      payload.append("gstCertificate", restaurantData.gstCertificate);
      payload.append("fssaiCertificate", restaurantData.fssaiCertificate);
      payload.append("panCard", restaurantData.panCard);
      payload.append("bankName", restaurantData.bankName);
      payload.append("accountNumber", restaurantData.accountNumber);
      payload.append("ifscCode", restaurantData.ifscCode);
      payload.append("email", restaurantData.email);
      payload.append("phone", restaurantData.phone);
      payload.append("openingTime", restaurantData.openingTime);
      payload.append("closingTime", restaurantData.closingTime);
      payload.append("cuisineTypes", restaurantData.cuisineTypes);
      payload.append("isOpen", restaurantData.isOpen);
      payload.append("socialMediaLinks", JSON.stringify(socialMediaLinks));

      // Append cover image if provided
      if (coverImageFile) {
        payload.append("coverImage", coverImageFile);
      }

      // Append restaurant images if provided
      restaurantImageFiles.forEach((file) => {
        payload.append("restaurantImage", file);
      });

      const response = await api.put(`/restaurant/update-profile`, payload);

      setRestaurantData(response.data.data);
      setCoverImageFile(null);
      setRestaurantImageFiles([]);
      setEditingRestaurant(false);
      toast.success("Restaurant information updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update restaurant information");
    } finally {
      setIsLoadingRestaurant(false);
    }
  };

  const fetchRestaurantData = async () => {
    try {
      setIsLoadingRestaurant(true);

      const res = await api.get(
        `/restaurant/get-restaurant-data?id=${user._id}`,
      );

      const restaurant = res.data.data;

      setRestaurantData({
        ...restaurant,

        coverImage: restaurant.coverImage,
        restaurantImage: restaurant.restaurantImage,

        latitude: restaurant.geoLocation?.lat || "",
        longitude: restaurant.geoLocation?.lon || "",

        legalName: restaurant.documents?.legalName || "",
        companyType: restaurant.documents?.companyType || "",
        gstCertificate: restaurant.documents?.gstCertificate || "",
        fssaiCertificate: restaurant.documents?.fssaiCertificate || "",
        panCard: restaurant.documents?.panCard || "",

        bankName: restaurant.financialDetails?.bankName || "",
        accountNumber: restaurant.financialDetails?.accountNumber || "",
        ifscCode: restaurant.financialDetails?.ifscCode || "",

        email: restaurant.contactDetails?.email || "",
        phone: restaurant.contactDetails?.phone || "",

        openingTime: restaurant.servingHours?.openingTime || "",
        closingTime: restaurant.servingHours?.closingTime || "",

        cuisineTypes: restaurant.cuisineTypes?.join(", ") || "",
      });

      setSocialMediaLinks(
        restaurant.socialMediaLinks?.length
          ? restaurant.socialMediaLinks
          : [{ platform: "", url: "" }],
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred while fetching restaurant data.",
      );
    } finally {
      setIsLoadingRestaurant(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const handleCancelProfile = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    });
    setProfilePicPreview(null);
    setEditingProfile(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePicPreview(URL.createObjectURL(file));
    setProfilePic(file);
  };

  return (
    <>
      <div className="overflow-y-auto scrollbar-none h-full p-3 space-y-2">
        {/* User Profile Section */}
        <div className="bg-base-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            {!editingProfile ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingProfile(true)}
                  className="flex items-center gap-2 bg-primary text-primary-content px-3 py-1 rounded text-sm"
                >
                  <MdEdit /> Edit
                </button>
                <button
                  onClick={() => setIsPasswordChangeModalOpen(true)}
                  className="flex items-center gap-2 border border-primary text-primary px-3 py-1 rounded text-sm hover:bg-primary hover:text-primary-content"
                >
                  <MdOutlineLockReset /> Change Password
                </button>
              </div>
            ) : (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-primary text-primary-content px-3 py-1 rounded text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancelProfile}
                  className="flex items-center gap-2 bg-secondary text-secondary-content px-3 py-1 rounded text-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-36 h-36">
                  <img
                    src={profilePicPreview || user.photo.url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-2 border-primary"
                  />
                </div>

                {editingProfile && (
                  <div
                    className="absolute cursor-pointer bottom-1 right-1 border p-2 rounded-full w-fit bg-base-200"
                    title="Change Photo"
                  >
                    <label htmlFor="profilePic" className="cursor-pointer">
                      <MdOutlineAddAPhoto className="text-xl" />
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      name="profilePic"
                      id="profilePic"
                      className="hidden"
                      onChange={handleProfilePicChange}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 w-full">
                <div className="grid grid-cols-5 gap-2 justify-center items-center">
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${editingProfile ? "border-secondary" : "border-transparent"} rounded col-span-4`}
                    disabled={!editingProfile}
                  />

                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${editingProfile ? "border-secondary" : "border-transparent"} rounded col-span-4`}
                    disabled={true}
                  />

                  <label className="block text-sm font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border ${editingProfile ? "border-secondary" : "border-transparent"} rounded col-span-4`}
                    disabled={!editingProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoadingRestaurant ? (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="bg-base-200 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Restaurant Information</h2>

              {!editingRestaurant ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setEditingRestaurant(true)}
                >
                  <MdEdit />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveRestaurant}
                    disabled={isLoadingRestaurant}
                  >
                    {isLoadingRestaurant ? "Saving..." : "Save"}
                  </button>

                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setEditingRestaurant(false)}
                    disabled={isLoadingRestaurant}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="font-semibold">Restaurant Images</label>

                <div className="grid grid-cols-4 gap-4">
                  {restaurantData.restaurantImage?.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt=""
                      className="h-32 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>

                {editingRestaurant && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">
                      Upload New Restaurant Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleRestaurantImagesChange}
                      className="file-input file-input-bordered w-full"
                      disabled={!editingRestaurant}
                    />
                    {restaurantImageFiles.length > 0 && (
                      <div className="text-xs text-primary">
                        {restaurantImageFiles.length} image(s) selected
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="font-semibold">Cover Image</label>

                  {restaurantData.coverImage?.url && (
                    <img
                      src={restaurantData.coverImage.url}
                      alt="Cover"
                      className="w-full h-52 rounded-lg object-cover"
                    />
                  )}

                  {editingRestaurant && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Upload New Cover Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="file-input file-input-bordered w-full"
                        disabled={!editingRestaurant}
                      />
                      {coverImageFile && (
                        <div className="text-xs text-primary">
                          {coverImageFile.name} selected
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Restaurant Name */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Restaurant Name</legend>

                <input
                  className="input rounded-sm input-bordered w-full"
                  name="restaurantName"
                  value={restaurantData.restaurantName}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Restaurant Type */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Restaurant Type</legend>

                <select
                  className="select rounded-sm select-bordered w-full"
                  name="restaurantType"
                  value={restaurantData.restaurantType}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non Veg</option>
                  <option value="jain">Jain</option>
                  <option value="vegan">Vegan</option>
                  <option value="both">Both</option>
                </select>
              </fieldset>

              {/* Description */}

              <fieldset className="fieldset col-span-2">
                <legend className="fieldset-legend">Description</legend>

                <textarea
                  className="textarea border rounded-sm textarea-bordered h-12"
                  name="description"
                  value={restaurantData.description}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Address */}

              <fieldset className="fieldset col-span-2">
                <legend className="fieldset-legend">Address</legend>

                <input
                  className="input rounded-sm  input-bordered w-full"
                  name="address"
                  value={restaurantData.address}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* City */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">City</legend>

                <input
                  className="input rounded-sm input-bordered"
                  name="city"
                  value={restaurantData.city}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* State */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">State</legend>

                <input
                  className="input rounded-sm input-bordered"
                  name="state"
                  value={restaurantData.state}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Pin */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Pin Code</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="pinCode"
                  value={restaurantData.pinCode}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Country */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Country</legend>

                <input
                  className="input rounded-sm input-bordered"
                  name="country"
                  value={restaurantData.country}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Latitude */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Latitude</legend>

                <input
                  className="input rounded-sm input-bordered"
                  name="latitude"
                  value={restaurantData.latitude}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Longitude */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Longitude</legend>

                <input
                  className="input rounded-sm input-bordered"
                  name="longitude"
                  value={restaurantData.longitude}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Legal Name */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Legal Name</legend>

                <input
                  className="input rounded-sm input-bordered"
                  name="legalName"
                  value={restaurantData.legalName}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Company Type */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Company Type</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="companyType"
                  value={restaurantData.companyType}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* GST */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">GST Number</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="gstCertificate"
                  value={restaurantData.gstCertificate}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* FSSAI */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">FSSAI Number</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="fssaiCertificate"
                  value={restaurantData.fssaiCertificate}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* PAN */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">PAN Card</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="panCard"
                  value={restaurantData.panCard}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Bank */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Bank Name</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="bankName"
                  value={restaurantData.bankName}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Account */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Account Number</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="accountNumber"
                  value={restaurantData.accountNumber}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* IFSC */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">IFSC Code</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="ifscCode"
                  value={restaurantData.ifscCode}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Contact Email */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Contact Email</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="email"
                  value={restaurantData.email}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Phone */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Contact Phone</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="phone"
                  value={restaurantData.phone}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Opening */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Opening Time</legend>

                <input
                  type="time"
                  className="input rounded-sm   input-bordered"
                  name="openingTime"
                  value={restaurantData.openingTime}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Closing */}

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Closing Time</legend>

                <input
                  type="time"
                  className="input rounded-sm   input-bordered"
                  name="closingTime"
                  value={restaurantData.closingTime}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Cuisine */}

              <fieldset className="fieldset col-span-2">
                <legend className="fieldset-legend">Cuisine Types</legend>

                <input
                  className="input rounded-sm  input-bordered"
                  name="cuisineTypes"
                  placeholder="Indian, Chinese, Italian"
                  value={restaurantData.cuisineTypes}
                  onChange={handleRestaurantChange}
                  disabled={!editingRestaurant}
                />
              </fieldset>

              {/* Toggle */}

              <div className="col-span-2">
                <label className="label cursor-pointer justify-start gap-4">
                  <span className="font-semibold">Restaurant Open</span>

                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    name="isOpen"
                    checked={restaurantData.isOpen}
                    onChange={handleRestaurantChange}
                    disabled={!editingRestaurant}
                  />
                </label>
              </div>
            </div>
            <div className="col-span-2 border-t border-base-300 pt-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold">Social Media Links</h3>

                {editingRestaurant && (
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="btn btn-primary btn-sm"
                  >
                    + Add Link
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {socialMediaLinks.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end"
                  >
                    {/* Platform */}

                    <div className="col-span-4">
                      <label className="fieldset-legend">Platform</label>

                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Facebook"
                        value={item.platform}
                        disabled={!editingRestaurant}
                        onChange={(e) =>
                          handleSocialChange(index, "platform", e.target.value)
                        }
                      />
                    </div>

                    {/* URL */}

                    <div className="col-span-6">
                      <label className="fieldset-legend">Link</label>

                      <input
                        type="url"
                        className="input input-bordered w-full"
                        placeholder="https://facebook.com/restaurant"
                        value={item.url}
                        disabled={!editingRestaurant}
                        onChange={(e) =>
                          handleSocialChange(index, "url", e.target.value)
                        }
                      />
                    </div>

                    {/* Remove */}

                    <div className="col-span-2">
                      {editingRestaurant && (
                        <button
                          type="button"
                          className="btn btn-error btn-outline w-full"
                          onClick={() => removeSocialLink(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isPasswordChangeModalOpen && (
        <PasswordChangeModal
          open={isPasswordChangeModalOpen}
          onClose={() => setIsPasswordChangeModalOpen(false)}
        />
      )}
    </>
  );
};

export default RestaurantSetting;
