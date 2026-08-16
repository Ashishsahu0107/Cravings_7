import Rider, { RiderEarnings, RiderTransaction } from "../models/rider.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

// Fetch rider profile including user details
export const getRiderProfile = async (req, res, next) => {
  try {
    const user = req.user;
    let rider = await Rider.findOne({ riderId: user._id }).populate("riderId");
    
    if (!rider) {
      rider = await Rider.create({ riderId: user._id });
    }
    
    res.status(200).json({ success: true, data: rider });
  } catch (error) {
    next(error);
  }
};

// Update rider location
export const updateRiderLocation = async (req, res, next) => {
  try {
    const { lat, lon } = req.body;
    const user = req.user;

    const rider = await Rider.findOneAndUpdate(
      { riderId: user._id },
      { "currentLocation.lat": lat, "currentLocation.lon": lon },
      { new: true }
    );

    res.status(200).json({ success: true, data: rider.currentLocation });
  } catch (error) {
    next(error);
  }
};

// Update rider online status
export const updateRiderOnlineStatus = async (req, res, next) => {
  try {
    const { status } = req.params; // online, offline, busy
    const user = req.user;

    const rider = await Rider.findOneAndUpdate(
      { riderId: user._id },
      { 
        onlineStatus: status,
        isAvailable: status === "online",
        lastOnlineAt: status === "online" ? new Date() : undefined
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: rider.onlineStatus });
  } catch (error) {
    next(error);
  }
};

// Get Dashboard Overview
export const getRiderDashboardOverview = async (req, res, next) => {
  try {
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });

    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarnings = await RiderEarnings.findOne({
      riderId: rider._id,
      date: { $gte: today }
    });

    res.status(200).json({
      success: true,
      data: {
        todayEarnings: todayEarnings?.netEarnings || 0,
        deliveriesToday: todayEarnings?.deliveryCount || 0,
        acceptanceRate: rider.acceptanceRate,
        completionRate: rider.completionRate,
        rating: rider.averageRating,
        distanceCovered: 0, // Mock for now
        activeHours: rider.activeHoursToday,
        tips: todayEarnings?.tips || 0,
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get Available Orders
export const getAvailableOrders = async (req, res, next) => {
  try {
    // Basic implementation: get orders that are 'ready' and have no rider assigned
    const orders = await Order.find({ orderStatus: "ready", riderId: null })
      .populate("restaurantId", "restaurantName address restaurantImages")
      .populate("customerId", "fullName");
      
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Accept Order
export const acceptOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });

    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const order = await Order.findOne({ _id: orderId, orderStatus: "ready", riderId: null });
    
    if (!order) {
      return res.status(400).json({ success: false, message: "Order no longer available" });
    }

    order.riderId = rider._id;
    order.orderStatus = "accepted"; // From rider's perspective, they accepted it to go pick up
    await order.save();

    rider.onlineStatus = "on_delivery";
    rider.isAvailable = false;
    await rider.save();

    res.status(200).json({ success: true, message: "Order accepted successfully", data: order });
  } catch (error) {
    next(error);
  }
};

// Reject Order (No-op mostly, just returns success so UI can hide it)
export const rejectOrder = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Order rejected" });
  } catch (error) {
    next(error);
  }
};

// Get current delivery
export const getCurrentDelivery = async (req, res, next) => {
  try {
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });
    
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const order = await Order.findOne({ 
      riderId: rider._id, 
      orderStatus: { $in: ["accepted", "onTheWay", "pickedUp"] } 
    })
    .populate("restaurantId", "restaurantName address restaurantImages phone contactNumber")
    .populate("customerId", "fullName phone")
    .populate("orderItems.itemId", "name image price isVeg");

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });

    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const order = await Order.findOne({ _id: orderId, riderId: rider._id });
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    // If delivered, calculate earnings and update rider state
    if (status === "delivered") {
      rider.onlineStatus = "online";
      rider.isAvailable = true;
      rider.deliveriesCompleted += 1;
      
      const deliveryFee = order.billDetails.deliveryCharge || 25;
      rider.totalEarnings += deliveryFee;
      rider.walletBalance += deliveryFee;
      await rider.save();

      // Record transaction
      await RiderTransaction.create({
        riderId: rider._id,
        orderId: order._id,
        type: "delivery_fee",
        amount: deliveryFee,
        status: "completed",
        description: `Delivery fee for order ${order._id}`
      });
      
      // Update Daily Earnings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let earnings = await RiderEarnings.findOne({ riderId: rider._id, date: { $gte: today } });
      if (!earnings) {
        earnings = new RiderEarnings({ riderId: rider._id, date: today });
      }
      earnings.deliveryFee += deliveryFee;
      earnings.netEarnings += deliveryFee;
      earnings.deliveryCount += 1;
      await earnings.save();
    }

    res.status(200).json({ success: true, message: `Order status updated to ${status}` });
  } catch (error) {
    next(error);
  }
};

// Get delivery history
export const getDeliveryHistory = async (req, res, next) => {
  try {
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });
    
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const orders = await Order.find({ 
      riderId: rider._id, 
      orderStatus: { $in: ["delivered", "cancelled", "failed", "undeliverable"] } 
    })
    .populate("restaurantId", "restaurantName address")
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// Get rider earnings
export const getRiderEarnings = async (req, res, next) => {
  try {
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });
    
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weeklyData = await RiderEarnings.find({
      riderId: rider._id,
      date: { $gte: new Date(new Date().setDate(today.getDate() - 7)) }
    }).sort({ date: 1 });

    const totalWeeklyEarnings = weeklyData.reduce((sum, item) => sum + item.netEarnings, 0);
    const todayData = weeklyData.find(item => item.date.getTime() === today.getTime());

    res.status(200).json({ 
      success: true, 
      data: {
        todayEarnings: todayData?.netEarnings || 0,
        weeklyEarnings: totalWeeklyEarnings,
        lifetimeEarnings: rider.totalEarnings,
        withdrawableBalance: rider.walletBalance,
        chartData: weeklyData
      } 
    });
  } catch (error) {
    next(error);
  }
};

// Get wallet transactions
export const getRiderTransactions = async (req, res, next) => {
  try {
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });
    
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    const transactions = await RiderTransaction.find({ riderId: rider._id })
      .populate("orderId", "billDetails")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

// Get rider performance
export const getRiderPerformance = async (req, res, next) => {
  try {
    const user = req.user;
    const rider = await Rider.findOne({ riderId: user._id });
    
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    res.status(200).json({ 
      success: true, 
      data: {
        acceptanceRate: rider.acceptanceRate,
        completionRate: rider.completionRate,
        customerRating: rider.averageRating,
        activeHours: rider.activeHoursToday,
        deliveriesCompleted: rider.deliveriesCompleted,
      } 
    });
  } catch (error) {
    next(error);
  }
};
