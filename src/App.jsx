import {lazy,Suspense} from 'react';
import './App.css';
import { HashRouter as Router,Route,Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
const Navbar = lazy(() => import('./components/Navbar'));
const SignInPage = lazy(() => import('./components/SignInPage'));
const ListingPage = lazy(() => import('./components/ListingPage'));
const SummerProgramsListing = lazy(() => import('./components/SummerProgramsListing'));
const CompetitionsListing = lazy(() => import('./components/CompetitionsListing'));
const InternshipsListing = lazy(() => import('./components/InternshipsListing'));
const CoursesListing = lazy(() => import('./components/CoursesListing'));
const ScholarshipsListing = lazy(() => import('./components/ScholarshipsListing'));
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
  

  return (
    <Router>
      <div>
        <Suspense fallback={<div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>}>
          <Routes>
            {/* Public Route - Sign In */}
            <Route path="/sign-in" element={<SignInPage />} />

            {/* Protected Routes - All wrapped once */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/listings" element={<ListingPage />} />
                    <Route path="/summer_programs" element={<SummerProgramsListing />} />
                    <Route path="/competitions" element={<CompetitionsListing />} />
                    <Route path="/internships" element={<InternshipsListing />} />
                    <Route path="/courses" element={<CoursesListing />} />
                    <Route path="/scholarships" element={<ScholarshipsListing />} />
                    <Route path="/instructions" element={<Instructions />} />
                    <Route path="/test-pipeline" element={<TestPipeline />} />
                    <Route path="/riasec" element={<RIASECTest />} />
                    <Route path="/personality-test" element={<PersonalityTest />} />
                    <Route path="/learning-style-test" element={<LearningStyleTest/>} />
                    <Route path="/aptitude-test" element={<AptitudeTestEntry />} />
                    <Route path="/report" element={<Report/>} />
                  </Routes>
                  <Footer/>
                </ProtectedRoute>
              } 
            />
          </Routes>
          <ToastContainer position="top-center" theme="dark" />
        </Suspense>
      </div>
    </Router>
  )
}
export default App;