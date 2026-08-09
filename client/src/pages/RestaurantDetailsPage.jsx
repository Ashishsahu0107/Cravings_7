import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/ApiConfig";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import NoDataFound from "../components/NoDataFound";
import defaultRestaurantImage from "../assets/Samplerestaurant.jpg";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/ui/CartDrawer";
import { MdShoppingBag } from "react-icons/md";

const RestaurantDetailsPage = () => {
  const { restaurantId } = useParams();

  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addToCart, getCartCount, getCartTotal } = useCart();

  const fetchRestaurantDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/public/restaurant-detail/${restaurantId}`,
      );
      setRestaurantDetails(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during fetching restaurant details. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
  }, [restaurantId]);

  if (isLoading) {
    return <Loader height="100vh" width="100%" />;
  }

  if (!restaurantDetails || !restaurantDetails.restaurantId) {
    return (
      <NoDataFound
        height="100vh"
        width="100%"
        text="Restaurant details not found"
      />
    );
  }

  const restaurant = restaurantDetails.restaurantId;
  const menuItems = restaurantDetails.menuItems || [];

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="w-full h-64 md:h-80 relative">
        <img
          src={restaurant.coverImage?.url || defaultRestaurantImage}
          alt={restaurant.restaurantName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="p-8 text-white w-full max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {restaurant.restaurantName}
            </h1>
            <p className="text-lg opacity-90 mb-1">
              {restaurant.cuisineTypes?.join(", ")}
            </p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="bg-green-600 px-2 py-1 rounded-md text-white flex items-center gap-1">
                ⭐ {restaurant.averageRating || "New"}
              </span>
              <span>
                {restaurant.address}, {restaurant.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 pt-0">
        <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">
          Menu Items
        </h2>

        {menuItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-base-100 border border-base-300 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-row p-3 items-stretch gap-4"
              >
                {/* Image */}
                <div className="w-25 h-25 md:w-25 md:h-25 flex-shrink-0">
                  <img
                    src={item.image?.url || defaultRestaurantImage}
                    alt={item.itemName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow justify-between py-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {item.itemName}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          item.itemType?.toLowerCase() === "veg"
                            ? "bg-slate-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.itemType?.toLowerCase() === "veg" ? "veg" : "non-veg"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 md:line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Price & Add Button */}
                <div className="flex flex-col justify-between items-end py-1 min-w-[70px]">
                  <span className="font-bold text-orange-600 text-lg">
                    ₹{item.price}
                  </span>
                  <button
                    className="bg-[#c2410c] hover:bg-[#9a3412] text-white px-5 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => {
                      addToCart(item, restaurant._id, restaurant.restaurantName);
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-base-100 p-8 rounded-xl text-center shadow-sm">
            <h3 className="text-xl font-medium text-gray-500">
              No menu items available for this restaurant.
            </h3>
          </div>
        )}
      </div>
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Floating Cart Button (shows only if items in cart) */}
      {getCartCount() > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-[100] px-4 pointer-events-none">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-primary hover:bg-primary-focus text-primary-content px-6 py-3.5 rounded-full shadow-2xl font-bold flex items-center justify-between gap-4 pointer-events-auto transform transition-all active:scale-95 min-w-[280px]"
          >
            <div className="flex items-center gap-2">
              <MdShoppingBag className="text-2xl" />
              <span className="bg-primary-content/20 px-2 py-0.5 rounded-md">
                {getCartCount()} items
              </span>
            </div>
            <span>View Cart • ₹{getCartTotal().toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailsPage;