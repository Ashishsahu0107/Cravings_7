import Restaurant from "../models/restaurant.model.js";
// ======================
// Upsert Basic Information
// ======================
export const updateRestaurantInfo = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const data = req.body;

    let cuisineTypes = data.cuisineTypes;
    if (typeof cuisineTypes === "string") {
      cuisineTypes = cuisineTypes.split(",").map(c => c.trim()).filter(c => c);
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
        return res.status(400).json({ message: "Restaurant Name is required to create a restaurant." });
      }
      existingRestaurant = await Restaurant.create({
        managerId: currentUser._id,
        ...payload
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
      return res.status(404).json({ message: "Restaurant not found. Please fill basic information first." });
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
      return res.status(404).json({ message: "Restaurant not found. Please fill basic information first." });
    }

    existingRestaurant.address = data.address;
    existingRestaurant.city = data.city;
    existingRestaurant.state = data.state;
    existingRestaurant.pinCode = data.pinCode;
    existingRestaurant.country = data.country;
    
    existingRestaurant.geoLocation = {
      lat: data.geoLat,
      lon: data.geoLon,
    };

    existingRestaurant.financialDetails = {
      ...(existingRestaurant.financialDetails || {}),
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
    };

    existingRestaurant.socialMediaLinks = socialMediaLinks || [];

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
      return res.status(404).json({ message: "Restaurant not found. Please fill basic information first." });
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
