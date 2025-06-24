import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart } = useCart();
  
  const [deliveryType, setDeliveryType] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientMatricNo, setRecipientMatricNo] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemIndex, setDeleteItemIndex] = useState(null);
  const [errors, setErrors] = useState({});

  // Load saved form data from localStorage
  useEffect(() => {
    const savedDeliveryType = localStorage.getItem('cartDeliveryType') || '';
    const savedDeliveryLocation = localStorage.getItem('cartDeliveryLocation') || '';
    const savedFormData = localStorage.getItem('cartFormData');
    
    setDeliveryType(savedDeliveryType);
    setDeliveryLocation(savedDeliveryLocation);
    
    if (savedFormData) {
      const data = JSON.parse(savedFormData);
      setWhatsappNumber(data.whatsappNumber || '');
      setIsGift(data.isGift || false);
      setRecipientName(data.recipientName || '');
      setRecipientMatricNo(data.matricNumber || '');
    }
  }, []);

  // Save form data to localStorage
  const saveFormData = useCallback(() => {
    const formData = {
      whatsappNumber,
      isGift,
      recipientName,
      matricNumber: recipientMatricNo
    };
    localStorage.setItem('cartFormData', JSON.stringify(formData));
  }, [whatsappNumber, isGift, recipientName, recipientMatricNo]);

  useEffect(() => {
    saveFormData();
  }, [saveFormData]);

  useEffect(() => {
    localStorage.setItem('cartDeliveryType', deliveryType);
  }, [deliveryType]);

  useEffect(() => {
    localStorage.setItem('cartDeliveryLocation', deliveryLocation);
  }, [deliveryLocation]);

  // Debug logging
  useEffect(() => {
    console.log('Cart state in Cart component:', cart);
    console.log('Cart items:', cart?.items);
    console.log('Cart items length:', cart?.items?.length);
  }, [cart]);

  const updateItemQuantity = async (itemId, field, change) => {
    const item = cart.items.find(item => item.id === itemId);
    if (!item) return;

    const currentValue = item[field] || 0;
    const newValue = Math.max(1, currentValue + change);
    
    const updates = { [field]: newValue };
    await updateCartItem(itemId, updates);
  };

  const updateSpecialInstructions = async (itemId, value) => {
    await updateCartItem(itemId, { special_instructions: value });
  };

  const openDeleteModal = (index) => {
    setDeleteItemIndex(index);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteItemIndex(null);
  };

  const handleDeleteItem = async () => {
    if (deleteItemIndex !== null) {
      const item = cart.items[deleteItemIndex];
      if (item) {
        await removeFromCart(item.id);
      }
      closeDeleteModal();
    }
  };

  const calculateItemTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const portions = item.portions || 0;
      const plates = item.plates || 0;
      return total + (portions * price) + (plates * 150);
    }, 0);
  };

  const getDeliveryFee = () => {
    if (deliveryType === 'express') return 300;
    if (deliveryType === 'normal') return 200;
    return 0;
  };

  const getServiceCharge = () => {
    return 300;
  };

  const getTotal = () => {
    return calculateItemTotal() + getDeliveryFee() + getServiceCharge();
  };

  const formatPrice = (price) => {
    return `₦${Number(price).toLocaleString()}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryType) {
      newErrors.deliveryType = 'Please select a delivery type';
    }

    if (!deliveryLocation) {
      newErrors.deliveryLocation = 'Please select a delivery location';
    }

    if (!whatsappNumber || !/^0\d{10}$/.test(whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid 11-digit WhatsApp number starting with 0';
    }

    if (isGift) {
      if (!recipientName.trim()) {
        newErrors.recipientName = "Please enter recipient's name";
      }
      if (!recipientMatricNo.trim()) {
        newErrors.recipientMatricNo = "Please enter recipient's matric number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    alert('Proceeding to payment!');
  };

  // If cart is empty, show empty state
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="flex items-center justify-center text-center w-full h-screen fixed inset-0 bg-white z-10">
        <section className="flex items-center justify-center text-center w-full">
          <div className="flex flex-col items-center justify-center gap-[12px]">
            <i className="fas fa-shopping-cart text-[#FF9493] text-[96px]"></i>
            <h2 className="custom-font font-[400] text-[#010101] text-[22px] leading-[32px]">Your cart is empty</h2>
            <p className="text-[#4E4E4E] custom-font font-[400] leading-[26px]">Add items to order.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-2 px-6 py-3 bg-[#B20201] text-white font-bold text-lg shadow hover:bg-[#8B0101] transition-colors duration-200"
            >
              Back to Menu
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <main className="mx-[64px] py-[32px] max-md:mx-[16px] pt-[128px] max-sm:pt-[120px]">
        <section>
          <div id="cart-content">
            <h2 className="custom-font font-[700] text-[28px] leading-[36px] text-[#010101] mb-[24px] text-left">Order Summary</h2>
            
            {cart.items.map((item, idx) => {
              const imageUrl = item.image || item.image_url || '/images/menu/foodHovered.png';
              const price = Number(item.price) || 0;
              const portions = item.portions || 0;
              const plates = item.plates || 0;
              const portionsPerPlate = item.portionsPerPlate || 0;
              const specialInstructions = item.special_instructions || '';

              return (
                <div key={item.id} className="w-full border-b border-gray-200 pb-8 mb-8">
                  <div className="flex gap-[64px] max-lg:flex-col mb-[48px]">
                    <div className="w-[500px] flex-shrink-0 max-md:w-full max-xl:w-[240px] max-lg:w-full">
                      <img 
                        src={imageUrl} 
                        alt={item.name} 
                        className="w-full object-cover rounded-[12px]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/menu/foodHovered.png';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-[8px] relative">
                        <div className="flex items-center justify-between">
                          <h2 className="custom-font font-[600] text-[28px] leading-[36px] text-[#010101] max-sm:text-[32px]">{item.name}</h2>
                          <i 
                            className="fas fa-trash text-[#D1D1D1] text-[20px] cursor-pointer hover:text-[#B20201] transition-colors duration-200" 
                            onClick={() => openDeleteModal(idx)}
                          ></i>
                        </div>
                        <p className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] mb-[28px]">{formatPrice(price)}</p>
                      </div>
                      
                      <div className="flex flex-col gap-[28px] mt-[8px] w-full">
                        <div className="flex flex-col gap-[4px] w-full">
                          <div className="flex justify-between items-center w-full">
                            <label className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">No' of portions:</label>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                className="focus:outline-none portion-btn"
                                onClick={() => updateItemQuantity(item.id, 'portions', -1)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span className="font-[700] custom-font text-[22px] leading-[32px] text-[#010101] w-[40px] text-center">{portions}</span>
                              <button 
                                type="button" 
                                className="focus:outline-none portion-btn"
                                onClick={() => updateItemQuantity(item.id, 'portions', 1)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-[4px] w-full">
                          <div className="flex justify-between items-center w-full">
                            <label className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">No' of plates:</label>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                className="focus:outline-none plate-btn"
                                onClick={() => updateItemQuantity(item.id, 'plates', -1)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span className="font-[700] custom-font text-[22px] leading-[32px] text-[#010101] w-[40px] text-center">{plates}</span>
                              <button 
                                type="button" 
                                className="focus:outline-none plate-btn"
                                onClick={() => updateItemQuantity(item.id, 'plates', 1)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-[4px] w-full">
                          <div className="flex justify-between items-center w-full">
                            <label className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">Portions per plate:</label>
                            <div className="flex items-center gap-2">
                              <button 
                                type="button" 
                                className="focus:outline-none ppp-btn"
                                onClick={() => updateItemQuantity(item.id, 'portionsPerPlate', -1)}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span className="font-[700] custom-font text-[22px] leading-[32px] text-[#010101] w-[40px] text-center">{portionsPerPlate}</span>
                              <button 
                                type="button" 
                                className="focus:outline-none ppp-btn"
                                onClick={() => updateItemQuantity(item.id, 'portionsPerPlate', 1)}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-[12px] mt-[24px] w-full">
                          <label className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">Special Instructions:</label>
                          <textarea 
                            className="border-[1px] border-[#D1D1D1] rounded-[12px] h-[120px] py-[12px] px-[20px] text-left align-top focus:outline-none text-[#010101] w-full resize-none"
                            value={specialInstructions}
                            onChange={(e) => updateSpecialInstructions(item.id, e.target.value)}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Delivery Type Selector */}
            <div className="flex flex-col gap-[4px] w-full mt-4 mb-8">
              <div className="flex justify-between items-center w-full gap-[16px] delivery-wrapper">
                <label htmlFor="deliveryTypeGlobal" className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px] whitespace-nowrap">
                  Delivery Type:
                </label>
                <div className="flex flex-col w-full max-w-[300px]">
                  {errors.deliveryType && (
                    <span className="text-red-500 text-sm mb-1">{errors.deliveryType}</span>
                  )}
                  <div className="relative w-full">
                    <select 
                      id="deliveryTypeGlobal"
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="appearance-none bg-[#F3F3F3] pr-[40px] pl-[24px] py-[12px] font-[600] custom-font rounded-[900px] focus:outline-none text-[#010101] w-full text-center cursor-pointer"
                    >
                      <option value="">Select Delivery Type</option>
                      <option value="express">Express</option>
                      <option value="normal">Normal</option>
                    </select>
                    <div className="pointer-events-none absolute top-1/2 right-[16px] transform -translate-y-1/2">
                      <span className="text-[#010101]">▼</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Total Summary & Delivery Location Section */}
        <section className="w-full mt-0 mb-[200px]">
          <div className="max-w-[1200px] mx-auto">
            {/* Order Total Summary */}
            <div className="mt-[48px]">
              <h2 className="custom-font font-[700] text-[28px] leading-[36px] text-[#010101] mb-[24px]">Order Total:</h2>
              <div className="flex flex-col gap-[24px] text-[22px] leading-[32px] custom-font text-[#4E4E4E] mb-[44px]">
                <div className="flex justify-between">
                  <span>Item Total:</span>
                  <span>{formatPrice(calculateItemTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{formatPrice(getDeliveryFee())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge:</span>
                  <span>{formatPrice(getServiceCharge())}</span>
                </div>
                <div className="flex justify-between font-[700] text-[#010101]">
                  <span>Total:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>

            {/* Delivery Location & Gift */}
            <div className="mt-[48px]">
              <h2 className="custom-font font-[700] text-[28px] leading-[36px] text-[#010101] mb-[24px]">Delivery Location & Gift:</h2>
              <div className="flex flex-col gap-[24px] mb-[44px]">
                {/* Delivery Location */}
                <div className="flex justify-between items-center w-full gap-[16px] delivery-wrapper">
                  <label htmlFor="deliveryLocation" className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px] whitespace-nowrap">
                    Delivery Location:
                  </label>
                  <div className="flex flex-col w-full max-w-[300px]">
                    {errors.deliveryLocation && (
                      <span className="text-red-500 text-sm mb-1">{errors.deliveryLocation}</span>
                    )}
                    <div className="relative w-full">
                      <select 
                        id="deliveryLocation"
                        value={deliveryLocation}
                        onChange={(e) => setDeliveryLocation(e.target.value)}
                        className="appearance-none bg-[#F3F3F3] pr-[40px] pl-[24px] py-[12px] font-[600] custom-font rounded-[900px] focus:outline-none text-[#010101] w-full text-center cursor-pointer"
                      >
                        <option value="">Select Location</option>
                        <option value="edc">EDC Hostel</option>
                        <option value="amethyst">Amethyst</option>
                        <option value="sst">SST</option>
                        <option value="smc">SMC</option>
                        <option value="coperative">Coperative</option>
                        <option value="faith">Faith</option>
                        <option value="pod">Pod Living</option>
                      </select>
                      <div className="pointer-events-none absolute top-1/2 right-[16px] transform -translate-y-1/2">
                        <span className="text-[#010101]">▼</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gift Option */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-[12px]">
                    <i className="fas fa-gift text-[#B20201]" style={{ fontSize: '28px', lineHeight: '1' }}></i>
                    <span className="custom-font text-[22px] font-semibold leading-[32px] text-[#010101]">Send as a gift</span>
                  </div>
                  <label className="cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="hidden" 
                    />
                    <i 
                      className={`fas fa-check-square`} 
                      style={{ 
                        fontSize: '28px', 
                        lineHeight: '1', 
                        color: isGift ? '#B20201' : '#D1D1D1' 
                      }}
                    ></i>
                  </label>
                </div>

                {/* Contact Info */}
                <div className="gap-[24px] mt-[24px] mb-0">
                  <h3 className="custom-font font-[700] text-[28px] leading-[36px] text-[#010101] mb-[24px]">Contact Info:</h3>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <label className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">Your WhatsApp Number:</label>
                      <div className="flex flex-col w-full md:w-[300px]">
                        <input 
                          type="tel" 
                          pattern="0[0-9]{10}" 
                          maxLength="11" 
                          inputMode="numeric"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                          className="border border-gray-300 rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-[#B20201] text-[#010101] font-[600] text-[22px] leading-[32px] custom-font w-full placeholder:text-gray-400 placeholder:font-normal placeholder:text-base placeholder:leading-normal"
                          placeholder="WhatsApp Number"
                        />
                        {errors.whatsappNumber && (
                          <span className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</span>
                        )}
                      </div>
                    </div>

                    {isGift && (
                      <div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                          <label className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">Recepient's Fullname:</label>
                          <div className="flex flex-col w-full md:w-[300px]">
                            <input 
                              type="text" 
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                              className="border border-gray-300 rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-[#B20201] text-[#010101] font-[600] text-[22px] leading-[32px] custom-font w-full placeholder:text-gray-400 placeholder:font-normal placeholder:text-base placeholder:leading-normal"
                              placeholder="Recepient's Fullname"
                            />
                            {errors.recipientName && (
                              <span className="text-red-500 text-sm mt-1">{errors.recipientName}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
                          <label className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">Recepient's Matric No:</label>
                          <div className="flex flex-col w-full md:w-[300px]">
                            <input 
                              type="text" 
                              pattern="[0-9]*" 
                              inputMode="numeric" 
                              maxLength="11"
                              value={recipientMatricNo}
                              onChange={(e) => setRecipientMatricNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))}
                              className="border border-gray-300 rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-[#B20201] text-[#010101] font-[600] text-[22px] leading-[32px] custom-font w-full placeholder:text-gray-400 placeholder:font-normal placeholder:text-base placeholder:leading-normal"
                              placeholder="Matric No'"
                            />
                            {errors.recipientMatricNo && (
                              <span className="text-red-500 text-sm mt-1">{errors.recipientMatricNo}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="w-full mt-0">
              <button 
                type="button" 
                onClick={handleSubmit}
                className="px-[24px] py-[12px] custom-font text-[20px] text-white w-full bg-[#B20201] font-[700] hover:bg-[#8B0101] transition-colors duration-200"
              >
                Make Payment
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-[12px] p-[32px] max-w-[400px] w-full mx-4">
            <h3 className="custom-font font-[600] text-[24px] text-[#010101] mb-[16px]">Remove Item</h3>
            <p className="custom-font text-[16px] text-[#4E4E4E] mb-[24px]">Are you sure you want to remove this item from your cart?</p>
            <div className="flex flex-col gap-[16px] items-center w-full">
              <button 
                onClick={closeDeleteModal}
                className="w-full whitespace-nowrap px-[24px] py-[12px] custom-font text-[16px] text-[#4E4E4E] border border-[#D1D1D1] rounded-[900px] hover:bg-[#F3F3F3] transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteItem}
                className="w-full whitespace-nowrap px-[24px] py-[12px] custom-font text-[16px] text-white bg-[#B20201] rounded-[900px] hover:bg-[#8B0101] transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .portion-btn i, .plate-btn i, .ppp-btn i {
          color: #D1D1D1;
          transition: color 0.2s;
          font-size: 28px;
        }
        .portion-btn:hover i, .portion-btn:active i,
        .plate-btn:hover i, .plate-btn:active i,
        .ppp-btn:hover i, .ppp-btn:active i {
          color: #B20201;
        }
        @media (max-width: 320px) {
          .delivery-wrapper {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Cart; 