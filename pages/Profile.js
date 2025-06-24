import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser, updateCredentials } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    console.log('Profile component - current user:', user);
    console.log('Profile component - localStorage user_data:', localStorage.getItem('user_data'));
    console.log('Profile component - localStorage mock_users:', localStorage.getItem('mock_users'));

    // Don't pre-populate the fields - let users enter what they want to change
    setFormData({
      username: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePassword = (field) => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const getInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const validateForm = () => {
    setError('');
    setSuccess('');

    const { username, email, oldPassword, newPassword, confirmPassword } = formData;

    // Check if any field has been changed from its current value
    const currentUsername = user?.username || user?.email?.split('@')[0] || '';
    const currentEmail = user?.email || '';
    
    const isUpdatingUsername = username !== '' && username !== currentUsername;
    const isUpdatingEmail = email !== '' && email !== currentEmail;
    const isUpdatingPassword = newPassword !== '';

    console.log('Validation check:', {
      username,
      currentUsername,
      isUpdatingUsername,
      email,
      currentEmail,
      isUpdatingEmail,
      isUpdatingPassword,
      newPassword: newPassword ? '***' : '',
      confirmPassword: confirmPassword ? '***' : ''
    });

    // Validate username if changed
    if (isUpdatingUsername) {
      if (username.length < 3) {
        setError("Username must be at least 3 characters long.");
        return false;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError("Username can only contain letters, numbers, and underscores.");
        return false;
      }
    }

    // Validate email if changed
    if (isUpdatingEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    // Validate password if changed
    if (isUpdatingPassword) {
      if (!oldPassword) {
        setError("Please enter your current password to change it.");
        return false;
      }
      
      // Check if current password matches the stored password
      const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const currentUser = storedUsers.find(u => u.email === user.email || u.username === user.username);
      
      if (currentUser && currentUser.password !== oldPassword) {
        setError("Current password is incorrect. Please enter the password you use to log in.");
        return false;
      }
      
      if (newPassword.length < 8) {
        setError("New password must be at least 8 characters long.");
        return false;
      }
      if (newPassword === oldPassword) {
        setError("New password cannot be the same as your current password.");
        return false;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        return false;
      }
    }

    // Check if any field is being updated
    if (!isUpdatingUsername && !isUpdatingEmail && !isUpdatingPassword) {
      setError("No changes detected. Please modify at least one field to update.");
      return false;
    }

    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { username, email, oldPassword, newPassword } = formData;
      
      // Create update data object with only the changed fields
      const updateData = {};
      
      const currentUsername = user?.username || user?.email?.split('@')[0] || '';
      const currentEmail = user?.email || '';
      
      if (username !== '' && username !== currentUsername) {
        updateData.username = username;
      }
      
      if (email !== '' && email !== currentEmail) {
        updateData.email = email;
      }
      
      if (newPassword !== '') {
        updateData.old_password = oldPassword;
        updateData.new_password = newPassword;
      }

      console.log('Update data:', updateData);

      // Make the actual API call to update profile
      const response = await authAPI.updateProfile(updateData);
      
      if (response.data && response.data.user) {
        // Update the user context with the new data
        updateUser(response.data.user);
        
        // Update all localStorage keys that might contain user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        
        // Update stored credentials for any changed fields
        const credentialsToUpdate = {};
        if (username !== '' && username !== (user?.username || user?.email?.split('@')[0])) {
          credentialsToUpdate.username = username;
        }
        if (email !== '' && email !== user?.email) {
          credentialsToUpdate.email = email;
        }
        if (newPassword !== '') {
          credentialsToUpdate.password = newPassword;
        }
        
        if (Object.keys(credentialsToUpdate).length > 0) {
          updateCredentials(user.id, credentialsToUpdate);
        }
        
        setSuccess('Profile updated successfully!');
        
        // Clear password fields if password was updated
        if (newPassword !== '') {
          setFormData(prev => ({
            ...prev,
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        }
      } else {
        setSuccess('Profile updated successfully!');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        setError('Authentication failed. Please try again or log in again.');
        // Don't automatically redirect - let user decide what to do
        return;
      }
      
      // For other API errors, try fallback to localStorage
      try {
        const { username, email } = formData;
        const updatedUser = { ...user };
        
        const currentUsername = user?.username || user?.email?.split('@')[0] || '';
        const currentEmail = user?.email || '';
        
        if (username !== '' && username !== currentUsername) {
          updatedUser.username = username;
        }
        
        if (email !== '' && email !== currentEmail) {
          updatedUser.email = email;
        }
        
        console.log('Fallback update - updatedUser:', updatedUser);
        
        // Update user context and all localStorage keys
        updateUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        
        // Update stored credentials for any changed fields
        const credentialsToUpdate = {};
        if (username !== '' && username !== currentUsername) {
          credentialsToUpdate.username = username;
        }
        if (email !== '' && email !== currentEmail) {
          credentialsToUpdate.email = email;
        }
        if (formData.newPassword !== '') {
          credentialsToUpdate.password = formData.newPassword;
        }
        
        console.log('Fallback credentials to update:', credentialsToUpdate);
        
        if (Object.keys(credentialsToUpdate).length > 0) {
          updateCredentials(user.id, credentialsToUpdate);
        }
        
        setSuccess('Profile updated successfully! Your changes have been saved locally and will be visible throughout the app.');
        
        // Clear password fields if password was updated
        if (formData.newPassword !== '') {
          setFormData(prev => ({
            ...prev,
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setError('Failed to save profile changes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <main className="flex items-center justify-center px-[64px] max-md:px-[16px] mt-[160px] max-sm:mt-[120px] mb-[64px]">
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="custom-font font-[700] text-[28px] leading-[36px] text-[#010101] mb-[24px]">Profile</h2>
                
          {/* Avatar */}
          <div className="mb-4 w-full flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full bg-[#B20201] flex items-center justify-center mb-2"
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: user.profile_image ? `url(${user.profile_image})` : ''
              }}
            >
              {!user.profile_image && (
                <span className="text-white text-3xl font-bold">{getInitial()}</span>
              )}
                    </div>
                  </div>

          {/* Username */}
          <div className="mb-4 w-full">
            <label htmlFor="username" className="text-[18px] leading-[28px]">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder={`Current: ${user?.username || user?.email?.split('@')[0] || 'Not set'}`}
              className="w-full mt-[8px] px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] bg-gray-100" 
            />
            <p className="text-[14px] text-[#4E4E4E] mt-[4px]">Enter new username to update</p>
          </div>

          {/* Email */}
          <div className="mb-4 w-full">
            <label htmlFor="email" className="text-[18px] leading-[28px]">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={`Current: ${user?.email || 'Not set'}`}
              className="w-full mt-[8px] px-[24px] py-[12px] rounded-[12px] border border-[#D1D1D1] bg-gray-100" 
            />
            <p className="text-[14px] text-[#4E4E4E] mt-[4px]">Enter new email to update</p>
          </div>

          {/* Old Password */}
          <div className="mb-4 w-full">
            <label htmlFor="oldPassword" className="text-[18px] leading-[28px]">Current Password</label>
            <div className="relative">
              <input 
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                placeholder="Enter your current password"
                value={formData.oldPassword}
                onChange={handleInputChange}
                className="w-full mt-[8px] px-[24px] py-[12px] rounded-[12px] border bg-gray-100" 
              />
              <button 
                type="button" 
                onClick={() => togglePassword('old')}
                className="absolute right-[16px] top-[50%] -translate-y-[50%]"
              >
                <img 
                  src={showOldPassword ? "/images/Hide.svg" : "/images/See.svg"} 
                  alt={showOldPassword ? "Hide Password" : "Show Password"} 
                  className="w-5 h-5 cursor-pointer" 
                />
              </button>
            </div>
            <p className="text-[14px] text-[#4E4E4E] mt-[4px]">Required only if changing password</p>
          </div>

          {/* New Password */}
          <div className="mb-4 w-full">
            <label htmlFor="newPassword" className="text-[18px] leading-[28px]">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full mt-[8px] px-[24px] py-[12px] rounded-[12px] border bg-gray-100" 
              />
              <button 
                type="button" 
                onClick={() => togglePassword('new')}
                className="absolute right-[16px] top-[50%] -translate-y-[50%]"
              >
                <img 
                  src={showNewPassword ? "/images/Hide.svg" : "/images/See.svg"} 
                  alt={showNewPassword ? "Hide Password" : "Show Password"} 
                  className="w-5 h-5 cursor-pointer" 
                />
              </button>
            </div>
            <p className="text-[14px] text-[#4E4E4E] mt-[4px]">Enter new password to update</p>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 w-full">
            <label htmlFor="confirmPassword" className="text-[18px] leading-[28px]">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full mt-[8px] px-[24px] py-[12px] rounded-[12px] border bg-gray-100" 
              />
              <button
                type="button" 
                onClick={() => togglePassword('confirm')}
                className="absolute right-[16px] top-[50%] -translate-y-[50%]"
              >
                <img 
                  src={showConfirmPassword ? "/images/Hide.svg" : "/images/See.svg"} 
                  alt={showConfirmPassword ? "Hide Password" : "Show Password"} 
                  className="w-5 h-5 cursor-pointer" 
                />
              </button>
            </div>
            <p className="text-[14px] text-[#4E4E4E] mt-[4px]">Required only if changing password</p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="text-red-600 text-[14px] font-medium mb-[16px] bg-red-50 p-[12px] rounded-[8px] border border-red-200 w-full">
              {error}
            </div>
          )}
          
          {success && (
            <div className="text-green-600 text-[14px] font-medium mb-[16px] bg-green-50 p-[12px] rounded-[8px] border border-green-200 w-full">
              {success}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end w-full">
            <button 
              onClick={handleSaveChanges}
              disabled={loading}
              className="w-full py-[12px] text-[16px] text-white bg-[#B20201] font-[700] text-center hover:bg-[#900000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile; 