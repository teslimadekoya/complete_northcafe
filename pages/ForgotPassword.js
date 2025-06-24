import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email', 'reset'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowPassword(!showPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address (e.g., example@email.com).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'Please enter a new password.';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long for security.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match. Please make sure both passwords are identical.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmailForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      // Check if email exists in stored users
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const userExists = storedUsers.find(u => u.email === email);
      
      if (!userExists) {
        setSubmitError('No account found with this email address. Please check your email or sign up to create a new account.');
        return;
      }
      
      // Email exists, proceed to password reset step
      setStep('reset');
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setSubmitError('');

    try {
      // Update the password for the user with this email
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const userIndex = storedUsers.findIndex(u => u.email === email);
      
      if (userIndex !== -1) {
        storedUsers[userIndex].password = newPassword;
        localStorage.setItem('mock_users', JSON.stringify(storedUsers));
        
        setSuccess(true);
      } else {
        setSubmitError('Account not found. Please try again.');
      }
    } catch (error) {
      setSubmitError('An error occurred while resetting your password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex items-center justify-center mx-[64px] max-md:mx-[16px]" style={{ minHeight: 'calc(100vh - 128px)', marginTop: '128px' }}>
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <i className="fas fa-check-circle text-green-500 text-6xl"></i>
          </div>
          <h2 className="text-center text-[28px] leading-[36px] font-normal mb-[24px] custom-font">
            Password Reset Successful
          </h2>
          <p className="text-[16px] leading-[24px] text-[#4E4E4E] mb-[32px] custom-font">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Link 
            to="/login" 
            className="block w-full px-[24px] py-[12px] custom-font text-[20px] text-white bg-[#B20201] font-[700] hover:bg-[#8B0101] transition-colors duration-200"
          >
            Log In
          </Link>
        </div>
      </main>
    );
  }

  if (step === 'reset') {
    return (
      <main className="flex items-center justify-center mx-[64px] max-md:mx-[16px]" style={{ minHeight: 'calc(100vh - 128px)', marginTop: '128px' }}>
        <div className="w-full max-w-md">
          <h2 className="text-center text-[28px] leading-[36px] font-normal mb-[24px] custom-font">
            Reset Password
          </h2>
          <p className="text-center text-[16px] leading-[24px] text-[#4E4E4E] mb-[32px] custom-font">
            Enter a new password for <strong>{email}</strong>
          </p>

          <form onSubmit={handlePasswordReset}>
            {/* New Password */}
            <div className="flex flex-col mb-4">
              <label htmlFor="newPassword" className="text-[18px] leading-[28px] custom-font mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-[16px] top-[50%] -translate-y-[50%]"
                >
                  <img
                    src={showPassword ? "/images/Hide.svg" : "/images/See.svg"}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    className="w-5 h-5 cursor-pointer [filter:invert(28%)_sepia(0%)_saturate(0%)_hue-rotate(179deg)_brightness(97%)_contrast(85%)]"
                  />
                </button>
              </div>
              <p className="text-[12px] text-[#4E4E4E] mt-1 custom-font">
                Use at least 8 characters for security
              </p>
              {errors.newPassword && (
                <span className="text-red-500 text-sm mt-1 custom-font">
                  {errors.newPassword}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col mb-6">
              <label htmlFor="confirmPassword" className="text-[18px] leading-[28px] custom-font mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
                />
                <button 
                  type="button" 
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-[16px] top-[50%] -translate-y-[50%]"
                >
                  <img
                    src={showConfirmPassword ? "/images/Hide.svg" : "/images/See.svg"}
                    alt={showConfirmPassword ? "Hide Password" : "Show Password"}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="px-[24px] py-[12px] custom-font text-[20px] text-white bg-[#B20201] font-[700] w-full hover:bg-[#8B0101] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Error Message */}
            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center custom-font">
                {submitError}
              </div>
            )}
          </form>

          {/* Back to Email Step */}
          <div className="text-center">
            <button 
              onClick={() => setStep('email')}
              className="text-[#B20201] hover:underline custom-font font-[500] leading-[26px]"
            >
              Use Different Email
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center mx-[64px] max-md:mx-[16px]" style={{ minHeight: 'calc(100vh - 128px)', marginTop: '128px' }}>
      <div className="w-full max-w-md">
        <h2 className="text-center text-[28px] leading-[36px] font-normal mb-[24px] custom-font">
          Forgot Password
        </h2>
        <p className="text-center text-[16px] leading-[24px] text-[#4E4E4E] mb-[32px] custom-font">
          Enter your email address to reset your password.
        </p>

        <form onSubmit={handleEmailSubmit}>
          {/* Email */}
          <div className="flex flex-col mb-6">
            <label htmlFor="email" className="text-[18px] leading-[28px] custom-font mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              className="px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] focus:outline-none focus:ring-2 focus:ring-[#B20201] placeholder-[#4E4E4E] custom-font"
            />
            <p className="text-[12px] text-[#4E4E4E] mt-1 custom-font">
              We'll verify your email and let you set a new password
            </p>
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 custom-font">
                {errors.email}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="px-[24px] py-[12px] custom-font text-[20px] text-white bg-[#B20201] font-[700] w-full hover:bg-[#8B0101] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Continue'
            )}
          </button>

          {/* Error Message */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center custom-font">
              {submitError}
            </div>
          )}
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            to="/login" 
            className="text-[#B20201] hover:underline custom-font font-[500] leading-[26px]"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword; 