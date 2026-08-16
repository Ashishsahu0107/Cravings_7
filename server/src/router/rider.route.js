import express from "express";
import { RiderAuthProtect } from "../middleware/auth.middelware.js";
import {
  getRiderProfile,
  updateRiderLocation,
  updateRiderOnlineStatus,
  getRiderDashboardOverview,
  getAvailableOrders,
  acceptOrder,
  rejectOrder,
  getCurrentDelivery,
  updateDeliveryStatus,
  getDeliveryHistory,
  getRiderEarnings,
  getRiderTransactions,
  getRiderPerformance
} from "../controller/rider.controller.js";

const router = express.Router();

router.use(RiderAuthProtect);

router.get("/profile", getRiderProfile);
router.patch("/location", updateRiderLocation);
router.patch("/online-status/:status", updateRiderOnlineStatus);
router.get("/overview", getRiderDashboardOverview);

router.get("/available-orders", getAvailableOrders);
router.post("/accept-order/:orderId", acceptOrder);
router.post("/reject-order/:orderId", rejectOrder);

router.get("/current-delivery", getCurrentDelivery);
router.patch("/delivery/:orderId/status", updateDeliveryStatus);
router.get("/delivery-history", getDeliveryHistory);

router.get("/earnings", getRiderEarnings);
router.get("/transactions", getRiderTransactions);
router.get("/performance", getRiderPerformance);

export default router;

