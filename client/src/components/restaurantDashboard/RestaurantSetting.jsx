import React, { useState } from "react";
import RestaurantInformation from "./settings/RestaurantInformation";
import ResturantCoreDetails from "./settings/ResturantCoreDetails";
import RestaurantPhotos from "./settings/RestaurantPhotos";

const RestaurantSetting = () => {
  const Tabs = [
    { id: "information", label: "Information" },
    { id: "coreDetails", label: "Core Details" },
    { id: "photos", label: "Photos" },
  ];
  const [activeTab, setActiveTab] = useState("information");

  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  return (
    <>
      <div className=" h-full flex flex-col">
        <div className="border-b border-secondary/50 flex justify-between w-full">
          <div className="flex gap-3 ">
            {Tabs.map((tab, idx) => (
              <>
                <div
                  key={idx}
                  className={`px-2 py-1 uppercase cursor-pointer ${activeTab === tab.id ? "text-primary-content rounded-sm mb-2 bg-primary border-primary" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </div>
              </>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="w-22 text-xs font-semibold">Currently Open</label>
            <input
              type="checkbox"
              name="isOpen"
              checked={isRestaurantOpen}
              onChange={() => setIsRestaurantOpen(!isRestaurantOpen)}
              className=" w-4 h-4 accent-(--color-primary)"
            />
          </div>
        </div>
        <div className="h-full rounded-lg bg-(--color-base-200)">
          {activeTab === "information" && <RestaurantInformation />}
          {activeTab === "coreDetails" && <ResturantCoreDetails />}
          {activeTab === "photos" && <RestaurantPhotos />}
        </div>
      </div>
    </>
  );
};

export default RestaurantSetting;

// const RestaurantSetting = () => {
//   const { user, setUser } = useAuth();
//   const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(false);
//   const [editingProfile, setEditingProfile] = useState(false);
//   const [profilePic, setProfilePic] = useState(null);
//   const [profilePicPreview, setProfilePicPreview] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
//     useState(false);

//   const [editingRestaurant, setEditingRestaurant] = useState(false);

//   const [coverImageFile, setCoverImageFile] = useState(null);
//   const [restaurantImageFiles, setRestaurantImageFiles] = useState([]);

//   const [socialMediaLinks, setSocialMediaLinks] = useState([
//     {
//       platform: "",
//       url: "",
//     },
//   ]);

//   const handleSocialChange = (index, field, value) => {
//     const updated = [...socialMediaLinks];
//     updated[index][field] = value;
//     setSocialMediaLinks(updated);
//   };

//   const addSocialLink = () => {
//     setSocialMediaLinks([
//       ...socialMediaLinks,
//       {
//         platform: "",
//         url: "",
//       },
//     ]);
//   };

//   const removeSocialLink = (index) => {
//     const updated = socialMediaLinks.filter((_, i) => i !== index);
//     setSocialMediaLinks(updated);
//   };

//   const [restaurantData, setRestaurantData] = useState({
//     restaurantName: "",
//     description: "",
//     restaurantType: "both",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     country: "",
//     latitude: "",
//     longitude: "",
//     legalName: "",
//     companyType: "",
//     gstCertificate: "",
//     fssaiCertificate: "",
//     panCard: "",
//     bankName: "",
//     accountNumber: "",
//     ifscCode: "",
//     email: "",
//     phone: "",
//     openingTime: "",
//     closingTime: "",
//     cuisineTypes: "",
//     isOpen: false,
//   });

//   const handleRestaurantChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setRestaurantData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setCoverImageFile(file);
//     }
//   };

//   const handleRestaurantImagesChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setRestaurantImageFiles(files);
//     }
//   };

//   const [formData, setFormData] = useState({
//     fullName: user?.fullName || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//   });

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setIsLoading(true);
//       const payload = new FormData();
//       payload.append("fullName", formData.fullName);
//       payload.append("email", formData.email.toLowerCase());
//       payload.append("phone", formData.phone);
//       payload.append("displayPic", profilePic);

//       const response = await api.put(`/user/edit-profile`, payload);
//       setUser(response.data.data);
//       sessionStorage.setItem("cravingUser", JSON.stringify(response.data.data));
//       setEditingProfile(false);
//       toast.success("Profile updated successfully!");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSaveRestaurant = async () => {
//     try {
//       setIsLoadingRestaurant(true);
//       const payload = new FormData();
//       payload.append("restaurantName", restaurantData.restaurantName);
//       payload.append("description", restaurantData.description);
//       payload.append("restaurantType", restaurantData.restaurantType);
//       payload.append("address", restaurantData.address);
//       payload.append("city", restaurantData.city);
//       payload.append("state", restaurantData.state);
//       payload.append("pinCode", restaurantData.pinCode);
//       payload.append("country", restaurantData.country);
//       payload.append("latitude", restaurantData.latitude);
//       payload.append("longitude", restaurantData.longitude);
//       payload.append("legalName", restaurantData.legalName);
//       payload.append("companyType", restaurantData.companyType);
//       payload.append("gstCertificate", restaurantData.gstCertificate);
//       payload.append("fssaiCertificate", restaurantData.fssaiCertificate);
//       payload.append("panCard", restaurantData.panCard);
//       payload.append("bankName", restaurantData.bankName);
//       payload.append("accountNumber", restaurantData.accountNumber);
//       payload.append("ifscCode", restaurantData.ifscCode);
//       payload.append("email", restaurantData.email);
//       payload.append("phone", restaurantData.phone);
//       payload.append("openingTime", restaurantData.openingTime);
//       payload.append("closingTime", restaurantData.closingTime);
//       payload.append("cuisineTypes", restaurantData.cuisineTypes);
//       payload.append("isOpen", restaurantData.isOpen);
//       payload.append("socialMediaLinks", JSON.stringify(socialMediaLinks));

//       if (coverImageFile) {
//         payload.append("coverImage", coverImageFile);
//       }

//       restaurantImageFiles.forEach((file) => {
//         payload.append("restaurantImage", file);
//       });

//       const response = await api.put(`/restaurant/update-profile`, payload);
//       setRestaurantData(response.data.data);
//       setCoverImageFile(null);
//       setRestaurantImageFiles([]);
//       setEditingRestaurant(false);
//       toast.success("Restaurant information updated successfully!");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to update restaurant information");
//     } finally {
//       setIsLoadingRestaurant(false);
//     }
//   };

//   const fetchRestaurantData = async () => {
//     try {
//       setIsLoadingRestaurant(true);
//       const res = await api.get(`/restaurant/get-restaurant-data?id=${user._id}`);
//       const restaurant = res.data.data;

//       setRestaurantData({
//         ...restaurant,
//         coverImage: restaurant.coverImage,
//         restaurantImage: restaurant.restaurantImage,
//         latitude: restaurant.geoLocation?.lat || "",
//         longitude: restaurant.geoLocation?.lon || "",
//         legalName: restaurant.documents?.legalName || "",
//         companyType: restaurant.documents?.companyType || "",
//         gstCertificate: restaurant.documents?.gstCertificate || "",
//         fssaiCertificate: restaurant.documents?.fssaiCertificate || "",
//         panCard: restaurant.documents?.panCard || "",
//         bankName: restaurant.financialDetails?.bankName || "",
//         accountNumber: restaurant.financialDetails?.accountNumber || "",
//         ifscCode: restaurant.financialDetails?.ifscCode || "",
//         email: restaurant.contactDetails?.email || "",
//         phone: restaurant.contactDetails?.phone || "",
//         openingTime: restaurant.servingHours?.openingTime || "",
//         closingTime: restaurant.servingHours?.closingTime || "",
//         cuisineTypes: restaurant.cuisineTypes?.join(", ") || "",
//       });

//       setSocialMediaLinks(
//         restaurant.socialMediaLinks?.length
//           ? restaurant.socialMediaLinks
//           : [{ platform: "", url: "" }],
//       );
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Unknown error occurred while fetching restaurant data.",
//       );
//     } finally {
//       setIsLoadingRestaurant(false);
//     }
//   };

//   useEffect(() => {
//     fetchRestaurantData();
//   }, []);

//   const handleCancelProfile = () => {
//     setFormData({
//       fullName: user.fullName,
//       email: user.email,
//       phone: user.phone,
//     });
//     setProfilePicPreview(null);
//     setEditingProfile(false);
//   };

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     setProfilePicPreview(URL.createObjectURL(file));
//     setProfilePic(file);
//   };

//   return (
//     <>
//       <div className="overflow-y-auto scrollbar-none h-full bg-base-100">
//         <div className="max-w-6xl mx-auto p-6 space-y-6">
//           {/* Profile Card */}
//           <div className="card bg-base-100 shadow-lg">
//             <div className="card-body">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="card-title text-2xl">Profile Information</h2>
//                 {!editingProfile ? (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setEditingProfile(true)}
//                       className="btn btn-primary btn-sm"
//                     >
//                       <MdEdit /> Edit Profile
//                     </button>
//                     <button
//                       onClick={() => setIsPasswordChangeModalOpen(true)}
//                       className="btn btn-outline btn-sm"
//                     >
//                       <MdOutlineLockReset /> Change Password
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleSaveProfile}
//                       className="btn btn-success btn-sm"
//                       disabled={isLoading}
//                     >
//                       {isLoading ? "Saving..." : "Save"}
//                     </button>
//                     <button
//                       onClick={handleCancelProfile}
//                       className="btn btn-ghost btn-sm"
//                       disabled={isLoading}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 {/* Profile Picture */}
//                 <div className="flex flex-col items-center justify-center">
//                   <div className="relative mb-4">
//                     <img
//                       src={profilePicPreview || user.photo.url}
//                       alt="Profile"
//                       className="w-40 h-40 rounded-full object-cover shadow-md border-4 border-primary"
//                     />
//                     {editingProfile && (
//                       <label
//                         htmlFor="profilePic"
//                         className="absolute bottom-2 right-2 bg-primary text-primary-content rounded-full p-2 cursor-pointer hover:bg-primary-focus transition"
//                       >
//                         <MdOutlineAddAPhoto className="text-xl" />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           id="profilePic"
//                           className="hidden"
//                           onChange={handleProfilePicChange}
//                         />
//                       </label>
//                     )}
//                   </div>
//                 </div>

//                 {/* Profile Fields */}
//                 <div className="lg:col-span-3 space-y-4">
//                   <div>
//                     <label className="label label-text font-semibold">Full Name</label>
//                     <input
//                       type="text"
//                       name="fullName"
//                       value={formData.fullName}
//                       onChange={handleProfileChange}
//                       className="input input-bordered w-full"
//                       disabled={!editingProfile}
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="label label-text font-semibold">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         className="input input-bordered w-full"
//                         disabled={true}
//                       />
//                     </div>
//                     <div>
//                       <label className="label label-text font-semibold">Phone</label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleProfileChange}
//                         className="input input-bordered w-full"
//                         disabled={!editingProfile}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Restaurant Information Section */}
//           {isLoadingRestaurant ? (
//             <div className="flex justify-center items-center h-96">
//               <span className="loading loading-spinner loading-lg text-primary"></span>
//             </div>
//           ) : (
//             <div className="card bg-base-100 shadow-lg">
//               <div className="card-body">
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="card-title text-2xl">Restaurant Information</h2>
//                   {!editingRestaurant ? (
//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => setEditingRestaurant(true)}
//                     >
//                       <MdEdit /> Edit Restaurant
//                     </button>
//                   ) : (
//                     <div className="flex gap-2">
//                       <button
//                         className="btn btn-success btn-sm"
//                         onClick={handleSaveRestaurant}
//                         disabled={isLoadingRestaurant}
//                       >
//                         {isLoadingRestaurant ? "Saving..." : "Save"}
//                       </button>
//                       <button
//                         className="btn btn-ghost btn-sm"
//                         onClick={() => setEditingRestaurant(false)}
//                         disabled={isLoadingRestaurant}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Images Section */}
//                 <div className="mb-8 pb-8 border-b border-base-300">
//                   <h3 className="text-lg font-semibold mb-4">Restaurant Images</h3>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* Restaurant Images */}
//                     <div className="space-y-3">
//                       <label className="label label-text font-semibold">Restaurant Photos</label>
//                       {restaurantData.restaurantImage?.length > 0 && (
//                         <div className="grid grid-cols-2 gap-3 mb-4">
//                           {restaurantData.restaurantImage.map((image, index) => (
//                             <img
//                               key={index}
//                               src={image.url}
//                               alt={`Restaurant ${index + 1}`}
//                               className="h-32 rounded-lg object-cover shadow"
//                             />
//                           ))}
//                         </div>
//                       )}
//                       {editingRestaurant && (
//                         <div>
//                           <input
//                             type="file"
//                             multiple
//                             accept="image/*"
//                             onChange={handleRestaurantImagesChange}
//                             className="file-input file-input-bordered w-full"
//                           />
//                           {restaurantImageFiles.length > 0 && (
//                             <p className="text-sm text-primary mt-2">
//                               ✓ {restaurantImageFiles.length} image(s) selected for upload
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Cover Image */}
//                     <div className="space-y-3">
//                       <label className="label label-text font-semibold">Cover Image</label>
//                       {restaurantData.coverImage?.url && (
//                         <img
//                           src={restaurantData.coverImage.url}
//                           alt="Cover"
//                           className="w-full h-40 rounded-lg object-cover shadow mb-4"
//                         />
//                       )}
//                       {editingRestaurant && (
//                         <div>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleCoverImageChange}
//                             className="file-input file-input-bordered w-full"
//                           />
//                           {coverImageFile && (
//                             <p className="text-sm text-primary mt-2">
//                               ✓ {coverImageFile.name} selected
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Basic Information */}
//                 <div className="mb-8 pb-8 border-b border-base-300">
//                   <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="label label-text font-semibold">Restaurant Name</label>
//                       <input
//                         className="input input-bordered w-full"
//                         name="restaurantName"
//                         value={restaurantData.restaurantName}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       />
//                     </div>
//                     <div>
//                       <label className="label label-text font-semibold">Restaurant Type</label>
//                       <select
//                         className="select select-bordered w-full"
//                         name="restaurantType"
//                         value={restaurantData.restaurantType}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       >
//                         <option value="veg">Veg</option>
//                         <option value="non-veg">Non Veg</option>
//                         <option value="jain">Jain</option>
//                         <option value="vegan">Vegan</option>
//                         <option value="both">Both</option>
//                       </select>
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="label label-text font-semibold">Description</label>
//                       <textarea
//                         className="textarea textarea-bordered w-full h-24"
//                         name="description"
//                         value={restaurantData.description}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       />
//                     </div>
//                     <div className="md:col-span-2">
//                       <label className="label label-text font-semibold">Cuisine Types</label>
//                       <input
//                         className="input input-bordered w-full"
//                         name="cuisineTypes"
//                         placeholder="e.g., Indian, Chinese, Italian"
//                         value={restaurantData.cuisineTypes}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Location Information */}
//                 <div className="mb-8 pb-8 border-b border-base-300">
//                   <h3 className="text-lg font-semibold mb-4">Location</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <input
//                       className="input input-bordered w-full md:col-span-2"
//                       placeholder="Address"
//                       name="address"
//                       value={restaurantData.address}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="City"
//                       name="city"
//                       value={restaurantData.city}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="State"
//                       name="state"
//                       value={restaurantData.state}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="Pin Code"
//                       name="pinCode"
//                       value={restaurantData.pinCode}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="Country"
//                       name="country"
//                       value={restaurantData.country}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="Latitude"
//                       name="latitude"
//                       value={restaurantData.latitude}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="Longitude"
//                       name="longitude"
//                       value={restaurantData.longitude}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                   </div>
//                 </div>

//                 {/* Operating Hours */}
//                 <div className="mb-8 pb-8 border-b border-base-300">
//                   <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="label label-text font-semibold">Opening Time</label>
//                       <input
//                         type="time"
//                         className="input input-bordered w-full"
//                         name="openingTime"
//                         value={restaurantData.openingTime}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       />
//                     </div>
//                     <div>
//                       <label className="label label-text font-semibold">Closing Time</label>
//                       <input
//                         type="time"
//                         className="input input-bordered w-full"
//                         name="closingTime"
//                         value={restaurantData.closingTime}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       />
//                     </div>
//                     <div className="flex items-end">
//                       <label className="label cursor-pointer gap-4 w-full">
//                         <span className="font-semibold">Restaurant Open</span>
//                         <input
//                           type="checkbox"
//                           className="checkbox checkbox-primary"
//                           name="isOpen"
//                           checked={restaurantData.isOpen}
//                           onChange={handleRestaurantChange}
//                           disabled={!editingRestaurant}
//                         />
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="mb-8 pb-8 border-b border-base-300">
//                   <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="label label-text font-semibold">Email</label>
//                       <input
//                         className="input input-bordered w-full"
//                         name="email"
//                         value={restaurantData.email}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       />
//                     </div>
//                     <div>
//                       <label className="label label-text font-semibold">Phone</label>
//                       <input
//                         className="input input-bordered w-full"
//                         name="phone"
//                         value={restaurantData.phone}
//                         onChange={handleRestaurantChange}
//                         disabled={!editingRestaurant}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Legal & Financial Information */}
//                 <div className="mb-8 pb-8 border-b border-base-300">
//                   <h3 className="text-lg font-semibold mb-4">Legal & Compliance</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <input
//                       className="input input-bordered"
//                       placeholder="Legal Name"
//                       name="legalName"
//                       value={restaurantData.legalName}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="Company Type"
//                       name="companyType"
//                       value={restaurantData.companyType}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="GST Number"
//                       name="gstCertificate"
//                       value={restaurantData.gstCertificate}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="FSSAI Number"
//                       name="fssaiCertificate"
//                       value={restaurantData.fssaiCertificate}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered md:col-span-2"
//                       placeholder="PAN Card"
//                       name="panCard"
//                       value={restaurantData.panCard}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                   </div>
//                 </div>

//                 {/* Financial Information */}
//                 <div className="mb-8 pb-8 border-b border-base-300">
//                   <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <input
//                       className="input input-bordered"
//                       placeholder="Bank Name"
//                       name="bankName"
//                       value={restaurantData.bankName}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="Account Number"
//                       name="accountNumber"
//                       value={restaurantData.accountNumber}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                     <input
//                       className="input input-bordered"
//                       placeholder="IFSC Code"
//                       name="ifscCode"
//                       value={restaurantData.ifscCode}
//                       onChange={handleRestaurantChange}
//                       disabled={!editingRestaurant}
//                     />
//                   </div>
//                 </div>

//                 {/* Social Media Links */}
//                 <div>
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold">Social Media Links</h3>
//                     {editingRestaurant && (
//                       <button
//                         type="button"
//                         onClick={addSocialLink}
//                         className="btn btn-sm btn-outline"
//                       >
//                         + Add Link
//                       </button>
//                     )}
//                   </div>

//                   <div className="space-y-3">
//                     {socialMediaLinks.map((item, index) => (
//                       <div key={index} className="flex gap-3 items-end">
//                         <div className="flex-1">
//                           <label className="label label-text text-sm">Platform</label>
//                           <input
//                             type="text"
//                             className="input input-bordered w-full"
//                             placeholder="Facebook, Instagram, Twitter..."
//                             value={item.platform}
//                             disabled={!editingRestaurant}
//                             onChange={(e) =>
//                               handleSocialChange(index, "platform", e.target.value)
//                             }
//                           />
//                         </div>
//                         <div className="flex-1">
//                           <label className="label label-text text-sm">Link</label>
//                           <input
//                             type="url"
//                             className="input input-bordered w-full"
//                             placeholder="https://..."
//                             value={item.url}
//                             disabled={!editingRestaurant}
//                             onChange={(e) =>
//                               handleSocialChange(index, "url", e.target.value)
//                             }
//                           />
//                         </div>
//                         {editingRestaurant && (
//                           <button
//                             type="button"
//                             className="btn btn-error btn-sm"
//                             onClick={() => removeSocialLink(index)}
//                           >
//                             Remove
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {isPasswordChangeModalOpen && (
//         <PasswordChangeModal
//           open={isPasswordChangeModalOpen}
//           onClose={() => setIsPasswordChangeModalOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default RestaurantSetting;
