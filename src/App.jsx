import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import BuoyancyCalculator from './components/BuoyancyCalculator';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<BuoyancyCalculator />} />
          <Route path="/buoyancy" element={<BuoyancyCalculator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;