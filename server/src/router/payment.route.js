import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controller/payment.controller.js";
import { AuthProtect } from "../middleware/auth.middelware.js";

const router = express.Router();

router.post("/create-order", AuthProtect, createOrder);
router.post("/verify-payment", AuthProtect, verifyPayment);

export default router;
