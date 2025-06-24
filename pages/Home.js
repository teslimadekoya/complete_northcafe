import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { mealsAPI, dynamicDataAPI } from '../services/api';

const Home = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mealsAPI.getAll(searchTerm);
      if (response && response.data && response.data.length > 0) {
        setMeals(response.data);
        setFilteredMeals(response.data);
      } else {
        // Fallback to dynamic sample data - this can be updated from backend
        const sampleMeals = [
          { id: 1, name: 'Espresso', price: 500, image_url: '/images/menu/coffee1.png' },
          { id: 2, name: 'Cappuccino', price: 1000, image_url: '/images/menu/coffee2.png' },
          { id: 3, name: 'Iced Latte', price: 1500, image_url: '/images/menu/coffee3.png' },
          { id: 4, name: 'Cold Brew', price: 2000, image_url: '/images/menu/coffee4.png' },
          { id: 5, name: 'Croissant', price: 2500, image_url: '/images/menu/pastry1.png' },
          { id: 6, name: 'Chocolate Muffin', price: 3000, image_url: '/images/menu/pastry2.png' }
        ];
        
        // Try to get from dynamic data API first (for dynamic updates)
        const storedMeals = dynamicDataAPI.getSampleMeals();
        const dynamicMeals = storedMeals || sampleMeals;
        
        setMeals(dynamicMeals);
        setFilteredMeals(dynamicMeals);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      // Use dynamic sample data as fallback
      const sampleMeals = [
        { id: 1, name: 'Espresso', price: 500, image_url: '/images/menu/coffee1.png' },
        { id: 2, name: 'Cappuccino', price: 1000, image_url: '/images/menu/coffee2.png' },
        { id: 3, name: 'Iced Latte', price: 1500, image_url: '/images/menu/coffee3.png' },
        { id: 4, name: 'Cold Brew', price: 2000, image_url: '/images/menu/coffee4.png' },
        { id: 5, name: 'Croissant', price: 2500, image_url: '/images/menu/pastry1.png' },
        { id: 6, name: 'Chocolate Muffin', price: 3000, image_url: '/images/menu/pastry2.png' }
      ];
      
      // Try to get from dynamic data API first (for dynamic updates)
      const storedMeals = dynamicDataAPI.getSampleMeals();
      const dynamicMeals = storedMeals || sampleMeals;
      
      setMeals(dynamicMeals);
      setFilteredMeals(dynamicMeals);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  useEffect(() => {
    const filtered = meals.filter(meal => 
      meal.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    setFilteredMeals(filtered);
  }, [searchTerm, meals]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const goToAddPage = (mealId) => {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
      navigate(`/add/${mealId}`);
    }
  };

  const handleAddToCart = (meal) => {
    console.log('Adding meal to cart:', meal);
    addToCart(meal.id, 1, 1, 1, '', meal);
  };

  const formatPrice = (price) => {
    return `₦${Number(price).toLocaleString()}`;
  };

  return (
    <>
      {/* Main Content */}
      <main>
        <section id="menu" className="mx-[64px] max-md:mx-[16px]">
          <h1 className="text-[#010101] text-[48px] my-[32px] mt-[120px] text-center font-custom-font max-lg:my-[24px] max-md:my-[16px] max-sm:text-[40px] max-lg:mt-[100px] max-md:mt-[100px]">
            Menu
          </h1>
          
          {/* Search Bar */}
          <div className="relative w-full border pl-10 py-[8px] px-[24px] rounded-[900px] border-[#D1D1D1]">
            <img 
              src="/images/SearchIcon.svg" 
              alt="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-60" 
            />
            <input 
              type="search" 
              placeholder="Search for items..." 
              value={searchTerm}
              onChange={handleSearch}
              className="text-[] w-full focus:outline-none focus:ring-0 text-[16px] leading-[24px] text-[#010101] bg-transparent" 
            />
          </div>

          {/* Spacer */}
          <div className="h-[64px] max-md:h-[32px]"></div>

          {/* Food Grid */}
          <div className="grid grid-cols-3 gap-[128px] max-lg:grid-cols-2 max-lg:gap-[88px] max-md:grid-cols-1 max-md:gap-[44px] mb-[200px]">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-[#4E4E4E] custom-font">Loading menu...</p>
              </div>
            ) : filteredMeals.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-[#4E4E4E] custom-font">No meals found.</p>
              </div>
            ) : (
              filteredMeals.map(meal => {
                const imageUrl = meal.image || meal.image_url || '/images/menu/foodHovered.png';
                
                return (
                  <div key={meal.id} className="group flex flex-col items-center relative transition-all duration-200">
                    <div 
                      onClick={() => goToAddPage(meal.id)} 
                      style={{ cursor: 'pointer', width: '100%' }}
                    >
                      <img 
                        src={imageUrl} 
                        alt={meal.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/menu/foodHovered.png';
                        }}
                      />
                      <div className="flex flex-col items-center mt-8">
                        <p className="custom-font text-[22px] font-[700] text-center mb-[2px] text-[#010101]" style={{ cursor: 'pointer' }}>
                          {meal.name}
                        </p>
                        <p className="text-[#4E4E4E] custom-font text-center" style={{ cursor: 'pointer' }}>
                          {formatPrice(meal.price)}
                        </p>
                      </div>
                    </div>
                    <div 
                      className="add-to-cart flex items-center mt-2 cursor-pointer transition-all duration-200" 
                      onClick={() => handleAddToCart(meal)}
                    >
                      <img 
                        src="/images/add.svg" 
                        alt="Add to cart" 
                        className="add-to-cart-icon transition-all duration-200" 
                      />
                      <span className="custom-font text-[18px] text-[#B20201] font-[400] ml-2 add-to-cart-text transition-all duration-200">
                        Add to cart
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#F3F3F3]">
        <div className="flex justify-between p-[64px] max-md:p-[32px] max-md:flex-col">
          <nav>
            <h2 className="custom-font font-[400] text-[#010101] text-[36px] leading-[44px] mb-[24px] max-md:text-[32px]">
              Think Big. Start at North Café.
            </h2>
            <a 
              href="#careers" 
              className="px-[24px] py-[12px] text-[16px] text-white bg-[#B20201] font-[700] w-fit"
            >
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

export default Home; 