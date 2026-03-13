import React from 'react';
import { Link } from 'react-router-dom';
import './Instructions.css'; // Assuming we create this CSS file
import PersonalityTestInfo from './PersonalityTestInfo';

const Instructions = () => {
  return (
    <div className="instructions-page">
      <div className="container">
        <h1 className="page-title">Assessment Instructions</h1>
        <p className="intro-text">
          Discover your career interests and personality type through our comprehensive assessments.
          Choose from the RIASEC Interest Inventory or the MBTI Personality Test below.
        </p>

        <div className="tests-grid">
          {/* RIASEC Test Card */}
          <div className="test-card">
            <div className="test-icon">🎯</div>
            <h2>RIASEC Interest Inventory</h2>
            <p className="test-description">
              The RIASEC model helps you understand your vocational interests based on six personality types:
              Realistic, Investigative, Artistic, Social, Enterprising, and Conventional.
            </p>
            <div className="test-info">
              <div className="info-item">
                <strong>Questions:</strong> 48 questions
              </div>
              <div className="info-item">
                <strong>Time:</strong> 10-15 minutes
              </div>
              <div className="info-item">
                <strong>Format:</strong> Multiple choice
              </div>
            </div>
            <h3>Instructions:</h3>
            <ul className="instructions-list">
              <li>Read each statement carefully.</li>
              <li>Select the option that best describes you.</li>
              <li>Be honest with your responses for accurate results.</li>
              <li>Complete all questions to get your RIASEC profile.</li>
            </ul>
            <Link to="/riasec" className="start-test-btn">
              Start RIASEC Test
            </Link>
          </div>

          {/* Personality Test Card */}
          <div className="test-card">
            <div className="test-icon">🧠</div>
            <h2>MBTI Personality Test</h2>
            <p className="test-description">
              Based on Carl Jung's theory, the Myers-Briggs Type Indicator assesses personality across four dimensions:
              Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving.
            </p>
            <div className="test-info">
              <div className="info-item">
                <strong>Questions:</strong> 32 questions
              </div>
              <div className="info-item">
                <strong>Time:</strong> 5-10 minutes
              </div>
              <div className="info-item">
                <strong>Format:</strong> Score-based (0-5)
              </div>
            </div>
            <h3>Instructions:</h3>
            <ul className="instructions-list">
              <li>For each question, choose how much you agree with option A vs. option B.</li>
              <li>Use the score buttons (0-5) where 0 means strongly disagree with A, 5 means strongly agree with A.</li>
              <li>Be reflective and consider your natural tendencies.</li>
              <li>Your responses will determine your MBTI personality type.</li>
            </ul>
            <Link to="/personality-test" className="start-test-btn">
              Start Personality Test
            </Link>
          </div>
        </div>

        <div className="personality-info-section">
          <PersonalityTestInfo />
        </div>

        <div className="additional-info">
          <h3>Why Take These Assessments?</h3>
          <p>
            These assessments can help you:
          </p>
          <ul>
            <li>Understand your career interests and preferences</li>
            <li>Gain insights into your personality and decision-making style</li>
            <li>Explore potential career paths that align with your strengths</li>
            <li>Make informed choices about internships and opportunities</li>
          </ul>
          <p>
            Remember, these are tools for self-discovery. Use the results as a starting point for further exploration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Instructions;