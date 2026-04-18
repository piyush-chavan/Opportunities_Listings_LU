import {lazy,Suspense} from 'react';
import './App.css';
import { HashRouter as Router,Route,Routes } from 'react-router-dom';
const Navbar = lazy(() => import('./components/Navbar'));
const ListingPage = lazy(() => import('./components/ListingPage'));
const SummerProgramsListing = lazy(() => import('./components/SummerProgramsListing'));
const Footer = lazy(() => import('./components/Footer'));
const HomePage = lazy(() => import('./components/HomePage'));
const RIASECTest = lazy(() => import('./components/RiasecTest'));
const PersonalityTest = lazy(() => import('./components/PersonalityTest'));
const Instructions = lazy(() => import('./components/Instructions'));
const AptitudeTestEntry = lazy(() => import('./components/AptitudeTestEntry'));
const LearningStyleTest = lazy(() => import('./components/LearningStyleTest'));
const Report = lazy(() => import('./components/Report'));
const TestPipeline = lazy(() => import('./components/TestPipeline'));
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';

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
          <Suspense fallback={<div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>}>
        <Routes>
          <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
          <Route path="/listings" element={<ListingPage />} />
          <Route path="/summer_programs" element={<SummerProgramsListing />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/test-pipeline" element={<TestPipeline />} />
          <Route path="/riasec" element={<RIASECTest />} />
          <Route path="/personality-test" element={<PersonalityTest />} />
          <Route path="/learning-style-test" element={<LearningStyleTest/>} />
          <Route path="/aptitude-test" element={<AptitudeTestEntry />} />
          <Route path="/report" element={<Report/>} />
        </Routes>
        <Footer/>
        <ToastContainer position="top-center" theme="dark" />
        </Suspense>
      </div>
    </Router>
  )
}
export default App;