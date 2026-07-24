import Menu from "../models/menu.model.js";
import Restaurant from "../models/restaurant.model.js";
import { UploadSingleImage, deleteSingleImage } from "../utils/image.service.js";

// ======================
// Get Menu
// ======================
export const getMenu = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const restaurant = await Restaurant.findOne({ managerId: currentUser._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const menu = await Menu.findOne({ restaurantId: restaurant._id });
    if (!menu) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: menu.menuItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Add Menu Item
// ======================
export const addMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemName, description, price, category } = req.body;

    if (!itemName || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const restaurant = await Restaurant.findOne({ managerId: currentUser._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Dish image is required" });
    }

    // Upload image
    const result = await UploadSingleImage(req.file, "cravings/menu/dish");

    const newMenuItem = {
      itemName,
      description,
      price: Number(price),
      category,
      image: {
        url: result.url,
        publicId: result.publicId,
      },
    };

    let menu = await Menu.findOne({ restaurantId: restaurant._id });
    
    if (!menu) {
      // Create new menu document
      menu = new Menu({
        restaurantId: restaurant._id,
        menuItems: [newMenuItem],
      });
    } else {
      // Add to existing menu document
      menu.menuItems.push(newMenuItem);
    }

    await menu.save();

    return res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      data: menu.menuItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Toggle Menu Item Status
// ======================
export const toggleMenuItemStatus = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;
    const { isAvailable } = req.body;

    const restaurant = await Restaurant.findOne({ managerId: currentUser._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const menu = await Menu.findOne({ restaurantId: restaurant._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found." });
    }

    const menuItem = menu.menuItems.id(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    if (isAvailable !== undefined) {
      menuItem.isAvailable = isAvailable;
    } else if (Object.keys(req.body).length === 0) {
      menuItem.isAvailable = !menuItem.isAvailable;
    }

    if (req.body.isTopRated !== undefined) {
      menuItem.isTopRated = req.body.isTopRated;
    }
    if (req.body.isRecommended !== undefined) {
      menuItem.isRecommended = req.body.isRecommended;
    }
    if (req.body.isNew !== undefined) {
      menuItem.isNew = req.body.isNew;
    }

    await menu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item status updated successfully",
      data: menu.menuItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Edit Menu Item
// ======================
export const editMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;
    const { itemName, description, price, category } = req.body;

    if (!itemName || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const restaurant = await Restaurant.findOne({ managerId: currentUser._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const menu = await Menu.findOne({ restaurantId: restaurant._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found." });
    }

    const menuItem = menu.menuItems.id(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    menuItem.itemName = itemName;
    menuItem.description = description;
    menuItem.price = Number(price);
    menuItem.category = category;

    if (req.file) {
      // Delete old image if it exists
      if (menuItem.image && menuItem.image.publicId) {
        await deleteSingleImage(menuItem.image);
      }
      // Upload new image
      const result = await UploadSingleImage(req.file, "cravings/menu/dish");
      menuItem.image = {
        url: result.url,
        publicId: result.publicId,
      };
    }

    await menu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menu.menuItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// ======================
// Delete Menu Item
// ======================
export const deleteMenuItem = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { itemId } = req.params;

    const restaurant = await Restaurant.findOne({ managerId: currentUser._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const menu = await Menu.findOne({ restaurantId: restaurant._id });
    if (!menu) {
      return res.status(404).json({ message: "Menu not found." });
    }

    const menuItem = menu.menuItems.id(itemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    // Delete image from cloudinary if it exists
    if (menuItem.image && menuItem.image.publicId) {
      try {
        await deleteSingleImage(menuItem.image);
      } catch (imgError) {
        console.error("Error deleting image:", imgError);
        // Continue even if image deletion fails
      }
    }

    // Remove the item
    menu.menuItems.pull(itemId);
    
    await menu.save();

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
      data: menu.menuItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
