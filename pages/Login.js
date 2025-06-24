import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Please enter your email address to log in.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., example@email.com).';
    }

    if (!formData.password) {
      newErrors.password = 'Please enter your password to log in.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setLoginError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide specific, actionable error messages
      if (error.message.includes('No users registered yet')) {
        setLoginError(
          'No account found. Please sign up to create your account first. ' +
          'Click "Sign Up" below to get started.'
        );
      } else if (error.message.includes('EMAIL_NOT_FOUND')) {
        setLoginError(
          'No account found with this email address. ' +
          'Please check your email or sign up to create a new account.'
        );
      } else if (error.message.includes('PASSWORD_INCORRECT')) {
        setLoginError(
          'The password you entered is incorrect. ' +
          'Please try again or click "Forgot Password?" to reset your password.'
        );
      } else if (error.message.includes('Invalid email or password')) {
        setLoginError(
          'The email or password you entered is incorrect. ' +
          'Please check your credentials and try again. ' +
          'If you forgot your password, click "Forgot Password?" above.'
        );
      } else if (error.message.includes('BACKEND_UNAVAILABLE')) {
        setLoginError(
          'We\'re experiencing connection issues. ' +
          'Please check your internet connection and try again. ' +
          'If the problem persists, try again in a few minutes.'
        );
      } else if (error.message.includes('Email not found')) {
        setLoginError(
          'No account found with this email address. ' +
          'Please check your email or sign up to create a new account.'
        );
      } else if (error.message.includes('Invalid credentials')) {
        setLoginError(
          'The email or password you entered is incorrect. ' +
          'Please double-check your credentials and try again.'
        );
      } else {
        setLoginError(
          'We encountered an unexpected error. ' +
          'Please try again, or contact support if the problem continues.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center mx-[64px] max-md:mx-[16px]" style={{ minHeight: 'calc(100vh - 128px)', marginTop: '128px' }}>
      <div className="w-full max-w-md">
        <h2 className="text-center text-[28px] leading-[36px] font-normal mb-[24px] custom-font">
          Log In
        </h2>
        
        <p className="text-center text-[14px] text-[#4E4E4E] mb-[24px] custom-font">
          Welcome back! Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="text-[18px] leading-[28px] custom-font">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="mt-[8px] px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 custom-font">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="text-[18px] leading-[28px] custom-font">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full mt-[8px] px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="absolute right-[16px] top-[50%] -translate-y-[50%]"
              >
                <img
                  src={showPassword ? "/images/Hide.svg" : "/images/See.svg"}
                  alt={showPassword ? "Hide Password" : "Show Password"}
                  className="w-5 h-5 mt-[8px] cursor-pointer [filter:invert(28%)_sepia(0%)_saturate(0%)_hue-rotate(179deg)_brightness(97%)_contrast(85%)]"
                />
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm mt-1 custom-font">
                {errors.password}
              </span>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right text-sm mb-4">
            <Link 
              to="/forgot-password" 
              className="text-[#B20201] hover:underline custom-font font-[500] leading-[26px]"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="px-[24px] py-[12px] custom-font text-[20px] text-white bg-[#B20201] font-[700] w-full hover:bg-[#8B0101] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </div>
            ) : (
              'Log In'
            )}
          </button>

          {/* Error Message */}
          {loginError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center custom-font">
              {loginError}
            </div>
          )}
        </form>

        {/* Already have an account */}
        <div className="text-center mt-[24px] mb-[28px] text-[16px] custom-font">
          <span>Don't have an account?</span>
          <Link to="/register" className="text-[#B20201] font-[700] ml-1 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login; 