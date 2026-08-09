import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdStar, MdLocationOn } from "react-icons/md";
import api from "../config/ApiConfig";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import defaultRestaurantImage from "../assets/Samplerestaurant.jpg";

const OrderNow = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Pizza", "Burger", "Healthy", "Dessert", "Indian"];

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/public/restaurants");
      setRestaurants(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during fetching restaurants. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurant = (restaurant) => {
    navigate(`/restaurant-details/${restaurant._id}`);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || (restaurant.cuisineTypes && restaurant.cuisineTypes.some(c => c.toLowerCase().includes(activeFilter.toLowerCase())));
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <Loader height="100vh" width="100%" />;
  }

  return (
    <div className="min-h-screen bg-base-200 pb-12">
      {/* Hero Section */}
      <div className="relative bg-primary overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_100%)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-black text-primary-content mb-4 tracking-tight drop-shadow-md">
            What are you craving today?
          </h1>
          <p className="text-lg md:text-xl text-primary-content/80 mb-10 max-w-2xl font-medium">
            Discover the best food and drinks from top-rated restaurants around you, delivered hot and fresh.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl relative shadow-2xl rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MdSearch className="text-3xl text-gray-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-5 pl-14 pr-6 text-lg text-gray-800 bg-white border-none focus:ring-0 outline-none placeholder-gray-400 font-medium"
              placeholder="Search for restaurants, cuisines, or dishes..."
            />
            <div className="absolute inset-y-2 right-2">
              <button className="bg-primary hover:bg-primary-focus text-white px-6 py-3 rounded-xl font-bold transition-colors h-full flex items-center">
                Search
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {filters.map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 shadow-sm
                  ${activeFilter === filter 
                    ? 'bg-white text-primary scale-110 shadow-md' 
                    : 'bg-primary-content/20 text-white hover:bg-white/30 backdrop-blur-sm'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Grid Section */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Restaurants</h2>
            <p className="text-gray-500 mt-1 font-medium">Based on your location and preferences</p>
          </div>
          <span className="text-gray-500 font-bold text-sm bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap">{filteredRestaurants.length} places</span>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group border border-gray-100 flex flex-col h-full"
                onClick={() => handleRestaurant(restaurant)}
              >
                {/* Image Container */}
                <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                  <img
                    src={restaurant?.coverImage?.url || defaultRestaurantImage}
                    alt={restaurant.restaurantName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <MdStar className="text-orange-500 text-sm" />
                    <span className="font-bold text-gray-800 text-sm">{restaurant.averageRating || "4.5"}</span>
                  </div>

                  {/* Status Badge */}
                  {restaurant.isOpen === false && (
                     <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-xs shadow-md">
                       Closed
                     </div>
                  )}
                  {restaurant.isOpen !== false && (
                     <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-xs shadow-md">
                       Open
                     </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {restaurant.restaurantName}
                    </h2>
                  </div>
                  
                  {/* Cuisine Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {restaurant.cuisineTypes?.slice(0, 3).map((cuisine, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                        {cuisine}
                      </span>
                    ))}
                    {restaurant.cuisineTypes?.length > 3 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                        +{restaurant.cuisineTypes.length - 3}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {restaurant.description || "A wonderful place to enjoy delicious meals."}
                  </p>

                  <div className="border-t border-gray-100 pt-3 flex items-center gap-1 text-gray-500 text-xs font-medium mt-auto">
                    <MdLocationOn className="text-lg text-primary" />
                    <span className="truncate">{restaurant.address ? `${restaurant.address}, ${restaurant.city}` : "Location not provided"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto mt-12">
            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486747.png" alt="No food" className="w-32 h-32 mx-auto mb-6 opacity-50 grayscale" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any restaurants matching your current filters or search.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveFilter('All')}}
              className="px-8 py-3 bg-primary text-primary-content rounded-xl font-bold hover:bg-primary-focus transition-colors shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderNow;
