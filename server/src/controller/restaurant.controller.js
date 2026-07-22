import Restaurant from "../models/restaurant.model.js";
import { UploadSingleImage, uploadMultipleImages, deleteSingleImage } from "../utils/image.service.js";
// ======================
// Upsert Basic Information
// ======================
export const updateRestaurantInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const data = req.body;

    let cuisineTypes = data.cuisineTypes;
    if (typeof cuisineTypes === "string") {
      cuisineTypes = cuisineTypes
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);
    }

    const payload = {
      restaurantName: data.restaurantName,
      description: data.description,
      restaurantType: data.restaurantType,
      cuisineTypes: cuisineTypes || [],
      isOpen: data.isOpen === "true" || data.isOpen === true,
      contactDetails: {
        email: data.contactEmail,
        phone: data.contactPhone,
      },
      servingHours: {
        openingTime: data.openingTime,
        closingTime: data.closingTime,
      },
    };

    let existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      if (!payload.restaurantName) {
        return res.status(400).json({
          message: "Restaurant Name is required to create a restaurant.",
        });
      }
      existingRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        ...payload,
      });
      return res.status(201).json({
        success: true,
        message: "Restaurant profile created successfully",
        data: existingRestaurant,
      });
    }

    // Update existing
    Object.keys(payload).forEach((key) => {
      if (payload[key] !== undefined) {
        existingRestaurant[key] = payload[key];
      }
    });

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant basic information updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Update Legal Information
// ======================
export const updateLegalInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { legalName, companyType } = req.body;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found. Please fill basic information first.",
      });
    }

    existingRestaurant.documents = {
      ...(existingRestaurant.documents || {}),
      legalName: legalName,
      companyType: companyType,
    };

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant legal information updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Update Core Details
// ======================
export const updateCoreDetails = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const data = req.body;

    let socialMediaLinks = data.socialMediaLinks;
    if (typeof socialMediaLinks === "string") {
      socialMediaLinks = JSON.parse(socialMediaLinks);
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found. Please fill basic information first.",
      });
    }

    if (data.address !== undefined) existingRestaurant.address = data.address;
    if (data.city !== undefined) existingRestaurant.city = data.city;
    if (data.state !== undefined) existingRestaurant.state = data.state;
    if (data.pinCode !== undefined) existingRestaurant.pinCode = data.pinCode;
    if (data.country !== undefined) existingRestaurant.country = data.country;

    if (data.geoLat !== undefined || data.geoLon !== undefined) {
      existingRestaurant.geoLocation = {
        lat:
          data.geoLat !== undefined
            ? data.geoLat
            : existingRestaurant.geoLocation?.lat,
        lon:
          data.geoLon !== undefined
            ? data.geoLon
            : existingRestaurant.geoLocation?.lon,
      };
    }

    if (
      data.bankName !== undefined ||
      data.accountNumber !== undefined ||
      data.ifscCode !== undefined
    ) {
      existingRestaurant.financialDetails = {
        ...(existingRestaurant.financialDetails || {}),
        bankName:
          data.bankName !== undefined
            ? data.bankName
            : existingRestaurant.financialDetails?.bankName,
        accountNumber:
          data.accountNumber !== undefined
            ? data.accountNumber
            : existingRestaurant.financialDetails?.accountNumber,
        ifscCode:
          data.ifscCode !== undefined
            ? data.ifscCode
            : existingRestaurant.financialDetails?.ifscCode,
      };
    }

    if (data.socialMediaLinks !== undefined) {
      existingRestaurant.socialMediaLinks = socialMediaLinks;
    }

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant core details updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Get Restaurant Data
// ======================
export const getRestaurantData = async (req, res, next) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Manager id is required.",
      });
    }

    const restaurant = await Restaurant.findOne({
      managerId: id,
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully.",
      data: restaurant,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateOpenStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { isRestaurantOpen } = req.params;

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found. Please fill basic information first.",
      });
    }

    existingRestaurant.isOpen = isRestaurantOpen === "true";

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant open status updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Update Restaurant Photos
// ======================
export const updateRestaurantPhotos = async (req, res, next) => {
  try {
    const currentUser = req.user;
    let retainedGalleryImages = req.body.retainedGalleryImages;
    if (typeof retainedGalleryImages === "string") {
      retainedGalleryImages = JSON.parse(retainedGalleryImages);
    }

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found. Please fill basic information first.",
      });
    }

    // Handle Cover Image
    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
      const coverFile = req.files.coverImage[0];
      const result = await UploadSingleImage(coverFile, "cravings/restaurant/cover");

      if (existingRestaurant.coverImage && existingRestaurant.coverImage.publicId) {
        await deleteSingleImage(existingRestaurant.coverImage).catch(() => {});
      }

      existingRestaurant.coverImage = {
        url: result.url,
        publicId: result.publicId,
      };
    } else if (req.body.removeCoverImage === "true") {
      if (existingRestaurant.coverImage && existingRestaurant.coverImage.publicId) {
        await deleteSingleImage(existingRestaurant.coverImage).catch(() => {});
      }
      existingRestaurant.coverImage = undefined;
    }

    // Handle Gallery Images
    let currentGallery = existingRestaurant.restaurantImage || [];
    
    // Delete images that are not in the retained list
    if (retainedGalleryImages && Array.isArray(retainedGalleryImages)) {
      const retainedIds = retainedGalleryImages.map((img) => img.publicId);
      const imagesToDelete = currentGallery.filter((img) => !retainedIds.includes(img.publicId));

      for (const img of imagesToDelete) {
        await deleteSingleImage(img).catch(() => {});
      }

      currentGallery = currentGallery.filter((img) => retainedIds.includes(img.publicId));
    }

    // Upload new gallery images
    if (req.files && req.files.galleryImages && req.files.galleryImages.length > 0) {
      const newImages = await uploadMultipleImages(req.files.galleryImages, "cravings/restaurant/gallery");
      currentGallery = [...currentGallery, ...newImages];
    }

    existingRestaurant.restaurantImage = currentGallery;

    await existingRestaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant photos updated successfully",
      data: existingRestaurant,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

