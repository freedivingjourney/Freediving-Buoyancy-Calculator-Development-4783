import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BuoyancyInputs from './BuoyancyInputs';
import BuoyancyResults from './BuoyancyResults';
import BMICard from './BMICard';
import BuoyancyGauge from './BuoyancyGauge';
import HistoryTracking from './HistoryTracking';
import InstructorMode from './InstructorMode';
import Analytics from './Analytics';
import { calculateBuoyancy } from '../utils/buoyancyCalculations';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from './Auth/AuthProvider';

const { FiAlertTriangle, FiInfo, FiBarChart3, FiWind } = FiIcons;

const BuoyancyCalculator = () => {
  const { user, profile } = useAuth();
  const [userInputs, setUserInputs] = useState({
    weight: 72,
    height: 173,
    gender: 'male',
    bodyType: 'average',
    wetsuitThickness: 2,
    weightBelt: 2,
    weightBeltUnit: 'kg',
    neckWeight: 0,
    neckWeightUnit: 'kg',
    waterType: 'saltwater',
    targetDepth: 11,
    lungCapacity: 5.0,
    // New advanced buoyancy options
    useCustomNeutralDepth: false,
    customNeutralDepth: 15,
    neutralBuoyancyPreference: 'neutral',
    useDeepDivingOptimization: false,
    deepDivingProfile: 'constant-weight'
  });
  const [results, setResults] = useState(null);
  const [instructorMode, setInstructorMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' or 'analytics'

  // Load user profile data when available
  useEffect(() => {
    if (profile) {
      // Update inputs with profile data if available
      const updatedInputs = { ...userInputs };
      if (profile.gender) updatedInputs.gender = profile.gender;
      if (profile.weight) updatedInputs.weight = profile.weight;
      if (profile.height) updatedInputs.height = profile.height;
      if (profile.body_type) updatedInputs.bodyType = profile.body_type;
      if (profile.lung_capacity) updatedInputs.lungCapacity = profile.lung_capacity;
      
      // Set instructor mode based on profile
      if (profile.instructor_mode !== undefined) {
        setInstructorMode(profile.instructor_mode);
      }
      
      setUserInputs(updatedInputs);
    }
  }, [profile]);

  useEffect(() => {
    const newLungCapacity = calculateDefaultLungCapacity(userInputs.gender, userInputs.bodyType);
    setUserInputs(prev => ({ ...prev, lungCapacity: newLungCapacity }));
  }, [userInputs.gender, userInputs.bodyType]);

  useEffect(() => {
    const calculatedResults = calculateBuoyancy(userInputs);
    setResults(calculatedResults);
  }, [userInputs]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('freediving-calculator-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('freediving-calculator-history', JSON.stringify(history));
  }, [history]);

  const calculateDefaultLungCapacity = (gender, bodyType) => {
    if (gender === 'male') {
      switch (bodyType) {
        case 'lean':
          return 6.5;
        case 'muscular':
          return 6.3;
        case 'broad':
          return 6.8;
        case 'higher-fat':
          return 5.8;
        default:
          return 6.0;
      }
    } else {
      switch (bodyType) {
        case 'lean':
          return 5.0;
        case 'muscular':
          return 4.8;
        case 'broad':
          return 5.0;
        case 'higher-fat':
          return 4.2;
        default:
          return 4.5;
      }
    }
  };

  const handleInputChange = (field, value) => {
    setUserInputs(prev => ({ ...prev, [field]: value }));
  };

  const saveToHistory = () => {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      inputs: { ...userInputs },
      results: { ...results }
    };
    setHistory(prev => [entry, ...prev.slice(0, 9)]);
  };
  
  const handleHistoryLoaded = (loadedHistory) => {
    // Only replace if we have new history
    if (loadedHistory && loadedHistory.length > 0) {
      setHistory(loadedHistory);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Freediving Buoyancy Calculator
            </h1>
            <p className="text-lg text-gray-600">
              Calculate ballast weight for your target neutral buoyancy depth
            </p>
          </div>
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'calculator'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <SafeIcon icon={FiBarChart3} className="mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Development Disclaimer */}
        <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <SafeIcon
              icon={FiAlertTriangle}
              className="text-amber-600 text-xl mt-0.5 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Planning Tool Disclaimer</h3>
              <p className="text-sm text-amber-800 mb-2">
                This application serves as a <strong>planning and educational tool</strong> to help
                you understand buoyancy factors and prepare for your dive. The calculations provide{' '}
                <strong>general guidance for preparation</strong> but should not be considered as
                precise measurements due to variable factors including individual body composition,
                water conditions, equipment variations, and personal breathing patterns.
              </p>
              <p className="text-sm text-amber-800 mt-2 font-medium">
                <strong>
                  Always conduct proper in-water testing and work with a certified freediving
                  instructor for actual weight adjustments.
                </strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          <strong>Enhanced Guidance:</strong> This calculator provides baseline ballast weight
          recommendations (1kg per 1mm wetsuit thickness) and targets neutral buoyancy at appropriate
          depths based on water type and individual factors.{' '}
          <strong>Always conduct in-water testing</strong> and adjust based on personal buoyancy,
          water salinity, and body composition variations.
        </div>

        {/* Air Consumption Limitation Notice */}
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <div className="flex items-start space-x-2">
            <SafeIcon icon={FiWind} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Important Limitation:</strong> This calculator does{' '}
              <strong>not consider air consumption</strong> during the dive. Individual breathing
              patterns, air consumption rates, and progressive lung volume changes throughout the
              dive significantly affect buoyancy and are not factored into these calculations.
            </div>
          </div>
        </div>
      </motion.div>

      {activeTab === 'calculator' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="xl:col-span-1"
          >
            <div className="space-y-6">
              <BMICard weight={userInputs.weight} height={userInputs.height} />
              <BuoyancyInputs
                inputs={userInputs}
                onChange={handleInputChange}
                calculateDefaultLungCapacity={calculateDefaultLungCapacity}
              />
              {instructorMode && (
                <InstructorMode inputs={userInputs} onChange={handleInputChange} results={results} />
              )}
            </div>
          </motion.div>

          {/* Center Column - Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-1"
          >
            <div className="space-y-6">
              <BuoyancyGauge results={results} />
              <BuoyancyResults
                results={results}
                onSave={saveToHistory}
                instructorMode={instructorMode}
                onToggleInstructor={() => setInstructorMode(!instructorMode)}
              />
            </div>
          </motion.div>

          {/* Right Column - History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="xl:col-span-1"
          >
            <HistoryTracking history={history} onHistoryLoaded={handleHistoryLoaded} />
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Analytics history={history} />
        </motion.div>
      )}

      {/* Footer Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-12 p-6 bg-gray-50 border border-gray-200 rounded-xl"
      >
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiInfo} className="text-gray-600 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Important Safety Information</h4>
            <p className="text-sm text-gray-700 mb-2">
              This buoyancy calculator is a development tool created by <strong>Instructor Rogemar</strong>{' '}
              from <strong>Freediving Journey Academy</strong> to assist in dive planning. While
              based on empirical data and established freediving principles, it should not replace
              proper training, in-water testing, and professional instruction.
            </p>
            <p className="text-sm text-gray-700 font-medium mb-3">
              For comprehensive freediving education, certification courses, and personalized
              buoyancy consultations, visit{' '}
              <a
                href="https://www.freedivingjourney.com"
                className="text-blue-600 hover:text-blue-800"
              >
                www.freedivingjourney.com
              </a>{' '}
              or contact us at{' '}
              <a
                href="mailto:hello@freedivingjourney.com"
                className="text-blue-600 hover:text-blue-800"
              >
                hello@freedivingjourney.com
              </a>
            </p>
            
            {/* Additional Disclaimers */}
            <div className="border-t pt-3 mt-3 space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Air Consumption:</strong> Individual air consumption rates during dives are
                not considered in these calculations and significantly affect actual buoyancy.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Global Access:</strong> This tool is provided free of charge to the
                worldwide freediving community for educational purposes.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Location Data:</strong> IP-based location information is used solely for
                providing regional diving insights and is not stored permanently.
              </p>
              
              {/* User account info */}
              {user && (
                <p className="text-sm text-blue-600">
                  <strong>Account:</strong> You're logged in as {user.email}. Your calculations will be saved to your account.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BuoyancyCalculator;