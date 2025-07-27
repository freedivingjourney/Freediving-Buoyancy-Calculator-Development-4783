import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiAlertTriangle, FiCheckCircle } = FiIcons;

const BMICard = ({ weight, height }) => {
  const calculateBMI = () => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { category: 'Obese', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  const getBuoyancyImpact = (bmi) => {
    if (bmi < 18.5) return 'May require less weight due to lower body fat';
    if (bmi < 25) return 'Typical buoyancy characteristics';
    if (bmi < 30) return 'May require additional weight for neutral buoyancy';
    return 'Significantly more weight may be needed';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl shadow-lg p-6 border-2 ${bmiInfo.border}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <SafeIcon icon={FiActivity} className="text-xl text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Body Mass Index</h3>
        </div>
        {bmi > 0 && (
          <SafeIcon 
            icon={bmi >= 18.5 && bmi < 30 ? FiCheckCircle : FiAlertTriangle} 
            className={`text-xl ${bmiInfo.color}`} 
          />
        )}
      </div>

      {bmi > 0 ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {bmi.toFixed(1)}
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bmiInfo.bg} ${bmiInfo.color}`}>
              {bmiInfo.category}
            </div>
          </div>

          <div className={`p-4 rounded-lg ${bmiInfo.bg} border ${bmiInfo.border}`}>
            <h4 className="font-medium text-gray-900 mb-2">Buoyancy Impact</h4>
            <p className="text-sm text-gray-700">
              {getBuoyancyImpact(bmi)}
            </p>
          </div>

          {(bmi < 18.5 || bmi >= 30) && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <SafeIcon icon={FiAlertTriangle} className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Atypical BMI Detected</p>
                  <p className="text-amber-700">
                    Consider consulting with a freediving instructor for personalized weight recommendations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <SafeIcon icon={FiActivity} className="text-4xl mx-auto mb-2 opacity-50" />
          <p>Enter weight and height to calculate BMI</p>
        </div>
      )}
    </motion.div>
  );
};

export default BMICard;