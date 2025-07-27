import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiDroplet, FiUser } = FiIcons;

const Navigation = () => {
  return (
    <nav className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <SafeIcon icon={FiDroplet} className="text-2xl text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Freediving Nutrition & Buoyancy</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/buoyancy"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <SafeIcon icon={FiActivity} className="mr-2" />
              Buoyancy Calculator
            </Link>
            <div className="flex items-center px-3 py-2 text-sm text-gray-600">
              <SafeIcon icon={FiUser} className="mr-2" />
              Freediver
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;