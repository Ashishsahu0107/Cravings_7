import express from "express";
import multer from "multer";
import {
  restaurantUpdateProfile,
  getRestaurantData,
} from "../controller/restaurant.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middelware.js";

const upload = multer();
const router = express.Router();

router.get("/get-restaurant-data", RestaurantAuthProtect, getRestaurantData);

router.put(
  "/update-profile",
  RestaurantAuthProtect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "restaurantImage", maxCount: 10 },
  ]),
  restaurantUpdateProfile,
);

export default router;
