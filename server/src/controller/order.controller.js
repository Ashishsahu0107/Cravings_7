import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";

export const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      customerId,
      orderItems,
      billDetails,
      deliveryAddress,
      paymentDetails,
    } = req.body;

    if (!restaurantId || !customerId || !orderItems || !billDetails) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({
      restaurantId,
      customerId,
      orderItems,
      billDetails,
      deliveryAddress,
      paymentDetails,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const orders = await Order.find({ customerId })
      .populate("restaurantId", "restaurantName coverImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const managerId = req.user._id; // from auth middleware

    const restaurant = await Restaurant.findOne({ managerId });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found for this manager" });
    }

    const orders = await Order.find({ restaurantId: restaurant._id })
      .populate({
        path: "customerId",
        populate: {
          path: "customerId",
          model: "user",
          select: "fullName email phone"
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch restaurant orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order status updated successfully", data: order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};
