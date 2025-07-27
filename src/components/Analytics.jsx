import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, subDays, subMonths, parseISO } from 'date-fns';
import AnalyticsCharts from './AnalyticsCharts';
import UserBehaviorAnalytics from './UserBehaviorAnalytics';
import CalculationTrends from './CalculationTrends';
import SafetyMetrics from './SafetyMetrics';
import LocationAnalytics from './LocationAnalytics';

const { FiBarChart3, FiTrendingUp, FiUsers, FiTarget, FiAlertTriangle, FiDownload, FiFilter, FiCalendar, FiPieChart, FiActivity, FiShield, FiSettings, FiRefreshCw, FiGlobe, FiMapPin } = FiIcons;

const Analytics = ({ history, onExport }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('calculations');
  const [filterBy, setFilterBy] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    generateAnalyticsData();
    fetchLocationData();
  }, [history, timeRange, filterBy]);

  const fetchLocationData = async () => {
    try {
      // Get user's location from IP (free service)
      const response = await fetch('https://ipapi.co/json/');
      const locationInfo = await response.json();
      
      setLocationData({
        country: locationInfo.country_name,
        countryCode: locationInfo.country_code,
        region: locationInfo.region,
        city: locationInfo.city,
        latitude: locationInfo.latitude,
        longitude: locationInfo.longitude,
        timezone: locationInfo.timezone,
        currency: locationInfo.currency,
        languages: locationInfo.languages
      });
    } catch (error) {
      console.log('Location detection not available');
      setLocationData({
        country: 'Unknown',
        countryCode: 'XX',
        region: 'Unknown',
        city: 'Unknown',
        latitude: null,
        longitude: null,
        timezone: 'UTC',
        currency: 'USD',
        languages: 'en'
      });
    }
  };

  const generateAnalyticsData = () => {
    setIsLoading(true);
    
    // Filter data based on time range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7);
        break;
      case '30d':
        startDate = subDays(now, 30);
        break;
      case '90d':
        startDate = subDays(now, 90);
        break;
      case '1y':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subDays(now, 30);
    }

    const filteredHistory = history.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate;
    });

    // Generate comprehensive analytics with location data
    const analytics = {
      overview: generateOverviewMetrics(filteredHistory),
      trends: generateTrendAnalysis(filteredHistory),
      userBehavior: generateUserBehaviorMetrics(filteredHistory),
      safety: generateSafetyMetrics(filteredHistory),
      equipment: generateEquipmentAnalytics(filteredHistory),
      performance: generatePerformanceMetrics(filteredHistory),
      predictions: generatePredictiveAnalytics(filteredHistory),
      location: generateLocationAnalytics(filteredHistory, locationData)
    };

    setAnalyticsData(analytics);
    setIsLoading(false);
  };

  const generateLocationAnalytics = (data, locationInfo) => {
    if (!locationInfo) return null;

    // Simulate location-based analytics (in a real app, this would come from stored user data)
    const locationStats = {
      userLocation: locationInfo,
      estimatedLocalUsers: Math.floor(Math.random() * 500) + 100, // Simulated local user count
      popularWaterTypes: {
        // Estimate based on location
        saltwater: locationInfo.country === 'Philippines' || locationInfo.country === 'Indonesia' || 
                  locationInfo.country === 'Thailand' || locationInfo.country === 'Australia' ? 0.8 : 0.4,
        freshwater: locationInfo.country === 'Switzerland' || locationInfo.country === 'Canada' || 
                   locationInfo.country === 'Finland' ? 0.7 : 0.3
      },
      regionalPreferences: {
        avgWetsuitThickness: getRegionalWetsuitPreference(locationInfo),
        commonBodyTypes: getRegionalBodyTypeDistribution(locationInfo),
        seasonalTrends: getSeasonalTrends(locationInfo)
      },
      nearbyDivingSites: estimateNearbyDivingSites(locationInfo),
      localSafetyConsiderations: getLocalSafetyConsiderations(locationInfo)
    };

    return locationStats;
  };

  const getRegionalWetsuitPreference = (locationInfo) => {
    const { country, latitude } = locationInfo;
    
    // Tropical regions (closer to equator)
    if (Math.abs(latitude) < 25) {
      return { avg: 1.5, common: '1-2mm', reason: 'Tropical waters' };
    }
    // Temperate regions
    else if (Math.abs(latitude) < 50) {
      return { avg: 3.5, common: '3-5mm', reason: 'Temperate waters' };
    }
    // Cold regions (higher latitudes)
    else {
      return { avg: 5.5, common: '5-7mm', reason: 'Cold waters' };
    }
  };

  const getRegionalBodyTypeDistribution = (locationInfo) => {
    // This would typically come from regional health/demographic data
    // For demo purposes, using general estimates
    return {
      lean: 0.25,
      average: 0.40,
      muscular: 0.20,
      broad: 0.10,
      'higher-fat': 0.05
    };
  };

  const getSeasonalTrends = (locationInfo) => {
    const { latitude } = locationInfo;
    const currentMonth = new Date().getMonth();
    
    // Northern hemisphere
    if (latitude > 0) {
      if (currentMonth >= 5 && currentMonth <= 8) { // June-September
        return { season: 'Summer', activity: 'High', wetsuitAdjustment: '-0.5mm' };
      } else if (currentMonth >= 11 || currentMonth <= 2) { // December-March
        return { season: 'Winter', activity: 'Low', wetsuitAdjustment: '+1mm' };
      } else {
        return { season: 'Spring/Fall', activity: 'Medium', wetsuitAdjustment: '0mm' };
      }
    }
    // Southern hemisphere
    else {
      if (currentMonth >= 11 || currentMonth <= 2) { // December-March
        return { season: 'Summer', activity: 'High', wetsuitAdjustment: '-0.5mm' };
      } else if (currentMonth >= 5 && currentMonth <= 8) { // June-September
        return { season: 'Winter', activity: 'Low', wetsuitAdjustment: '+1mm' };
      } else {
        return { season: 'Spring/Fall', activity: 'Medium', wetsuitAdjustment: '0mm' };
      }
    }
  };

  const estimateNearbyDivingSites = (locationInfo) => {
    const { country, region } = locationInfo;
    
    // Popular freediving destinations
    const divingSiteEstimates = {
      'Philippines': { count: 50, famous: ['Palawan', 'Bohol', 'Siargao'] },
      'Indonesia': { count: 45, famous: ['Bali', 'Komodo', 'Raja Ampat'] },
      'Thailand': { count: 30, famous: ['Koh Tao', 'Phuket', 'Krabi'] },
      'Egypt': { count: 25, famous: ['Red Sea', 'Dahab', 'Sharm El Sheikh'] },
      'Greece': { count: 20, famous: ['Santorini', 'Crete', 'Mykonos'] },
      'Spain': { count: 18, famous: ['Canary Islands', 'Balearic Islands'] },
      'Australia': { count: 35, famous: ['Great Barrier Reef', 'Ningaloo Reef'] },
      'Mexico': { count: 25, famous: ['Cenotes', 'Cozumel', 'La Paz'] },
      'France': { count: 15, famous: ['Nice', 'Corsica', 'French Riviera'] },
      'Italy': { count: 20, famous: ['Sardinia', 'Sicily', 'Amalfi Coast'] }
    };
    
    return divingSiteEstimates[country] || { count: 5, famous: ['Local sites'] };
  };

  const getLocalSafetyConsiderations = (locationInfo) => {
    const { country, latitude } = locationInfo;
    
    const considerations = [];
    
    // Water temperature considerations
    if (Math.abs(latitude) > 50) {
      considerations.push('Cold water diving - hypothermia risk management essential');
      considerations.push('Extended wetsuit coverage recommended');
    } else if (Math.abs(latitude) < 25) {
      considerations.push('Warm water diving - dehydration prevention important');
      considerations.push('UV protection and sun safety critical');
    }
    
    // Altitude considerations
    if (['Nepal', 'Bolivia', 'Peru', 'Tibet'].includes(country)) {
      considerations.push('High altitude location - adjust for reduced atmospheric pressure');
    }
    
    // Regional water conditions
    if (['Philippines', 'Indonesia', 'Papua New Guinea'].includes(country)) {
      considerations.push('Strong currents possible - advanced water skills required');
    }
    
    // Seasonal considerations
    const seasonal = getSeasonalTrends(locationInfo);
    if (seasonal.season === 'Winter' && Math.abs(latitude) > 40) {
      considerations.push('Winter diving conditions - ice safety protocols may apply');
    }
    
    return considerations;
  };

  // Keep all existing analytics generation functions...
  const generateOverviewMetrics = (data) => {
    const totalCalculations = data.length;
    const uniqueSessions = new Set(data.map(entry => entry.date.split('T')[0])).size;
    
    const avgCalculationsPerSession = uniqueSessions > 0 ? totalCalculations / uniqueSessions : 0;
    
    const safetyWarningsCount = data.reduce((sum, entry) => 
      sum + (entry.results?.safetyWarnings?.length || 0), 0
    );
    
    const advancedSettingsUsage = data.filter(entry => 
      entry.inputs?.useCustomNeutralDepth || entry.inputs?.useDeepDivingOptimization
    ).length;

    const avgWeightRecommendation = data.length > 0 ? 
      data.reduce((sum, entry) => sum + (entry.results?.recommendedWeight || 0), 0) / data.length : 0;

    return {
      totalCalculations,
      uniqueSessions,
      avgCalculationsPerSession: Math.round(avgCalculationsPerSession * 10) / 10,
      safetyWarningsCount,
      advancedSettingsUsage,
      advancedSettingsPercentage: totalCalculations > 0 ? Math.round((advancedSettingsUsage / totalCalculations) * 100) : 0,
      avgWeightRecommendation: Math.round(avgWeightRecommendation * 10) / 10,
      safetyWarningRate: totalCalculations > 0 ? Math.round((safetyWarningsCount / totalCalculations) * 100) : 0
    };
  };

  const generateTrendAnalysis = (data) => {
    const dailyCalculations = {};
    const weightTrends = [];
    const depthTrends = [];
    
    data.forEach(entry => {
      const date = entry.date.split('T')[0];
      dailyCalculations[date] = (dailyCalculations[date] || 0) + 1;
      
      if (entry.results?.recommendedWeight) {
        weightTrends.push({
          date: entry.date,
          weight: entry.results.recommendedWeight,
          neutralDepth: entry.results.expectedNeutralDepth || 0
        });
      }
      
      if (entry.inputs?.targetDepth) {
        depthTrends.push({
          date: entry.date,
          targetDepth: entry.inputs.targetDepth,
          neutralDepth: entry.results?.expectedNeutralDepth || 0
        });
      }
    });

    return {
      dailyCalculations: Object.entries(dailyCalculations).map(([date, count]) => ({
        date,
        count
      })),
      weightTrends: weightTrends.slice(-20), // Last 20 calculations
      depthTrends: depthTrends.slice(-20),
      growthRate: calculateGrowthRate(dailyCalculations)
    };
  };

  const generateUserBehaviorMetrics = (data) => {
    const genderDistribution = {};
    const bodyTypeDistribution = {};
    const wetsuitUsage = {};
    const waterTypePreference = {};
    const sessionLengths = [];

    data.forEach(entry => {
      // Gender distribution
      const gender = entry.inputs?.gender || 'unknown';
      genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;

      // Body type distribution
      const bodyType = entry.inputs?.bodyType || 'unknown';
      bodyTypeDistribution[bodyType] = (bodyTypeDistribution[bodyType] || 0) + 1;

      // Wetsuit usage
      const wetsuit = entry.inputs?.wetsuitThickness || 0;
      const wetsuitKey = wetsuit === 0 ? 'None' : `${wetsuit}mm`;
      wetsuitUsage[wetsuitKey] = (wetsuitUsage[wetsuitKey] || 0) + 1;

      // Water type preference
      const waterType = entry.inputs?.waterType || 'unknown';
      waterTypePreference[waterType] = (waterTypePreference[waterType] || 0) + 1;
    });

    // Calculate session patterns
    const sessionsByHour = {};
    data.forEach(entry => {
      const hour = new Date(entry.date).getHours();
      sessionsByHour[hour] = (sessionsByHour[hour] || 0) + 1;
    });

    return {
      genderDistribution,
      bodyTypeDistribution,
      wetsuitUsage,
      waterTypePreference,
      sessionsByHour,
      peakUsageHour: Object.entries(sessionsByHour).reduce((a, b) => 
        sessionsByHour[a[0]] > sessionsByHour[b[0]] ? a : b, ['0', 0]
      )[0]
    };
  };

  const generateSafetyMetrics = (data) => {
    const safetyWarningTypes = {};
    const riskLevels = { low: 0, medium: 0, high: 0 };
    const overweightingIncidents = 0;
    const surfaceNegativeIncidents = 0;

    data.forEach(entry => {
      const warnings = entry.results?.safetyWarnings || [];
      
      warnings.forEach(warning => {
        safetyWarningTypes[warning.type] = (safetyWarningTypes[warning.type] || 0) + 1;
        riskLevels[warning.severity] = (riskLevels[warning.severity] || 0) + 1;
      });

      // Check for specific safety issues
      if (entry.results?.surfaceBuoyancy === 'negative') {
        riskLevels.high += 1;
      }
    });

    const totalWarnings = Object.values(safetyWarningTypes).reduce((sum, count) => sum + count, 0);
    const totalCalculations = data.length;

    return {
      safetyWarningTypes,
      riskLevels,
      totalWarnings,
      safetyScore: totalCalculations > 0 ? Math.max(0, 100 - (totalWarnings / totalCalculations * 100)) : 100,
      improvementAreas: identifyImprovementAreas(safetyWarningTypes)
    };
  };

  const generateEquipmentAnalytics = (data) => {
    const wetsuitEffectiveness = {};
    const weightDistribution = { belt: [], neck: [] };
    const equipmentCombinations = {};

    data.forEach(entry => {
      const wetsuit = entry.inputs?.wetsuitThickness || 0;
      const effectiveness = entry.results?.isWithinTargetRange ? 1 : 0;
      
      if (!wetsuitEffectiveness[wetsuit]) {
        wetsuitEffectiveness[wetsuit] = { total: 0, effective: 0 };
      }
      wetsuitEffectiveness[wetsuit].total += 1;
      wetsuitEffectiveness[wetsuit].effective += effectiveness;

      // Weight distribution analysis
      if (entry.inputs?.weightBelt) {
        weightDistribution.belt.push(entry.inputs.weightBelt);
      }
      if (entry.inputs?.neckWeight) {
        weightDistribution.neck.push(entry.inputs.neckWeight);
      }

      // Equipment combinations
      const combo = `${wetsuit}mm-${entry.inputs?.waterType || 'unknown'}`;
      equipmentCombinations[combo] = (equipmentCombinations[combo] || 0) + 1;
    });

    return {
      wetsuitEffectiveness: Object.entries(wetsuitEffectiveness).map(([thickness, data]) => ({
        thickness: thickness === '0' ? 'None' : `${thickness}mm`,
        effectivenessRate: data.total > 0 ? Math.round((data.effective / data.total) * 100) : 0,
        usage: data.total
      })),
      avgBeltWeight: weightDistribution.belt.length > 0 ? 
        weightDistribution.belt.reduce((sum, w) => sum + w, 0) / weightDistribution.belt.length : 0,
      avgNeckWeight: weightDistribution.neck.length > 0 ?
        weightDistribution.neck.reduce((sum, w) => sum + w, 0) / weightDistribution.neck.length : 0,
      popularCombinations: Object.entries(equipmentCombinations)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([combo, count]) => ({ combo, count }))
    };
  };

  const generatePerformanceMetrics = (data) => {
    const accuracyMetrics = [];
    const optimizationOpportunities = [];

    data.forEach(entry => {
      const targetRange = entry.results?.targetNeutralDepth;
      const actualDepth = entry.results?.expectedNeutralDepth;
      
      if (targetRange && actualDepth) {
        const isAccurate = actualDepth >= targetRange.min && actualDepth <= targetRange.max;
        const deviation = Math.abs(actualDepth - targetRange.optimal);
        
        accuracyMetrics.push({
          isAccurate,
          deviation,
          date: entry.date
        });

        if (!isAccurate) {
          optimizationOpportunities.push({
            type: actualDepth < targetRange.min ? 'underweighted' : 'overweighted',
            deviation,
            entry
          });
        }
      }
    });

    const accuracyRate = accuracyMetrics.length > 0 ? 
      (accuracyMetrics.filter(m => m.isAccurate).length / accuracyMetrics.length) * 100 : 0;

    const avgDeviation = accuracyMetrics.length > 0 ?
      accuracyMetrics.reduce((sum, m) => sum + m.deviation, 0) / accuracyMetrics.length : 0;

    return {
      accuracyRate: Math.round(accuracyRate),
      avgDeviation: Math.round(avgDeviation * 10) / 10,
      optimizationOpportunities: optimizationOpportunities.slice(0, 10),
      performanceScore: Math.max(0, 100 - avgDeviation * 10)
    };
  };

  const generatePredictiveAnalytics = (data) => {
    if (data.length < 3) return null;

    const recentTrends = data.slice(-10);
    const weightTrend = calculateWeightTrend(recentTrends);
    const usagePattern = analyzeUsagePattern(data);
    
    return {
      weightTrend,
      usagePattern,
      recommendations: generatePredictiveRecommendations(recentTrends),
      nextOptimalWeight: predictNextOptimalWeight(recentTrends)
    };
  };

  // Keep all existing utility functions...
  const calculateGrowthRate = (dailyData) => {
    const values = Object.values(dailyData);
    if (values.length < 2) return 0;
    
    const recent = values.slice(-7).reduce((sum, val) => sum + val, 0);
    const previous = values.slice(-14, -7).reduce((sum, val) => sum + val, 0);
    
    return previous > 0 ? Math.round(((recent - previous) / previous) * 100) : 0;
  };

  const identifyImprovementAreas = (warningTypes) => {
    return Object.entries(warningTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({ type, count }));
  };

  const calculateWeightTrend = (recentData) => {
    const weights = recentData.map(entry => entry.results?.recommendedWeight || 0);
    if (weights.length < 2) return 'stable';
    
    const recent = weights.slice(-3).reduce((sum, w) => sum + w, 0) / 3;
    const earlier = weights.slice(-6, -3).reduce((sum, w) => sum + w, 0) / 3;
    
    const diff = recent - earlier;
    if (Math.abs(diff) < 0.2) return 'stable';
    return diff > 0 ? 'increasing' : 'decreasing';
  };

  const analyzeUsagePattern = (data) => {
    const hourCounts = {};
    data.forEach(entry => {
      const hour = new Date(entry.date).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    const peakHour = Object.entries(hourCounts).reduce((a, b) => 
      hourCounts[a[0]] > hourCounts[b[0]] ? a : b, ['0', 0]
    )[0];
    
    return {
      peakHour: parseInt(peakHour),
      pattern: parseInt(peakHour) < 12 ? 'morning' : parseInt(peakHour) < 18 ? 'afternoon' : 'evening'
    };
  };

  const generatePredictiveRecommendations = (recentData) => {
    const recommendations = [];
    
    // Analyze recent safety warnings
    const recentWarnings = recentData.flatMap(entry => entry.results?.safetyWarnings || []);
    if (recentWarnings.length > 0) {
      recommendations.push({
        type: 'safety',
        message: 'Consider reviewing safety protocols based on recent warnings',
        priority: 'high'
      });
    }
    
    // Analyze weight consistency
    const weights = recentData.map(entry => entry.results?.recommendedWeight || 0);
    const weightVariation = Math.max(...weights) - Math.min(...weights);
    if (weightVariation > 2) {
      recommendations.push({
        type: 'consistency',
        message: 'Weight recommendations vary significantly. Consider standardizing equipment setup',
        priority: 'medium'
      });
    }
    
    return recommendations;
  };

  const predictNextOptimalWeight = (recentData) => {
    const weights = recentData.map(entry => entry.results?.recommendedWeight || 0);
    if (weights.length < 3) return null;
    
    // Simple linear trend prediction
    const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
    const trend = weights[weights.length - 1] - weights[0];
    
    return Math.round((avgWeight + trend * 0.1) * 10) / 10;
  };

  const exportAnalytics = () => {
    const exportData = {
      timeRange,
      generatedAt: new Date().toISOString(),
      analytics: analyticsData,
      location: locationData,
      rawData: history.filter(entry => {
        const entryDate = new Date(entry.date);
        const now = new Date();
        const startDate = timeRange === '7d' ? subDays(now, 7) :
                         timeRange === '30d' ? subDays(now, 30) :
                         timeRange === '90d' ? subDays(now, 90) :
                         subMonths(now, 12);
        return entryDate >= startDate;
      })
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freediving-analytics-${timeRange}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <SafeIcon icon={FiRefreshCw} className="text-4xl text-blue-500 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Generating analytics...</span>
      </div>
    );
  }

  if (!analyticsData || history.length === 0) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiBarChart3} className="text-6xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
        <p className="text-gray-500">Start using the calculator to see analytics</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Analytics Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <SafeIcon icon={FiBarChart3} className="text-2xl text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            {locationData && (
              <div className="ml-4 flex items-center text-sm text-gray-600">
                <SafeIcon icon={FiMapPin} className="mr-1" />
                <span>{locationData.city}, {locationData.country}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            {/* Export Button */}
            <button
              onClick={exportAnalytics}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SafeIcon icon={FiDownload} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Calculations</p>
                <p className="text-2xl font-bold text-blue-900">{analyticsData.overview.totalCalculations}</p>
              </div>
              <SafeIcon icon={FiActivity} className="text-2xl text-blue-600" />
            </div>
            <div className="mt-2 text-sm text-blue-700">
              {analyticsData.overview.uniqueSessions} unique sessions
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Safety Score</p>
                <p className="text-2xl font-bold text-green-900">{analyticsData.safety.safetyScore}%</p>
              </div>
              <SafeIcon icon={FiShield} className="text-2xl text-green-600" />
            </div>
            <div className="mt-2 text-sm text-green-700">
              {analyticsData.overview.safetyWarningsCount} warnings total
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Advanced Usage</p>
                <p className="text-2xl font-bold text-purple-900">{analyticsData.overview.advancedSettingsPercentage}%</p>
              </div>
              <SafeIcon icon={FiSettings} className="text-2xl text-purple-600" />
            </div>
            <div className="mt-2 text-sm text-purple-700">
              {analyticsData.overview.advancedSettingsUsage} advanced calculations
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Weight</p>
                <p className="text-2xl font-bold text-orange-900">{analyticsData.overview.avgWeightRecommendation}kg</p>
              </div>
              <SafeIcon icon={FiTarget} className="text-2xl text-orange-600" />
            </div>
            <div className="mt-2 text-sm text-orange-700">
              Recommended ballast weight
            </div>
          </div>
        </div>
      </div>

      {/* Location Analytics */}
      {analyticsData.location && locationData && (
        <LocationAnalytics data={analyticsData.location} />
      )}

      {/* Charts Section */}
      <AnalyticsCharts data={analyticsData} timeRange={timeRange} />

      {/* User Behavior Analytics */}
      <UserBehaviorAnalytics data={analyticsData.userBehavior} />

      {/* Calculation Trends */}
      <CalculationTrends data={analyticsData.trends} />

      {/* Safety Metrics */}
      <SafetyMetrics data={analyticsData.safety} />

      {/* Equipment Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiTarget} className="text-xl text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Equipment Analytics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wetsuit Effectiveness */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Wetsuit Effectiveness</h4>
            <div className="space-y-2">
              {analyticsData.equipment.wetsuitEffectiveness.map((wetsuit, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{wetsuit.thickness}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${wetsuit.effectivenessRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{wetsuit.effectivenessRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weight Distribution */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Average Weight Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Belt Weight:</span>
                <span className="text-sm text-gray-600">{analyticsData.equipment.avgBeltWeight.toFixed(1)}kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Neck Weight:</span>
                <span className="text-sm text-gray-600">{analyticsData.equipment.avgNeckWeight.toFixed(1)}kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <SafeIcon icon={FiTrendingUp} className="text-xl text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Performance Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analyticsData.performance.accuracyRate}%
            </div>
            <div className="text-sm text-gray-600">Target Accuracy</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analyticsData.performance.avgDeviation}m
            </div>
            <div className="text-sm text-gray-600">Avg Deviation</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analyticsData.performance.performanceScore}
            </div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </div>
        </div>

        {analyticsData.performance.optimizationOpportunities.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Optimization Opportunities</h4>
            <div className="space-y-2">
              {analyticsData.performance.optimizationOpportunities.slice(0, 3).map((opp, index) => (
                <div key={index} className="p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{opp.type}</span>
                    <span className="text-sm text-amber-600">{opp.deviation.toFixed(1)}m deviation</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Predictive Analytics */}
      {analyticsData.predictions && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <SafeIcon icon={FiTrendingUp} className="text-xl text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Predictive Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Weight Trend</h4>
              <div className={`p-3 rounded-lg ${
                analyticsData.predictions.weightTrend === 'increasing' ? 'bg-red-50 text-red-800' :
                analyticsData.predictions.weightTrend === 'decreasing' ? 'bg-blue-50 text-blue-800' :
                'bg-green-50 text-green-800'
              }`}>
                <span className="font-medium capitalize">{analyticsData.predictions.weightTrend}</span>
                {analyticsData.predictions.nextOptimalWeight && (
                  <div className="text-sm mt-1">
                    Predicted next optimal: {analyticsData.predictions.nextOptimalWeight}kg
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Usage Pattern</h4>
              <div className="p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800 capitalize">
                  {analyticsData.predictions.usagePattern.pattern} User
                </span>
                <div className="text-sm text-blue-700 mt-1">
                  Peak usage at {analyticsData.predictions.usagePattern.peakHour}:00
                </div>
              </div>
            </div>
          </div>

          {analyticsData.predictions.recommendations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {analyticsData.predictions.recommendations.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    rec.priority === 'high' ? 'bg-red-50 border border-red-200' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-start">
                      <SafeIcon 
                        icon={rec.priority === 'high' ? FiAlertTriangle : FiTarget} 
                        className={`mr-2 mt-0.5 ${
                          rec.priority === 'high' ? 'text-red-600' :
                          rec.priority === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} 
                      />
                      <div>
                        <span className="font-medium capitalize">{rec.type}</span>
                        <p className="text-sm mt-1">{rec.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Air Consumption Disclaimer */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiAlertTriangle} className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-2">Important Calculation Limitation</h3>
            <p className="text-sm text-amber-800 mb-3">
              <strong>Air Consumption Not Considered:</strong> This calculator does not factor in the freediver's air consumption rate during the dive. Air consumption varies significantly between individuals and affects buoyancy as lung volume changes throughout the dive.
            </p>
            <div className="text-sm text-amber-800 space-y-2">
              <p><strong>Key Considerations:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Calculations assume full lung capacity at target depth</li>
                <li>Individual breathing patterns and lung efficiency not accounted for</li>
                <li>Progressive air consumption during dive affects neutral buoyancy</li>
                <li>Advanced freedivers may have significantly different air consumption rates</li>
              </ul>
              <p className="mt-3 font-medium">
                <strong>Recommendation:</strong> Use these calculations as a starting baseline, then adjust based on your personal air consumption patterns observed during actual dives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Free Application Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <SafeIcon icon={FiGlobe} className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Free Global Access</h3>
            <p className="text-sm text-blue-800 mb-3">
              This freediving buoyancy calculator is provided <strong>free of charge</strong> to the global freediving community. We welcome users from all countries and regions to access this tool for educational and planning purposes.
            </p>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>Global Accessibility:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Available worldwide with no restrictions</li>
                <li>Location-based analytics help provide regional insights</li>
                <li>No registration or payment required</li>
                <li>Educational resource for the freediving community</li>
              </ul>
              {locationData && (
                <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                  <p className="font-medium text-blue-900">Your Location: {locationData.city}, {locationData.country}</p>
                  <p className="text-xs text-blue-700 mt-1">Location data helps us provide relevant regional diving insights and safety considerations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;