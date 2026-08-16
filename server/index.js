import cloudinary from "./src/config/cloudinary.config.js";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/dbConnection.config.js";
import { createServer } from "http";
import { Server } from "socket.io";

import AuthRouter from "./src/router/auth.route.js";
import PublicRouter from "./src/router/public.route.js";
import CommonRouter from "./src/router/common.route.js";

import AdminRouter from "./src/router/admin.route.js";
import RestaurantRouter from "./src/router/restaurant.route.js";
import CustomerRouter from "./src/router/customer.route.js";
import RiderRouter from "./src/router/rider.route.js";
import PaymentRouter from "./src/router/payment.route.js";
import OrderRouter from "./src/router/order.route.js";

import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/user", CommonRouter);

app.use("/admin", AdminRouter);
app.use("/restaurant", RestaurantRouter);
app.use("/customer", CustomerRouter);
app.use("/rider", RiderRouter);
app.use("/payment", PaymentRouter);
app.use("/order", OrderRouter);

//Default API
app.get("/", (req, res) => {
  console.log("Default Get API Hit");
  res.json({ message: "Welcome to my Cravings Project" });
});

//Default Error Handler

app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Server Error";
  const ErrStausCode = err.statusCode || 500;

  res.status(ErrStausCode).json({ message: ErrMessage });
});

const port = process.env.PORT || 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export { io }; // Export for use in controllers

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("join_rider", (riderId) => {
    socket.join(`rider:${riderId}`);
    socket.join("riders_pool"); // For general broadcasts
    console.log(`Rider ${riderId} joined`);
  });

  socket.on("rider_location_update", (data) => {
    // Expected { riderId, lat, lon }
    io.emit("location_update", data); // broadcast to others if needed
  });

  socket.on("rider_status_change", (data) => {
    // Expected { riderId, status }
    io.emit("status_change", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

httpServer.listen(port, async () => {
  console.log("Server Started on port:", port);
  connectDB();
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Connected :");
    console.log(result);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});
