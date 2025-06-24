import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  
  const { register } = useAuth();
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = 'Username is required to create your account.';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores.';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required to create your account.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., example@email.com).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required to secure your account.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long for security.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password to ensure it\'s correct.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please make sure both passwords are identical.';
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
    setRegisterError('');

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      if (result.success) {
        navigate('/');
      } else {
        setRegisterError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide specific, actionable error messages
      if (error.message.includes('User already exists')) {
        setRegisterError(
          'An account with this email or username already exists. ' +
          'Please try logging in instead, or use a different email/username.'
        );
      } else if (error.message.includes('already exists')) {
        setRegisterError(
          'An account with this email or username already exists. ' +
          'Please try logging in instead, or use a different email/username.'
        );
      } else if (error.message.includes('BACKEND_UNAVAILABLE')) {
        setRegisterError(
          'We\'re experiencing connection issues. ' +
          'Your account will be created locally. ' +
          'Please check your internet connection and try again later.'
        );
      } else if (error.message.includes('email')) {
        setRegisterError(
          'Please enter a valid email address. ' +
          'Make sure it includes an @ symbol and a domain (e.g., example@email.com).'
        );
      } else if (error.message.includes('username')) {
        setRegisterError(
          'Please choose a different username. ' +
          'Usernames must be at least 3 characters and can only contain letters, numbers, and underscores.'
        );
      } else if (error.message.includes('password')) {
        setRegisterError(
          'Please choose a stronger password. ' +
          'Passwords must be at least 6 characters long.'
        );
      } else {
        setRegisterError(
          'We encountered an unexpected error while creating your account. ' +
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
          Sign Up
        </h2>
        
        <p className="text-center text-[14px] text-[#4E4E4E] mb-[24px] custom-font">
          Create your account to start ordering delicious meals from North Café
        </p>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex flex-col mb-4">
            <label htmlFor="username" className="text-[18px] leading-[28px] custom-font mb-2">
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              className="px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
            />
            <p className="text-[12px] text-[#4E4E4E] mt-1 custom-font">
              Use 3+ characters, letters, numbers, and underscores only
            </p>
            {errors.username && (
              <span className="text-red-500 text-sm mt-1 custom-font">
                {errors.username}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col mb-4">
            <label htmlFor="email" className="text-[18px] leading-[28px] custom-font mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
            />
            <p className="text-[12px] text-[#4E4E4E] mt-1 custom-font">
              We'll use this to send you order confirmations
            </p>
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 custom-font">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col mb-4">
            <label htmlFor="password" className="text-[18px] leading-[28px] custom-font mb-2">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                className="w-full px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
              />
              <button 
                type="button" 
                onClick={togglePasswordVisibility}
                className="absolute right-[16px] top-[50%] -translate-y-[50%]"
              >
                <img 
                  src={showPassword ? "/images/Hide.svg" : "/images/See.svg"} 
                  alt="Show Password" 
                  className="w-5 h-5 cursor-pointer [filter:invert(28%)_sepia(0%)_saturate(0%)_hue-rotate(179deg)_brightness(97%)_contrast(85%)]" 
                />
              </button>
            </div>
            <p className="text-[12px] text-[#4E4E4E] mt-1 custom-font">
              Use at least 6 characters for security
            </p>
            {errors.password && (
              <span className="text-red-500 text-sm mt-1 custom-font">
                {errors.password}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col mb-6">
            <label htmlFor="confirmPassword" className="text-[18px] leading-[28px] custom-font mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id="confirmPassword" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
              />
              <button 
                type="button" 
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-[16px] top-[50%] -translate-y-[50%]"
              >
                <img 
                  src={showConfirmPassword ? "/images/Hide.svg" : "/images/See.svg"} 
                  alt="Show Password" 
                  className="w-5 h-5 cursor-pointer [filter:invert(28%)_sepia(0%)_saturate(0%)_hue-rotate(179deg)_brightness(97%)_contrast(85%)]" 
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1 custom-font">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Register Button */}
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
                Creating Account...
              </div>
            ) : (
              'Sign Up'
            )}
          </button>

          {/* Error Message */}
          {registerError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center custom-font">
              {registerError}
            </div>
          )}
        </form>

        {/* Already have an account */}
        <div className="text-center mt-[24px] mb-[28px] text-[16px] custom-font">
          <span>Already have an account?</span>
          <Link to="/login" className="text-[#B20201] font-[700] ml-1 hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Register; 