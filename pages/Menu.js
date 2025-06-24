import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { mealsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Search, Plus, Minus, ShoppingCart } from 'lucide-react';

const Menu = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState({});
  
  const { addToCart } = useCart();

  useEffect(() => {
    loadMeals();
  }, []);

  const filterMeals = useCallback(() => {
    let filtered = meals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(meal =>
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(meal => meal.category === selectedCategory);
    }

    setFilteredMeals(filtered);
  }, [meals, searchTerm, selectedCategory]);

  useEffect(() => {
    filterMeals();
  }, [filterMeals]);

  const loadMeals = async () => {
    try {
      const response = await mealsAPI.getAll();
      setMeals(response.data);
    } catch (error) {
      toast.error('Failed to load meals');
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    const categories = ['All', ...new Set(meals.map(meal => meal.category))];
    return categories;
  };

  const handleQuantityChange = (mealId, change) => {
    const currentQuantity = quantities[mealId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);
    
    setQuantities({
      ...quantities,
      [mealId]: newQuantity,
    });
  };

  const handleAddToCart = async (meal) => {
    const quantity = quantities[meal.id] || 1;
    if (quantity === 0) {
      toast.error('Please select a quantity');
      return;
    }

    try {
      const result = await addToCart(meal.id, quantity, 1, 1, '', meal);
      if (result.success) {
        toast.success(`${quantity}x ${meal.name} added to cart!`);
        setQuantities({
          ...quantities,
          [meal.id]: 0,
        });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-lg text-gray-600">
            Discover our delicious selection of meals
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {getCategories().map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Meals Grid */}
        {filteredMeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No meals found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMeals.map((meal) => (
              <div key={meal.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Meal Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {meal.image ? (
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Meal Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                    <span className="text-lg font-bold text-blue-600">₦{meal.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {meal.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {meal.category}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      meal.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {meal.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(meal.id, -1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {quantities[meal.id] || 0}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(meal.id, 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(meal)}
                      disabled={!meal.is_available || (quantities[meal.id] || 0) === 0}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;