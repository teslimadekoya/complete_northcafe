import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { mealsAPI, dynamicDataAPI } from '../services/api';

const AddToCart = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [meal, setMeal] = useState(null);
  const [portions, setPortions] = useState(0);
  const [plates, setPlates] = useState(0);
  const [portionsPerPlate, setPortionsPerPlate] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMeal = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mealsAPI.getById(mealId);
      if (response && response.data) {
        setMeal(response.data);
      } else {
        // Fallback to dynamic sample data - this can be updated from backend
        const sampleMeals = {
          1: { id: 1, name: 'Espresso', price: 500, image_url: '/images/menu/coffee1.png' },
          2: { id: 2, name: 'Cappuccino', price: 1000, image_url: '/images/menu/coffee2.png' },
          3: { id: 3, name: 'Iced Latte', price: 1500, image_url: '/images/menu/coffee3.png' },
          4: { id: 4, name: 'Cold Brew', price: 2000, image_url: '/images/menu/coffee4.png' },
          5: { id: 5, name: 'Croissant', price: 2500, image_url: '/images/menu/pastry1.png' },
          6: { id: 6, name: 'Chocolate Muffin', price: 3000, image_url: '/images/menu/pastry2.png' }
        };
        
        // Try to get from dynamic data API first (for dynamic updates)
        const storedMeals = dynamicDataAPI.getSampleMeals();
        const dynamicMeals = storedMeals || sampleMeals;
        
        setMeal(dynamicMeals[mealId] || dynamicMeals[1]);
      }
    } catch (error) {
      console.error('Error fetching meal:', error);
      // Use fallback data
      const sampleMeals = {
        1: { id: 1, name: 'Espresso', price: 500, image_url: '/images/menu/coffee1.png' },
        2: { id: 2, name: 'Cappuccino', price: 1000, image_url: '/images/menu/coffee2.png' },
        3: { id: 3, name: 'Iced Latte', price: 1500, image_url: '/images/menu/coffee3.png' },
        4: { id: 4, name: 'Cold Brew', price: 2000, image_url: '/images/menu/coffee4.png' },
        5: { id: 5, name: 'Croissant', price: 2500, image_url: '/images/menu/pastry1.png' },
        6: { id: 6, name: 'Chocolate Muffin', price: 3000, image_url: '/images/menu/pastry2.png' }
      };
      
      // Try to get from dynamic data API first (for dynamic updates)
      const storedMeals = dynamicDataAPI.getSampleMeals();
      const dynamicMeals = storedMeals || sampleMeals;
      
      setMeal(dynamicMeals[mealId] || dynamicMeals[1]);
    } finally {
      setLoading(false);
    }
  }, [mealId]);

  const calculateTotal = useCallback(() => {
    if (!meal) return;
    
    const price = Number(meal.price) || 0;
    let calculatedTotal = 0;
    
    if (portions > 0 || plates > 0) {
      calculatedTotal = (portions * price) + (plates * 150);
    }
    
    setTotal(calculatedTotal);
  }, [portions, plates, meal]);

  useEffect(() => {
    fetchMeal();
  }, [fetchMeal]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  const validateForm = () => {
    const newErrors = {};

    if (portions === 0) {
      newErrors.portions = 'Please select number of portions';
    }

    if (plates === 0) {
      newErrors.plates = 'Please select number of plates';
    }

    if (portionsPerPlate === 0) {
      newErrors.portionsPerPlate = 'Please select portions per plate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    addToCart(meal.id, portions, portionsPerPlate, plates, specialInstructions, meal);

    // Show toast
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/cart');
    }, 2000);
  };

  const formatPrice = (price) => {
    return `₦${Number(price).toLocaleString()}`;
  };

  const generateOptions = () => {
    const options = [];
    for (let i = 0; i <= 1000; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#4E4E4E] custom-font">Loading...</p>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#4E4E4E] custom-font">Meal not found</p>
      </div>
    );
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-[#B20201] text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg">
          Item added to cart!
        </div>
      )}

      {/* Main Content */}
      <section className="mx-[64px] py-[32px] max-md:mx-[16px] pt-[128px]">
        <div className="flex gap-[64px] max-lg:flex-col">
          <div className="w-[500px] flex-shrink-0 max-md:w-full max-xl:w-[240px] max-lg:w-full">
            <img 
              src={meal.image || meal.image_url || '/images/menu/foodHovered.png'} 
              alt={meal.name}
              className="w-full object-cover rounded-[12px]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/menu/foodHovered.png';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-[8px]">
              <h2 className="custom-font font-[700] text-[36px] leading-[44px] text-[#010101] max-sm:text-[32px]">
                {meal.name}
              </h2>
              <p className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] mb-[28px]">
                {formatPrice(meal.price)}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[28px] mt-[8px] w-full">
              <div className="flex flex-col gap-[4px] w-full">
                {errors.portions && (
                  <div className="text-red-500 text-[14px] mb-[8px] font-[500] custom-font">
                    {errors.portions}
                  </div>
                )}
                <div className="flex justify-between items-center gap-[16px] w-full">
                  <label htmlFor="numberSelect" className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px] flex-shrink-0">
                    No' of portions
                  </label>
                  <div className="relative">
                    <select 
                      id="numberSelect"
                      value={portions}
                      onChange={(e) => setPortions(Number(e.target.value))}
                      className="appearance-none bg-[#F3F3F3] px-[24px] py-[12px] font-[600] custom-font rounded-[900px] focus:outline-none text-[#010101] w-full"
                    >
                      {generateOptions()}
                    </select>
                    <div className="pointer-events-none absolute top-1/2 right-[16px] transform -translate-y-1/2 flex items-center space-x-[4px]">
                      <span className="text-[#010101]">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[4px] w-full">
                {errors.plates && (
                  <div className="text-red-500 text-[14px] mb-[8px] font-[500] custom-font">
                    {errors.plates}
                  </div>
                )}
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="platesSelect" className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px] flex-shrink-0">
                    No' of plates
                  </label>
                  <div className="relative">
                    <select 
                      id="platesSelect"
                      value={plates}
                      onChange={(e) => setPlates(Number(e.target.value))}
                      className="appearance-none bg-[#F3F3F3] px-[24px] py-[12px] font-[600] custom-font rounded-[900px] focus:outline-none text-[#010101] w-full"
                    >
                      {generateOptions()}
                    </select>
                    <div className="pointer-events-none absolute top-1/2 right-[16px] transform -translate-y-1/2 flex items-center space-x-[4px]">
                      <span className="text-[#010101]">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[4px] w-full">
                {errors.portionsPerPlate && (
                  <div className="text-red-500 text-[14px] mb-[8px] font-[500] custom-font">
                    {errors.portionsPerPlate}
                  </div>
                )}
                <div className="flex justify-between items-center gap-[16px] w-full">
                  <label htmlFor="portionsPerPlateSelect" className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px] flex-shrink-0">
                    Portions per plate
                  </label>
                  <div className="relative">
                    <select 
                      id="portionsPerPlateSelect"
                      value={portionsPerPlate}
                      onChange={(e) => setPortionsPerPlate(Number(e.target.value))}
                      className="appearance-none bg-[#F3F3F3] px-[24px] py-[12px] font-[600] custom-font rounded-[900px] focus:outline-none text-[#010101] w-full"
                    >
                      {generateOptions()}
                    </select>
                    <div className="pointer-events-none absolute top-1/2 right-[16px] transform -translate-y-1/2 flex items-center space-x-[4px]">
                      <span className="text-[#010101]">▼</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[12px] mt-[24px] w-full">
                <label htmlFor="specialInstructions" className="custom-font font-[400] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">
                  Special Instructions
                </label>
                <textarea
                  id="specialInstructions"
                  placeholder="Add any special instructions for this order, or leave blank if there's nothing to add."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="border-[1px] border-[#D1D1D1] rounded-[12px] h-[240px] py-[12px] px-[20px] text-left align-top focus:outline-none text-[#010101] w-full resize-none"
                />
              </div>

              <div className="flex justify-between items-center mt-[32px] w-full">
                <label className="custom-font font-[600] text-[22px] text-[#4E4E4E] leading-[32px] max-sm:text-[20px]">
                  Total:
                </label>
                <p className="custom-font font-[900] text-[22px] text-[#010101] leading-[32px] max-sm:text-[20px]">
                  {formatPrice(total)}
                </p>
              </div>

              <button 
                type="submit" 
                className="px-[24px] py-[12px] custom-font text-[20px] text-white w-full bg-[#B20201] font-[700] mt-[32px] hover:bg-[#8B0101] transition-colors duration-200"
              >
                Add to cart
              </button>
            </form>
            <div style={{ height: '200px' }}></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F3F3F3]">
        <div className="flex justify-between p-[64px] max-md:p-[32px] max-md:flex-col">
          <nav>
            <h2 className="custom-font font-[400] text-[#010101] text-[36px] leading-[44px] mb-[24px] max-md:text-[32px]">
              Think Big. Start at North Café.
            </h2>
            <a href="#careers" className="px-[24px] py-[12px] text-[16px] text-white bg-[#B20201] font-[700] w-fit">
              Send Resumé
            </a>
          </nav>
          <nav className="flex flex-col gap-[8px] max-md:mt-[28px]">
            <h3 className="font-[600] text-[14px] leading-[22px] text-[#010101] custom-font uppercase">
              COMPANY
            </h3>
            <a href="/" className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font footer-link">
              Menu
            </a>
            <a href="/about" className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font footer-link">
              About
            </a>
            <a href="#careers" className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font footer-link">
              Careers
            </a>
          </nav>
          <nav className="flex flex-col gap-[8px] max-md:mt-[28px]">
            <h3 className="font-[600] text-[14px] leading-[22px] text-[#010101] custom-font uppercase">
              SOCIALS
            </h3>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font footer-link"
            >
              LinkedIn
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font footer-link"
            >
              Youtube
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-[400] text-[14px] leading-[22px] text-[#4E4E4E] custom-font footer-link"
            >
              Instagram
            </a>
          </nav>
        </div>
        <div>
          <p className="font-[400] text-[14px] leading-[22px] text-[#010101] custom-font p-[32px] text-center">
            © 2025 North Café. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default AddToCart; 