import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { deliveryAPI, ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Phone, Truck, Gift } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    delivery_type_id: '',
    location_id: '',
    delivery_address: '',
    phone_number: '',
    gift_details: {
      is_gift: false,
      recipient_name: '',
      message: '',
    },
  });

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    
    loadDeliveryOptions();
  }, [cart.items.length, navigate]);

  const loadDeliveryOptions = async () => {
    try {
      const [deliveryResponse, locationsResponse] = await Promise.all([
        deliveryAPI.getTypes(),
        deliveryAPI.getLocations(),
      ]);
      
      setDeliveryTypes(deliveryResponse.data);
      setLocations(locationsResponse.data);
      
      // Set default values
      if (deliveryResponse.data.length > 0) {
        setFormData(prev => ({ ...prev, delivery_type_id: deliveryResponse.data[0].id }));
      }
      if (locationsResponse.data.length > 0) {
        setFormData(prev => ({ ...prev, location_id: locationsResponse.data[0].id }));
      }
    } catch (error) {
      toast.error('Failed to load delivery options');
      console.error('Error loading delivery options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGiftChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      gift_details: {
        ...prev.gift_details,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const validateForm = () => {
    if (!formData.delivery_type_id) {
      toast.error('Please select a delivery type');
      return false;
    }
    if (!formData.location_id) {
      toast.error('Please select a location');
      return false;
    }
    if (!formData.delivery_address.trim()) {
      toast.error('Please enter delivery address');
      return false;
    }
    if (!formData.phone_number.trim()) {
      toast.error('Please enter phone number');
      return false;
    }
    if (formData.gift_details.is_gift && !formData.gift_details.recipient_name.trim()) {
      toast.error('Please enter recipient name for gift orders');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      const orderData = {
        ...formData,
        delivery_type_id: parseInt(formData.delivery_type_id),
        location_id: parseInt(formData.location_id),
      };

      await ordersAPI.create(orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedDeliveryType = () => {
    return deliveryTypes.find(type => type.id === parseInt(formData.delivery_type_id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Delivery Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="inline h-4 w-4 mr-1" />
                    Delivery Type
                  </label>
                  <select
                    name="delivery_type_id"
                    value={formData.delivery_type_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select delivery type</option>
                    {deliveryTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ${type.price} ({type.estimated_time})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Delivery Location
                  </label>
                  <select
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Delivery Address
                  </label>
                  <textarea
                    name="delivery_address"
                    value={formData.delivery_address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1234567890"
                    required
                  />
                </div>

                {/* Gift Details */}
                <div className="border-t pt-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="is_gift"
                      checked={formData.gift_details.is_gift}
                      onChange={handleGiftChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm font-medium text-gray-700">
                      <Gift className="inline h-4 w-4 mr-1" />
                      This is a gift order
                    </label>
                  </div>

                  {formData.gift_details.is_gift && (
                    <div className="space-y-4 ml-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          name="recipient_name"
                          value={formData.gift_details.recipient_name}
                          onChange={handleGiftChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter recipient name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gift Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.gift_details.message}
                          onChange={handleGiftChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your gift message"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Placing Order...
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.meal.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">${item.total_price}</p>
                  </div>
                ))}
              </div>

              {/* Delivery Info */}
              {getSelectedDeliveryType() && (
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery ({getSelectedDeliveryType().name})</span>
                    <span className="font-medium">${getSelectedDeliveryType().price}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Estimated time: {getSelectedDeliveryType().estimated_time}
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    ${(cart.total_amount + (getSelectedDeliveryType()?.price || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 