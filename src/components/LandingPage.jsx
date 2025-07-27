import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiDroplet,
  FiTarget,
  FiActivity,
  FiShield,
  FiUser,
  FiAward,
  FiArrowRight,
  FiCheckCircle,
  FiGlobe,
  FiMail,
  FiPhone,
  FiCalculator,
  FiLayers,
  FiWind,
  FiAnchor,
  FiAlertTriangle,
  FiInfo,
  FiCompass
} = FiIcons;

const LandingPage = () => {
  const features = [
    {
      icon: FiCalculator,
      title: "Planning Calculations",
      description: "Empirically calibrated formula based on real-world freediving data for dive preparation"
    },
    {
      icon: FiTarget,
      title: "Target Depth Planning",
      description: "Help plan for neutral buoyancy at your target depth based on personal factors"
    },
    {
      icon: FiLayers,
      title: "Wetsuit Compensation",
      description: "Ballast weight planning with 1kg per 1mm thickness baseline as a starting reference"
    },
    {
      icon: FiUser,
      title: "Personal Profile",
      description: "Customized guidance based on gender, body type, and lung capacity for planning purposes"
    },
    {
      icon: FiWind,
      title: "Physics-Based Model",
      description: "Comprehensive lung compression and depth pressure calculations for educational reference"
    },
    {
      icon: FiShield,
      title: "Safety First",
      description: "Built-in safety warnings and instructor-approved guidelines for planning assistance"
    }
  ];

  const testimonials = [
    {
      name: "Professional Freediver",
      quote: "This planning tool helped me prepare for my ballast weight testing. The 1kg per 1mm wetsuit rule is a good starting point!",
      rating: 5
    },
    {
      name: "Freediving Instructor",
      quote: "I recommend this tool to my students for dive preparation. It helps them understand the factors involved in buoyancy planning.",
      rating: 5
    },
    {
      name: "Recreational Freediver",
      quote: "Great educational tool for understanding buoyancy concepts. Helped me prepare before working with my instructor on weight testing.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-6">
                <img
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753616692915-434678667_122115304316249458_9210522229705513647_n.jpg"
                  alt="Freediving Journey Academy"
                  className="h-16 w-16 rounded-full object-cover border-3 border-blue-300 shadow-lg mr-4"
                />
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-2">
                    Freediving Journey
                  </h1>
                  <p className="text-xl text-blue-700 font-medium">
                    Buoyancy Planning Calculator
                  </p>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
                Plan Your Ballast Weight for Freediving Safety
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Prepare for your freediving sessions with our helpful buoyancy planning tool. Created by <strong>Instructor Rogemar</strong> using real-world freediving experience and the proven 1kg per 1mm wetsuit thickness guideline. <strong>Safety starts with preparation</strong> - use this tool to understand buoyancy factors before your in-water testing.
              </p>

              {/* Development Disclaimer - Moved to Hero Section */}
              <div className="mb-8 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiAlertTriangle} className="text-amber-600 text-xl mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Planning Tool Disclaimer</h3>
                    <p className="text-sm text-amber-800 mb-2">
                      This application serves as a <strong>planning and educational tool</strong> to help you understand buoyancy factors and prepare for your dive. The calculations provide <strong>general guidance for preparation</strong> but should not be considered as precise measurements due to variable factors including individual body composition, water conditions, equipment variations, and personal breathing patterns.
                    </p>
                    <p className="text-sm text-amber-800 font-medium">
                      <strong>Always conduct proper in-water testing and work with a certified freediving instructor for actual weight adjustments.</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/buoyancy"
                  className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <SafeIcon icon={FiCompass} className="mr-2 text-xl" />
                  Plan Your Dive
                  <SafeIcon icon={FiArrowRight} className="ml-2" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors border-2 border-blue-200"
                >
                  <SafeIcon icon={FiActivity} className="mr-2" />
                  Learn More
                </a>
              </div>

              {/* Factors Considered - Replacing Stats */}
              <div className="p-6 bg-white rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Factors Considered in Calculations</h3>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
                  <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
                    <SafeIcon icon={FiUser} className="text-blue-600 mb-1" />
                    <div className="text-sm text-center">Body Metrics</div>
                    <div className="text-xs text-gray-600 text-center">Weight, Height, BMI</div>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg">
                    <SafeIcon icon={FiTarget} className="text-green-600 mb-1" />
                    <div className="text-sm text-center">Physical Profile</div>
                    <div className="text-xs text-gray-600 text-center">Gender, Body Type</div>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
                    <SafeIcon icon={FiWind} className="text-purple-600 mb-1" />
                    <div className="text-sm text-center">Lung Capacity</div>
                    <div className="text-xs text-gray-600 text-center">Total Volume</div>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-lg">
                    <SafeIcon icon={FiLayers} className="text-yellow-600 mb-1" />
                    <div className="text-sm text-center">Equipment</div>
                    <div className="text-xs text-gray-600 text-center">Wetsuit, Weights</div>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
                    <SafeIcon icon={FiDroplet} className="text-red-600 mb-1" />
                    <div className="text-sm text-center">Environment</div>
                    <div className="text-xs text-gray-600 text-center">Water Type, Depth</div>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-indigo-50 rounded-lg">
                    <SafeIcon icon={FiActivity} className="text-indigo-600 mb-1" />
                    <div className="text-sm text-center">Physics</div>
                    <div className="text-xs text-gray-600 text-center">Pressure, Compression</div>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center mb-6">
                  <SafeIcon icon={FiDroplet} className="text-3xl text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Quick Preview</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Wetsuit Thickness</span>
                    <span className="text-blue-600 font-semibold">2mm</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Baseline Weight</span>
                    <span className="text-green-600 font-semibold">2.0kg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Planning Focus</span>
                    <span className="text-purple-600 font-semibold">Safety First</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white text-center">
                  <SafeIcon icon={FiShield} className="text-2xl mx-auto mb-2" />
                  <div className="font-semibold">Dive Preparation</div>
                  <div className="text-sm opacity-90">Safety starts here</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Safety Notice Section */}
      <section className="py-12 bg-amber-50 border-t-4 border-amber-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <SafeIcon icon={FiShield} className="text-3xl text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-amber-900">Safety First</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-amber-800 mb-4">
                This calculator provides <strong>general guidance only</strong> and should not replace proper freediving training, in-water testing, or professional instruction.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <SafeIcon icon={FiUser} className="text-2xl text-blue-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-2">Always Test In-Water</h3>
                  <p className="text-sm text-gray-600">
                    Conduct buoyancy testing in controlled conditions with proper supervision
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <SafeIcon icon={FiAward} className="text-2xl text-green-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-2">Consult Instructors</h3>
                  <p className="text-sm text-gray-600">
                    Work with certified freediving instructors for personalized guidance
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <SafeIcon icon={FiActivity} className="text-2xl text-purple-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-2">Individual Variation</h3>
                  <p className="text-sm text-gray-600">
                    Body composition and buoyancy vary significantly between individuals
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Professional-Grade Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by freediving professionals for accurate, safe, and reliable buoyancy calculations
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <SafeIcon icon={feature.icon} className="text-2xl text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 3-step process to calculate your perfect ballast weight
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Your Profile</h3>
              <p className="text-gray-600">
                Input your weight, height, gender, body type, and lung capacity for personalized calculations
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Configure Equipment</h3>
              <p className="text-gray-600">
                Select wetsuit thickness and current weight setup for accurate buoyancy compensation
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600">
                Receive ballast weight recommendations with safety warnings and equipment tips
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Freedivers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what the freediving community says about our calculator
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <SafeIcon key={i} icon={FiCheckCircle} className="text-yellow-500 mr-1" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="font-semibold text-gray-900">- {testimonial.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Plan Your Dive?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start calculating your ballast weight today and take the first step toward safer, more prepared freediving
            </p>
            <Link
              to="/buoyancy"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-lg"
            >
              <SafeIcon icon={FiAnchor} className="mr-2 text-xl" />
              Plan Your Dive
              <SafeIcon icon={FiArrowRight} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753616692915-434678667_122115304316249458_9210522229705513647_n.jpg"
                  alt="Freediving Journey Academy"
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-400 mr-3"
                />
                <div>
                  <h3 className="text-xl font-bold">Freediving Journey</h3>
                  <p className="text-gray-400">Professional Buoyancy Calculator</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Created by <strong>Instructor Rogemar</strong> for accurate, safe, and reliable freediving buoyancy calculations.
              </p>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <SafeIcon icon={FiGlobe} className="mr-3 text-blue-400" />
                  <a
                    href="https://www.freedivingjourney.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    www.freedivingjourney.com
                  </a>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiMail} className="mr-3 text-blue-400" />
                  <a
                    href="mailto:hello@freedivingjourney.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    hello@freedivingjourney.com
                  </a>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiPhone} className="mr-3 text-blue-400" />
                  <a
                    href="tel:+639398682883"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +639398682883
                  </a>
                </div>
              </div>
            </div>
            {/* Social */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="space-y-3">
                <a
                  href="https://facebook.com/FreedivingJourney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <span className="mr-3">📘</span> Facebook: @FreedivingJourney
                </a>
                <a
                  href="https://instagram.com/Freediving.Journey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <span className="mr-3">📷</span> Instagram: @Freediving.Journey
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-gray-400 mb-4">
                © 2024 Freediving Journey Academy. Created by Instructor Rogemar.
              </p>
              {/* Final Safety Disclaimer */}
              <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-start space-x-3">
                  <SafeIcon icon={FiInfo} className="text-blue-400 text-lg mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-200 mb-2">Important Safety Information</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      This buoyancy calculator is a development tool to assist in dive planning. While based on empirical data and established freediving principles, it should not replace proper training, in-water testing, and professional instruction.
                    </p>
                    <p className="text-sm text-gray-300 font-medium">
                      For comprehensive freediving education, certification courses, and personalized buoyancy consultations, visit <a href="https://www.freedivingjourney.com" className="text-blue-400 hover:text-blue-300">www.freedivingjourney.com</a> or contact us at <a href="mailto:hello@freedivingjourney.com" className="text-blue-400 hover:text-blue-300">hello@freedivingjourney.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;