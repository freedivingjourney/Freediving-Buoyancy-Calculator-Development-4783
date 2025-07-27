import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import BuoyancyCalculator from './components/BuoyancyCalculator';
import { AuthProvider } from './components/Auth/AuthProvider';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/buoyancy" element={<BuoyancyCalculator />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;