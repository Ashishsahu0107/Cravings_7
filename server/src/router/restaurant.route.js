import express from "express";
import {
  getRestaurantData,
  updateRestaurantInfo,
  updateLegalInfo,
  updateCoreDetails,
  updateOpenStatus
} from "../controller/restaurant.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middelware.js";

const router = express.Router();

router.get("/get-restaurant-data", RestaurantAuthProtect, getRestaurantData);
router.patch("/update-open-status/:isRestaurantOpen", RestaurantAuthProtect, updateOpenStatus);

router.put("/update-restaurant-info", RestaurantAuthProtect, updateRestaurantInfo);
router.put("/update-legal-info", RestaurantAuthProtect, updateLegalInfo);
router.put("/update-core-details", RestaurantAuthProtect, updateCoreDetails);

export default router;
