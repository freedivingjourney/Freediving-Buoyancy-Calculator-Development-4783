import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiGlobe, FiMapPin, FiThermometer, FiSun, FiDroplet, FiAlertTriangle, FiTarget, FiInfo, FiCompass, FiFlag, FiUsers } = FiIcons;

const LocationAnalytics = ({ data }) => {
  if (!data || !data.userLocation) return null;

  const { userLocation, regionalPreferences, nearbyDivingSites, localSafetyConsiderations, popularWaterTypes } = data;

  const getCountryFlag = (countryCode) => {
    // Return flag emoji based on country code
    const flagEmojis = {
      'PH': '🇵🇭', 'ID': '🇮🇩', 'TH': '🇹🇭', 'MY': '🇲🇾', 'SG': '🇸🇬',
      'AU': '🇦🇺', 'NZ': '🇳🇿', 'JP': '🇯🇵', 'KR': '🇰🇷', 'CN': '🇨🇳',
      'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'BR': '🇧🇷', 'AR': '🇦🇷',
      'GB': '🇬🇧', 'FR': '🇫🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'GR': '🇬🇷',
      'EG': '🇪🇬', 'ZA': '🇿🇦', 'KE': '🇰🇪', 'MG': '🇲🇬', 'MU': '🇲🇺',
      'DE': '🇩🇪', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹',
      'NO': '🇳🇴', 'SE': '🇸🇪', 'FI': '🇫🇮', 'DK': '🇩🇰', 'IS': '🇮🇸'
    };
    return flagEmojis[countryCode] || '🌍';
  };

  const getClimateDescription = (latitude) => {
    const absLat = Math.abs(latitude);
    if (absLat < 23.5) return { zone: 'Tropical', temp: 'Warm year-round', diving: 'Excellent year-round diving conditions' };
    if (absLat < 35) return { zone: 'Subtropical', temp: 'Mild winters, hot summers', diving: 'Good diving most of the year' };
    if (absLat < 50) return { zone: 'Temperate', temp: 'Four distinct seasons', diving: 'Seasonal diving conditions' };
    return { zone: 'Subarctic/Arctic', temp: 'Cold most of year', diving: 'Limited diving season, cold water gear required' };
  };

  const climate = userLocation.latitude ? getClimateDescription(userLocation.latitude) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <SafeIcon icon={FiGlobe} className="text-xl text-blue-600 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Location-Based Analytics</h3>
        <div className="ml-auto flex items-center text-sm text-gray-600">
          <span className="text-2xl mr-2">{getCountryFlag(userLocation.countryCode)}</span>
          <span>{userLocation.city}, {userLocation.country}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Overview */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <SafeIcon icon={FiMapPin} className="text-blue-600 mr-2" />
              <h4 className="font-semibold text-blue-900">Your Location</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Region:</span>
                <span className="font-medium">{userLocation.region}</span>
              </div>
              <div className="flex justify-between">
                <span>Timezone:</span>
                <span className="font-medium">{userLocation.timezone}</span>
              </div>
              {userLocation.latitude && userLocation.longitude && (
                <div className="flex justify-between">
                  <span>Coordinates:</span>
                  <span className="font-medium text-xs">
                    {userLocation.latitude.toFixed(2)}°, {userLocation.longitude.toFixed(2)}°
                  </span>
                </div>
              )}
            </div>
          </div>

          {climate && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <SafeIcon icon={FiThermometer} className="text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Climate Zone</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Zone:</span>
                  <span className="font-medium">{climate.zone}</span>
                </div>
                <div className="text-green-800">
                  <p className="mb-1">{climate.temp}</p>
                  <p className="text-xs">{climate.diving}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Regional Diving Preferences */}
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <SafeIcon icon={FiTarget} className="text-purple-600 mr-2" />
              <h4 className="font-semibold text-purple-900">Regional Preferences</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Common Wetsuit:</span>
                  <span className="font-medium">{regionalPreferences.avgWetsuitThickness.common}</span>
                </div>
                <div className="text-xs text-purple-700">
                  {regionalPreferences.avgWetsuitThickness.reason}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Water Type Distribution:</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${popularWaterTypes.saltwater * 100}%` }}
                      />
                    </div>
                    <span className="text-xs">Saltwater: {(popularWaterTypes.saltwater * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${popularWaterTypes.freshwater * 100}%` }}
                      />
                    </div>
                    <span className="text-xs">Freshwater: {(popularWaterTypes.freshwater * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <SafeIcon icon={FiSun} className="text-orange-600 mr-2" />
              <h4 className="font-semibold text-orange-900">Seasonal Information</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Current Season:</span>
                <span className="font-medium">{regionalPreferences.seasonalTrends.season}</span>
              </div>
              <div className="flex justify-between">
                <span>Activity Level:</span>
                <span className={`font-medium ${
                  regionalPreferences.seasonalTrends.activity === 'High' ? 'text-green-600' :
                  regionalPreferences.seasonalTrends.activity === 'Medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {regionalPreferences.seasonalTrends.activity}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Wetsuit Adjustment:</span>
                <span className="font-medium">{regionalPreferences.seasonalTrends.wetsuitAdjustment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Diving Sites */}
      <div className="mt-6 bg-cyan-50 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <SafeIcon icon={FiCompass} className="text-cyan-600 mr-2" />
          <h4 className="font-semibold text-cyan-900">Nearby Diving Sites</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-600 mb-1">
              {nearbyDivingSites.count}+
            </div>
            <div className="text-sm text-cyan-800">Estimated Sites</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm">
              <span className="font-medium text-cyan-900">Popular Locations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {nearbyDivingSites.famous.map((site, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-cyan-200 text-cyan-800 rounded-full text-xs"
                  >
                    {site}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local Safety Considerations */}
      {localSafetyConsiderations.length > 0 && (
        <div className="mt-6 bg-amber-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <SafeIcon icon={FiAlertTriangle} className="text-amber-600 mr-2" />
            <h4 className="font-semibold text-amber-900">Regional Safety Considerations</h4>
          </div>
          <div className="space-y-2">
            {localSafetyConsiderations.map((consideration, index) => (
              <div key={index} className="flex items-start">
                <SafeIcon icon={FiInfo} className="text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-amber-800">{consideration}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regional Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <SafeIcon icon={FiUsers} className="text-indigo-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-indigo-900">Local Users</div>
          <div className="text-lg font-bold text-indigo-600">{data.estimatedLocalUsers}+</div>
        </div>
        
        <div className="bg-teal-50 rounded-lg p-3 text-center">
          <SafeIcon icon={FiDroplet} className="text-teal-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-teal-900">Water Access</div>
          <div className="text-lg font-bold text-teal-600">
            {popularWaterTypes.saltwater > popularWaterTypes.freshwater ? 'Marine' : 'Freshwater'}
          </div>
        </div>
        
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <SafeIcon icon={FiThermometer} className="text-emerald-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-emerald-900">Avg Wetsuit</div>
          <div className="text-lg font-bold text-emerald-600">
            {regionalPreferences.avgWetsuitThickness.avg.toFixed(0)}mm
          </div>
        </div>
        
        <div className="bg-rose-50 rounded-lg p-3 text-center">
          <SafeIcon icon={FiFlag} className="text-rose-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-rose-900">Dive Season</div>
          <div className="text-lg font-bold text-rose-600">
            {regionalPreferences.seasonalTrends.activity}
          </div>
        </div>
      </div>

      {/* Location Privacy Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <SafeIcon icon={FiInfo} className="text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600">
            <strong>Privacy Notice:</strong> Location data is used solely for providing regional diving insights and safety recommendations. 
            No personal location information is stored or shared. Data is obtained from your IP address for analytical purposes only.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationAnalytics;