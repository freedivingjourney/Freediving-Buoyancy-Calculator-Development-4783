import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from './AuthProvider';

const { FiUser, FiLock, FiMail, FiAlertCircle, FiCheckCircle, FiX } = FiIcons;

const LoginModal = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    
    try {
      if (isLoginMode) {
        // Sign in
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Login successful!' });
        setTimeout(() => onClose(), 1000);
      } else {
        // Sign up
        const { data, error } = await signUp(email, password);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registration successful! You can now log in.' });
        setIsLoginMode(true);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Authentication failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isLoginMode ? 'Login to Your Account' : 'Create an Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>
        
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <div className="flex items-center">
              <SafeIcon icon={message.type === 'error' ? FiAlertCircle : FiCheckCircle} className="mr-2" />
              <p>{message.text}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiMail} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={isLoginMode ? "Your password" : "Choose a password"}
                required
                minLength={6}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors flex items-center justify-center`}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {isLoginMode ? 'Logging in...' : 'Creating account...'}
              </>
            ) : (
              <>
                <SafeIcon icon={FiUser} className="mr-2" />
                {isLoginMode ? 'Login' : 'Create Account'}
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setMessage({ type: '', text: '' });
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;