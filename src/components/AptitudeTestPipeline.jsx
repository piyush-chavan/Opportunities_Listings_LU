import React, { useState } from "react";
import { aptitudeData } from "../assets/data";
import "./aptitude.css";
import { toast } from 'react-toastify';

export default function AptitudeTestPipeline({ onComplete, testNumber, totalTests }) {
  const [gradeSelected, setGradeSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const grades = Object.keys(aptitudeData);

  const handleGradeSelect = (grade) => {
    setGradeSelected(grade);
    setAnswers({});
  };

  const handleAnswer = (qId, ans) => {
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  // Autofill for testing
  const autofill = () => {
    const data = aptitudeData[gradeSelected];
    const filledAnswers = {};
    Object.entries(data.sections).forEach(([section, levels]) => {
      Object.entries(levels).forEach(([difficulty, questions]) => {
        questions.forEach((q, i) => {
          const id = `${section}-${difficulty}-${i}`;
          filledAnswers[id] = q.answer;
        });
      });
    });
    setAnswers(filledAnswers);
    setTimeout(() => {
      let total = 0;
      let sectionWise = {};
      let totalQuestions = 0;
      Object.entries(data.sections).forEach(([section, levels]) => {
        let sectionScore = 0;
        let sectionTotal = 0;
        Object.entries(levels).forEach(([difficulty, questions]) => {
          questions.forEach((q, i) => {
            const id = `${section}-${difficulty}-${i}`;
            sectionTotal++;
            totalQuestions++;
            if (filledAnswers[id] === q.answer) {
              total++;
              sectionScore++;
            }
          });
        });
        sectionWise[section] = { score: sectionScore, total: sectionTotal };
      });
      setResult({
        total,
        totalQuestions,
        percentage: Math.round((total / totalQuestions) * 100),
        sectionWise,
        grade: gradeSelected,
        testType: "aptitude"
      });
    }, 100);
  };

  const calculateScore = () => {
    const data = aptitudeData[gradeSelected];
    let total = 0;
    let sectionWise = {};
    let totalQuestions = 0;

    Object.entries(data.sections).forEach(([section, levels]) => {
      let sectionScore = 0;
      let sectionTotal = 0;

      Object.entries(levels).forEach(([difficulty, questions]) => {
        questions.forEach((q, i) => {
          const id = `${section}-${difficulty}-${i}`;
          sectionTotal++;
          totalQuestions++;

          if (answers[id] === q.answer) {
            total++;
            sectionScore++;
          }
        });
      });

      sectionWise[section] = { score: sectionScore, total: sectionTotal };
    });

    if (total === 0 && totalQuestions > 0) {
      toast.error("Please answer some questions before submitting");
      return;
    }

    const percentage = Math.round((total / totalQuestions) * 100);

    setResult({
      total,
      totalQuestions,
      percentage,
      sectionWise,
      grade: gradeSelected,
      testType: "aptitude"
    });
  };

  if (result) {
    return (
      <div className="test-container">
        <div className="test-header">
          <h1>Aptitude Test Results</h1>
          <p className="test-progress">Test {testNumber} of {totalTests}</p>
        </div>

        <div className="result-container" style={{ padding: '30px', textAlign: 'center' }}>
          <h2 style={{color:'#333'}}>Grade {result.grade} Aptitude Test Results</h2>

          <div className="score-display" style={{ marginTop: '30px', marginBottom: '30px' }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: result.percentage >= 70 ? '#4CAF50' : result.percentage >= 50 ? '#FF9800' : '#f44336',
              marginBottom: '10px'
            }}>
              {result.percentage}%
            </div>
            <p style={{ fontSize: '1.2rem',color:'#333' }}>
              {result.total} out of {result.totalQuestions} correct answers
            </p>
          </div>

          <h3 style={{ color:'#333',marginTop: '30px', marginBottom: '20px' }}>Section Wise Performance</h3>
          <div className="score-grid">
            {Object.entries(result.sectionWise).map(([section, data]) => (
              <div key={section} className="score-card" style={{ padding: '20px' }}>
                <h4 style={{color:'#333'}}>{section}</h4>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6f00' }}>
                  {data.score}/{data.total}
                </p>
                <p>Section Accuracy: {Math.round((data.score / data.total) * 100)}%</p>
              </div>
            ))}
          </div>

          <button className="submit-btn" onClick={() => onComplete(result)} style={{ marginTop: '30px' }}>
            View Combined Report →
          </button>
        </div>
      </div>
    );
  }

  if (!gradeSelected) {
    return (
      <div className="test-container">
        <div className="test-header">
          <h1>Aptitude Test</h1>
          <p className="test-progress">Test {testNumber} of {totalTests}</p>
          <p className="test-description">Select your grade to start the test</p>
        </div>

        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Select Your Grade</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '20px',
            marginTop: '30px',
            maxWidth: '600px',
            margin: '30px auto'
          }}>
            {grades.map(grade => (
              <button
                key={grade}
                onClick={() => handleGradeSelect(grade)}
                style={{
                  padding: '20px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  backgroundColor: '#ff6f00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f57c00'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ff6f00'}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const data = aptitudeData[gradeSelected];

  return (
    <div className="test-container">
      <div className="test-header">
        <h1>Grade {gradeSelected} Aptitude Test</h1>
        <p className="test-progress">Test {testNumber} of {totalTests}</p>
        <button
          onClick={() => setGradeSelected(null)}
          style={{
            marginLeft: '10px',
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Change Grade
        </button>
      </div>

      <div className="questions-container" style={{ padding: '20px' }}>
        {Object.entries(data.sections).map(([section, levels]) => (
          <div key={section} className="section">
            <h2 style={{ marginTop: '30px', marginBottom: '20px', borderBottom: '2px solid #ff6f00', paddingBottom: '10px' }}>
              {section}
            </h2>

            {Object.entries(levels).map(([difficulty, questions]) => (
              <div key={difficulty}>
                <h3 style={{ color: '#666', marginTop: '20px', marginBottom: '15px' }}>
                  {difficulty} Level
                </h3>

                {questions.map((q, i) => {
                  const id = `${section}-${difficulty}-${i}`;

                  return (
                    <div key={id} className="question-card" style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '20px',
                      backgroundColor: '#f9f9f9'
                    }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '1.1rem' }}>
                        {i + 1}. {q.q}
                      </p>

                      <div style={{ marginLeft: '20px' }}>
                        {q.options.map((opt, optIdx) => (
                          <label key={optIdx} style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '10px',
                            cursor: 'pointer'
                          }}>
                            <input
                              type="radio"
                              name={id}
                              checked={answers[id] === opt}
                              onChange={() => handleAnswer(id, opt)}
                              style={{ marginRight: '12px', cursor: 'pointer', width: '18px', height: '18px' }}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
        <button className="submit-btn" onClick={calculateScore}>
          Submit Test
        </button>
        <button className="submit-btn" onClick={autofill} style={{backgroundColor: '#999'}}>
          Auto-fill (Testing)
        </button>
      </div>
    </div>
  );
}
