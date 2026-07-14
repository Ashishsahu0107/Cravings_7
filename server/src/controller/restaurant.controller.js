import Restaurant from "../models/restaurant.model.js";

import {
  uploadMultipleImages,
  deleteMultipleImages,
  UploadSingleImage,
  deleteSingleImage,
} from "../utils/image.service.js";

export const restaurantUpdateProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const restaurantDataFromFE = req.body;
    const coverImageFromFE = req.files?.coverImage?.[0];
    const restaurantImageFromFE = req.files?.restaurantImage;

    // Parse JSON strings from FormData
    if (restaurantDataFromFE.socialMediaLinks) {
      restaurantDataFromFE.socialMediaLinks = JSON.parse(restaurantDataFromFE.socialMediaLinks);
    }

    // Parse cuisineTypes if it's a string
    if (restaurantDataFromFE.cuisineTypes && typeof restaurantDataFromFE.cuisineTypes === "string") {
      restaurantDataFromFE.cuisineTypes = restaurantDataFromFE.cuisineTypes
        .split(",")
        .map((cuisine) => cuisine.trim())
        .filter((cuisine) => cuisine);
    }

    // Parse geoLocation
    const restaurantData = {
      restaurantName: restaurantDataFromFE.restaurantName,
      description: restaurantDataFromFE.description,
      restaurantType: restaurantDataFromFE.restaurantType,
      address: restaurantDataFromFE.address,
      city: restaurantDataFromFE.city,
      state: restaurantDataFromFE.state,
      pinCode: restaurantDataFromFE.pinCode,
      country: restaurantDataFromFE.country,
      geoLocation: {
        lat: restaurantDataFromFE.latitude,
        lon: restaurantDataFromFE.longitude,
      },
      documents: {
        legalName: restaurantDataFromFE.legalName,
        companyType: restaurantDataFromFE.companyType,
        gstCertificate: restaurantDataFromFE.gstCertificate,
        fssaiCertificate: restaurantDataFromFE.fssaiCertificate,
        panCard: restaurantDataFromFE.panCard,
      },
      financialDetails: {
        bankName: restaurantDataFromFE.bankName,
        accountNumber: restaurantDataFromFE.accountNumber,
        ifscCode: restaurantDataFromFE.ifscCode,
      },
      contactDetails: {
        email: restaurantDataFromFE.email,
        phone: restaurantDataFromFE.phone,
      },
      servingHours: {
        openingTime: restaurantDataFromFE.openingTime,
        closingTime: restaurantDataFromFE.closingTime,
      },
      cuisineTypes: restaurantDataFromFE.cuisineTypes || [],
      isOpen: restaurantDataFromFE.isOpen === "true" || restaurantDataFromFE.isOpen === true,
      socialMediaLinks: restaurantDataFromFE.socialMediaLinks || [],
    };

    const existingRestaurant = await Restaurant.findOne({
      managerId: currentUser._id,
    });

    if (!existingRestaurant) {
      // Creating new restaurant
      if (coverImageFromFE) {
        const coverImage = await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        restaurantData.coverImage = coverImage;
      } else {
        return res.status(400).json({
          message: "Cover image is required",
        });
      }

      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        const restaurantImages = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        restaurantData.restaurantImage = restaurantImages;
      } else {
        return res.status(400).json({
          message: "At least one restaurant image is required",
        });
      }

      const newRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        ...restaurantData,
      });

      return res.status(201).json({
        message: "Restaurant profile created successfully",
        data: newRestaurant,
      });
    } else {
      // Updating existing restaurant
      if (coverImageFromFE) {
        // Delete old cover image if exists
        if (existingRestaurant.coverImage?.publicId) {
          try {
            await deleteSingleImage(existingRestaurant.coverImage);
          } catch (error) {
            console.log("Error deleting old cover image:", error.message);
          }
        }

        const coverImage = await UploadSingleImage(
          coverImageFromFE,
          `restaurant/${currentUser.phone}/coverPhoto`,
        );
        restaurantData.coverImage = coverImage;
      }

      if (restaurantImageFromFE && restaurantImageFromFE.length > 0) {
        // Delete old restaurant images if exist
        if (
          existingRestaurant.restaurantImage &&
          existingRestaurant.restaurantImage.length > 0
        ) {
          try {
            await deleteMultipleImages(existingRestaurant.restaurantImage);
          } catch (error) {
            console.log("Error deleting old restaurant images:", error.message);
          }
        }

        const restaurantImages = await uploadMultipleImages(
          restaurantImageFromFE,
          `restaurant/${currentUser.phone}/restaurantPhotos`,
        );
        restaurantData.restaurantImage = restaurantImages;
      }

      // Update only provided fields
      Object.keys(restaurantData).forEach((key) => {
        if (restaurantData[key] !== undefined) {
          existingRestaurant[key] = restaurantData[key];
        }
      });

      await existingRestaurant.save();

      return res.status(200).json({
        message: "Restaurant profile updated successfully",
        data: existingRestaurant,
      });
    }
  } catch (error) {
    console.log(error.message);
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
