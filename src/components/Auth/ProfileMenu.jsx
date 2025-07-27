import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthProvider';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiLogOut, FiSettings, FiSave, FiShield } = FiIcons;

const ProfileMenu = ({ onLogin }) => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    body_type: '',
    lung_capacity: '',
    instructor_mode: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize form data from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        gender: profile.gender || '',
        weight: profile.weight || '',
        height: profile.height || '',
        body_type: profile.body_type || '',
        lung_capacity: profile.lung_capacity || '',
        instructor_mode: profile.instructor_mode || false
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const { error } = await updateProfile({
        ...formData,
        weight: parseFloat(formData.weight) || null,
        height: parseFloat(formData.height) || null,
        lung_capacity: parseFloat(formData.lung_capacity) || null
      });
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // If not logged in, show login button
  if (!user) {
    return (
      <button
        onClick={onLogin}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        <SafeIcon icon={FiUser} className="mr-2" />
        Login
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        <SafeIcon icon={FiUser} className="mr-2" />
        {user.email?.split('@')[0] || 'Profile'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <SafeIcon icon={FiSettings} className="text-lg" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {message.text && (
              <div className={`p-3 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.text}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Weight in kg"
                      min="30"
                      max="150"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Height in cm"
                      min="120"
                      max="220"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Body Type
                  </label>
                  <select
                    name="body_type"
                    value={formData.body_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select body type</option>
                    <option value="lean">Lean/Athletic</option>
                    <option value="average">Average</option>
                    <option value="muscular">Muscular</option>
                    <option value="broad">Broad</option>
                    <option value="higher-fat">Above Average Body Fat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lung Capacity (liters)
                  </label>
                  <input
                    type="number"
                    name="lung_capacity"
                    value={formData.lung_capacity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Lung capacity"
                    min="3"
                    max="10"
                    step="0.1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="instructor_mode"
                    name="instructor_mode"
                    checked={formData.instructor_mode}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="instructor_mode" className="ml-2 block text-sm text-gray-900">
                    Enable Instructor Mode
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <SafeIcon icon={FiSave} className="mr-2" />
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {profile?.gender && (
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium">Gender:</div>
                      <div className="capitalize">{profile.gender}</div>
                    </div>
                  )}
                  
                  {profile?.body_type && (
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium">Body Type:</div>
                      <div className="capitalize">{profile.body_type}</div>
                    </div>
                  )}
                  
                  {profile?.weight && (
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium">Weight:</div>
                      <div>{profile.weight} kg</div>
                    </div>
                  )}
                  
                  {profile?.height && (
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium">Height:</div>
                      <div>{profile.height} cm</div>
                    </div>
                  )}
                  
                  {profile?.lung_capacity && (
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="font-medium">Lung Capacity:</div>
                      <div>{profile.lung_capacity}L</div>
                    </div>
                  )}
                </div>
                
                {profile?.instructor_mode && (
                  <div className="p-2 bg-purple-50 rounded flex items-center">
                    <SafeIcon icon={FiShield} className="text-purple-600 mr-2" />
                    <div className="text-purple-800">Instructor Mode Active</div>
                  </div>
                )}
                
                {(!profile?.gender || !profile?.weight || !profile?.height || !profile?.body_type) && (
                  <div className="p-2 bg-amber-50 text-amber-700 text-sm rounded">
                    Complete your profile to save your preferences for calculations.
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-gray-200 p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="mr-2" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMenu;