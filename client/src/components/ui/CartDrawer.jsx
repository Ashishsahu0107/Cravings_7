import React from 'react';
import { MdClose, MdDeleteOutline, MdAdd, MdRemove, MdShoppingBag } from 'react-icons/md';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/cart');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[200] backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-base-100 z-[210] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center gap-2">
            <MdShoppingBag className="text-2xl text-primary" />
            <h2 className="text-xl font-bold">Your Cart</h2>
            <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full text-sm">
              {cartItems.length}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-base-200 rounded-full transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <MdShoppingBag className="text-6xl mb-4 text-base-300" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add some delicious items from the menu!</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary font-semibold rounded-lg hover:bg-primary/20 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-500">
                  {localStorage.getItem('cravingsCartRestaurantName') || "Restaurant"}
                </p>
                <button 
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear all
                </button>
              </div>
              
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 bg-base-200 p-3 rounded-xl border border-base-300">
                  <div className="w-16 h-16 flex-shrink-0 bg-base-300 rounded-lg overflow-hidden">
                     {item.image?.url ? (
                        <img src={item.image.url} alt={item.itemName} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No Img</div>
                     )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-bold text-sm leading-tight text-gray-800 line-clamp-2">{item.itemName}</h4>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors"
                      >
                        <MdDeleteOutline className="text-lg" />
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <div className="font-bold text-orange-600">₹{(item.price * item.quantity).toFixed(2)}</div>
                      
                      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item._id, 'decrease')}
                          className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <MdRemove className="text-sm" />
                        </button>
                        <span className="px-2 py-1 text-sm font-bold min-w-[32px] text-center bg-gray-50">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item._id, 'increase')}
                          className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <MdAdd className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 bg-base-100 border-t border-base-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="font-semibold text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900 text-xl">₹{getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-primary hover:bg-primary-focus text-primary-content py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98]"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
