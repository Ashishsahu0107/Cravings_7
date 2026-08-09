import express from "express";
import { createOrder, getCustomerOrders, getRestaurantOrders, updateOrderStatus } from "../controller/order.controller.js";
import { RestaurantAuthProtect } from "../middleware/auth.middelware.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/customer/:customerId", getCustomerOrders);
router.get("/restaurant-manager", RestaurantAuthProtect, getRestaurantOrders);
router.patch("/:orderId/status", RestaurantAuthProtect, updateOrderStatus);

export default router;
