import React from 'react';
import './App.css';
import { HashRouter as Router,Route,Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ListingPage from './components/ListingPage';
import SummerProgramsListing from './components/SummerProgramsListing';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import RIASECTest from './components/RiasecTest';
import PersonalityTest from './components/PersonalityTest';
import Instructions from './components/Instructions';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import LearningStyleTest from './components/LearningStyleTest';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      return false;
    }
  });

  // Apply dark mode theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    } catch (e) {
      console.warn('Could not save dark mode preference:', e);
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div>
        <Navbar isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        <Routes>
          <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
          <Route path="/listings" element={<ListingPage />} />
          <Route path="/summer_programs" element={<SummerProgramsListing />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/riasec" element={<RIASECTest />} />
          <Route path="/personality-test" element={<PersonalityTest />} />
          <Route path="/learning-style-test" element={<LearningStyleTest/>} />
        </Routes>
        <Footer/>
        <ToastContainer position="top-center" theme="dark" />
      </div>
    </Router>
  )
}
export default App;