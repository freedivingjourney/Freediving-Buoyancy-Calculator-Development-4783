import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ProfileMenu from './Auth/ProfileMenu';
import LoginModal from './Auth/LoginModal';

const { FiActivity, FiDroplet, FiAward, FiHome } = FiIcons;

const Navigation = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Branding */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753616692915-434678667_122115304316249458_9210522229705513647_n.jpg"
              alt="Freediving Journey Logo"
              className="h-10 w-10 rounded-full object-cover border-2 border-blue-200"
            />
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiDroplet} className="text-xl text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-blue-900">Freediving Journey</h1>
                <p className="text-xs text-gray-600 -mt-1">Buoyancy Calculator</p>
              </div>
            </div>
          </Link>

          {/* Right side - Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <SafeIcon icon={FiHome} className="mr-2" />
              Home
            </Link>
            <Link
              to="/buoyancy"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <SafeIcon icon={FiActivity} className="mr-2" />
              Calculator
            </Link>
            
            {/* Profile Menu */}
            <ProfileMenu onLogin={() => setIsLoginModalOpen(true)} />
            
            <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-blue-50 rounded-lg">
              <SafeIcon icon={FiAward} className="text-blue-600" />
              <span>by Instructor Rogemar</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
};

export default Navigation;