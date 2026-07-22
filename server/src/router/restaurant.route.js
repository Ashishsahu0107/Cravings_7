import express from "express";
import multer from "multer";
import {
  getRestaurantData,
  updateRestaurantInfo,
  updateLegalInfo,
  updateCoreDetails,
  updateOpenStatus,
  updateRestaurantPhotos,
  getDashboardOverview,
} from "../controller/restaurant.controller.js";
import { getMenu, addMenuItem } from "../controller/menu.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middelware.js";

const router = express.Router();
const Upload = multer();

router.get("/get-restaurant-data", RestaurantAuthProtect, getRestaurantData);
router.patch(
  "/update-open-status/:isRestaurantOpen",
  RestaurantAuthProtect,
  updateOpenStatus,
);

router.put(
  "/update-restaurant-info",
  RestaurantAuthProtect,
  updateRestaurantInfo,
);
router.put("/update-legal-info", RestaurantAuthProtect, updateLegalInfo);
router.put("/update-core-details", RestaurantAuthProtect, updateCoreDetails);

router.put(
  "/update-restaurant-photos",
  RestaurantAuthProtect,
  Upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 8 },
  ]),
  updateRestaurantPhotos
);

router.get("/get-menu", RestaurantAuthProtect, getMenu);
router.post("/add-dish", RestaurantAuthProtect, Upload.single("image"), addMenuItem);
router.get("/overview", RestaurantAuthProtect, getDashboardOverview);

export default router;
