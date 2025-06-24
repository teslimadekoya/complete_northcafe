import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleCareersClick = (e) => {
    e.preventDefault();
    // If we're already on the about page, scroll to careers section
    if (location.pathname === '/about') {
      const careersSection = document.getElementById('careers');
      if (careersSection) {
        careersSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If we're on another page, navigate to about page and then scroll
      navigate('/about');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const careersSection = document.getElementById('careers');
        if (careersSection) {
          careersSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const handleAboutClick = (e) => {
    // If we're already on the about page, scroll to top
    if (location.pathname === '/about') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isOnAboutPage = () => {
    return location.pathname === '/about';
  };

  const getUserInitial = () => {
    if (user?.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserName = () => {
    if (user?.first_name) return user.first_name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-[64px] py-[32px] flex justify-between items-center max-md:px-[16px]">
        <nav>
          <Link to="/" className="logo text-[#B20201] font-[700] text-[36px] leading-[44px] dancing-script max-lg:text-[24px]">
            North Café
          </Link>
        </nav>

        <nav className="flex gap-[24px] items-center text-[16px] custom-font leading-[32px] max-lg:gap-[16px] max-md:hidden">
          <Link 
            to="/" 
            className={`text-[#4E4E4E] hover:text-[#010101] custom-font ${isActive('/') ? 'active' : ''}`}
          >
            Menu
          </Link>
          <Link 
            to="/about" 
            onClick={handleAboutClick}
            className={`text-[#4E4E4E] custom-font hover:text-[#010101] hover:font-[700] ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
          <button 
            onClick={handleCareersClick}
            className={`custom-font bg-none border-none cursor-pointer ${
              isOnAboutPage() 
                ? 'text-[#010101] font-[700]' 
                : 'text-[#4E4E4E] hover:text-[#010101] hover:font-[700]'
            }`}
          >
            Careers
          </button>
        </nav>

        <div className="flex items-center gap-[24px]">
          {/* Desktop Navigation */}
          <nav className="flex gap-[24px] items-center custom-font leading-[26px] max-md:hidden">
            {/* Cart Icon (Desktop Only) */}
            <button 
              onClick={handleCartClick}
              className="hidden md:flex relative"
            >
              <i className="fas fa-shopping-cart text-[20px] text-[#010101]"></i>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B20201] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>

            {/* Logged Out State */}
            {!user && (
              <div className="flex items-center gap-[24px]">
                <Link to="/login" className="text-[#B20201] text-[20px] font-[700] max-md:hidden custom-font">
                  Log In
                </Link>
                <Link to="/register" className="px-[24px] py-[12px] custom-font text-[20px] text-white bg-[#B20201] font-[700] max-md:hidden">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Logged In State */}
            {user && (
              <div className="flex items-center gap-[24px]">
                <div className="flex items-center gap-[8px] max-md:hidden relative">
                  <div className="w-[40px] h-[40px] rounded-full bg-[#B20201] flex items-center justify-center">
                    <span className="text-white text-[20px] font-[700]">{getUserInitial()}</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[#010101] text-[16px] font-[600] leading-tight">{getUserName()}</span>
                    <div className="flex items-center gap-[4px]">
                      <span 
                        className="text-green-800 text-[14px] font-[400] leading-tight cursor-pointer" 
                        onClick={toggleDropdown}
                      >
                        Manage Account
                      </span>
                      <span 
                        className="text-[#4E4E4E] text-[14px] cursor-pointer" 
                        onClick={toggleDropdown}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute top-[52px] right-0 w-fit whitespace-nowrap bg-white border border-[#D9D9D9] rounded-[16px] shadow-lg p-[16px] flex flex-col gap-[12px] z-50">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-[8px] text-[#4E4E4E] text-[16px] font-[500] hover:text-[#010101] hover:font-[600] transition-colors duration-200"
                      >
                        <i className="fas fa-user text-[16px]"></i>
                        <span>Profile</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-[8px] text-[#B20201] text-[16px] font-[500] hover:text-[#8B0101] hover:font-[600] transition-colors duration-200"
                      >
                        <i className="fas fa-sign-out-alt text-[16px]"></i>
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Icons - Always at the end */}
          <div className="md:hidden flex items-center justify-center gap-[16px]">
            <button onClick={handleCartClick} className="flex relative">
              <i className="fas fa-shopping-cart text-[#010101] text-[20px]"></i>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#B20201] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
            <button onClick={toggleMobileMenu} className="flex items-center justify-center">
              <i className="fas fa-bars text-[#010101] text-[20px] cursor-pointer"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full p-[32px]">
            {/* Close Button */}
            <div className="flex justify-end">
              <button onClick={toggleMobileMenu}>
                <i className="fas fa-times text-[32px]"></i>
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex flex-col items-center justify-center flex-1 gap-[28px] text-center">
              {/* Primary Links */}
              <Link 
                to="/" 
                className={`text-[#4E4E4E] text-[20px] font-[500] hover:font-[700] hover:text-[#010101] ${isActive('/') ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                Menu
              </Link>
              <Link 
                to="/about" 
                className={`text-[#4E4E4E] text-[20px] font-[500] hover:font-[700] hover:text-[#010101] ${isActive('/about') ? 'active' : ''}`}
                onClick={(e) => {
                  handleAboutClick(e);
                  toggleMobileMenu();
                }}
              >
                About
              </Link>
              <button 
                onClick={handleCareersClick}
                className={`text-[20px] font-[500] bg-none border-none cursor-pointer ${
                  isOnAboutPage() 
                    ? 'text-[#010101] font-[700]' 
                    : 'text-[#4E4E4E] hover:font-[700] hover:text-[#010101]'
                }`}
              >
                Careers
              </button>

              {/* Divider */}
              <div className="h-[1px] w-full bg-[#E5E5E5] my-[8px]"></div>

              {/* Logged Out Mobile Menu */}
              {!user && (
                <div className="flex flex-col items-center gap-[24px]">
                  <Link to="/login" className="text-[#B20201] text-[20px] font-[700]" onClick={toggleMobileMenu}>
                    Log In
                  </Link>
                  <Link to="/register" className="px-[24px] py-[12px] text-[20px] text-white bg-[#B20201] font-[700] w-fit" onClick={toggleMobileMenu}>
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Logged In Mobile Menu */}
              {user && (
                <div className="flex flex-col items-center">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-[12px] text-[#4E4E4E] text-[20px] font-[500] hover:text-[#010101] hover:font-[600] transition duration-200 mb-[24px]"
                    onClick={toggleMobileMenu}
                  >
                    <i className="fas fa-user text-[24px]"></i>
                    <span>Profile</span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="flex items-center gap-[12px] text-[#B20201] text-[20px] font-[500] hover:text-[#8B0101] hover:font-[600] transition duration-200"
                  >
                    <i className="fas fa-sign-out-alt text-[24px]"></i>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-[12px] p-[32px] max-w-[400px] w-full mx-4">
            <h3 className="custom-font font-[600] text-[24px] text-[#010101] mb-[16px]">Log out?</h3>
            <p className="custom-font text-[16px] text-[#4E4E4E] mb-[24px]">Are you sure you want to log out of your account?</p>
            <div className="flex flex-col gap-[16px] items-center w-full">
              <button 
                onClick={closeLogoutModal}
                className="w-full px-[24px] py-[12px] custom-font text-[16px] text-[#4E4E4E] border border-[#D1D1D1] rounded-[900px] hover:bg-[#F3F3F3] transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="w-full px-[24px] py-[12px] custom-font text-[16px] text-white bg-[#B20201] rounded-[900px] hover:bg-[#8B0101] transition-colors duration-200"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar; 