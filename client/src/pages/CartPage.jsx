import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { MdAdd, MdRemove, MdDeleteOutline, MdArrowBack } from "react-icons/md";
import toast from "react-hot-toast";
import api from "../config/ApiConfig";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, restaurantId } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const taxes = getCartTotal() * 0.05; // 5% tax
  const total = getCartTotal() + deliveryFee + taxes;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create order on backend
      const result = await api.post("/payment/create-order", { amount: total });
      
      if (!result.data || !result.data.order) {
        toast.error("Server error. Please try again.");
        setIsProcessing(false);
        return;
      }
      
      const { amount, id: order_id, currency } = result.data.order;

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "placeholder", 
        amount: amount.toString(),
        currency: currency,
        name: "Cravings Order",
        description: "Food Delivery Order",
        order_id: order_id,
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          // 3. Verify Payment
          try {
            const verifyRes = await api.post("/payment/verify-payment", data);
            if (verifyRes.data.success) {
              // Now create the actual order in DB
              const orderRes = await api.post("/order/create", createOrderPayload("completed"));
              if (orderRes.data.success) {
                toast.success("Payment Successful! Order Placed.");
                clearCart();
                navigate("/customer-dashboard", { state: { activeTab: "orders" } });
              }
            } else {
              toast.error("Payment Verification Failed!");
            }
          } catch (err) {
             toast.error("Payment Verification Failed!");
          }
          setIsProcessing(false);
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: "#c2410c", 
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.error("Payment Cancelled");
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error("Could not initiate payment.");
      setIsProcessing(false);
    }
  };

  const createOrderPayload = (paymentStatus = "pending") => {
    return {
      restaurantId,
      customerId: user?._id,
      orderItems: cartItems.map(item => ({ itemId: item._id, quantity: item.quantity })),
      billDetails: {
        totalAmount: getCartTotal(),
        platformFee: 0,
        convenienceFee: 0,
        taxAmount: taxes,
        deliveryCharge: deliveryFee,
        discountAmount: 0,
        finalAmount: total
      },
      deliveryAddress: {
        name: formData.name,
        address: formData.address,
        city: "Default",
        state: "Default",
        pinCode: "000000",
        country: "India"
      },
      paymentDetails: {
        paymentMethod: paymentMethod === "online" ? "card" : "cod",
        paymentStatus: paymentStatus
      }
    };
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    
    if (paymentMethod === "online") {
      handleOnlinePayment();
    } else {
      // COD Logic
      try {
        const orderRes = await api.post("/order/create", createOrderPayload("pending"));
        if (orderRes.data.success) {
          toast.success("Order placed successfully via COD!");
          clearCart();
          navigate("/customer-dashboard", { state: { activeTab: "orders" } });
        }
      } catch (err) {
        toast.error("Failed to place order.");
      }
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
        <div className="bg-base-100 p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="w-32 h-32 mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/order-now" className="px-6 py-3 bg-primary hover:bg-primary-focus text-primary-content rounded-xl font-bold transition-all shadow-md inline-block w-full">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6 font-medium"
        >
          <MdArrowBack /> Back to menu
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Items & Details */}
          <div className="flex-1 space-y-6">
            
            {/* Cart Items */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <p className="text-sm font-medium text-gray-500">
                  {localStorage.getItem('cravingsCartRestaurantName') || "Restaurant"}
                </p>
              </div>
              
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image?.url ? (
                        <img src={item.image.url} alt={item.itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-gray-800">{item.itemName}</h3>
                        <span className="font-bold text-orange-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item._id, 'decrease')}
                            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors"
                          >
                            <MdRemove />
                          </button>
                          <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, 'increase')}
                            className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors"
                          >
                            <MdAdd />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                          <MdDeleteOutline className="text-lg" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details Form */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300">
              <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Delivery Details</h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full input input-bordered rounded-lg bg-gray-50 focus:bg-white px-4 py-2" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full input input-bordered rounded-lg bg-gray-50 focus:bg-white px-4 py-2" placeholder="+91 9876543210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                  <textarea required name="address" value={formData.address} onChange={handleInputChange} className="w-full textarea textarea-bordered rounded-lg bg-gray-50 focus:bg-white px-4 py-2" rows="3" placeholder="123 Main Street, Apt 4B..."></textarea>
                </div>
                
                <h3 className="font-bold text-lg mt-6 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="radio radio-primary" />
                    <span className="font-medium">Cash on Delivery (COD)</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="radio radio-primary" />
                    <span className="font-medium">Online Payment (Razorpay)</span>
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Bill Summary */}
          <div className="lg:w-96 w-full">
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-300 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Bill Details</h2>
              
              <div className="space-y-3 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-medium text-gray-900">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes & Charges (5%)</span>
                  <span className="font-medium text-gray-900">₹{taxes.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-300 mb-6">
                <span className="text-lg font-bold">To Pay</span>
                <span className="text-2xl font-black text-primary">₹{total.toFixed(2)}</span>
              </div>
              
              <button 
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary-focus text-primary-content py-4 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  paymentMethod === "online" ? "Pay Securely" : "Place Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
