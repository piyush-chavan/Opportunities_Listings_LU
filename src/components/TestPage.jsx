import { useState } from "react";
import { aptitudeData } from "../assets/data";
import "./aptitude.css";

export default function TestPage({ grade, setResult }) {
  const data = aptitudeData[grade];

  const [answers, setAnswers] = useState({});

  const handleAnswer = (qId, ans) => {
    setAnswers(prev => ({ ...prev, [qId]: ans }));
  };

  const calculateScore = () => {
    let total = 0;
    let sectionWise = {};

    Object.entries(data.sections).forEach(([section, levels]) => {
      let sectionScore = 0;

      Object.entries(levels).forEach(([difficulty, questions]) => {
        questions.forEach((q, i) => {
          const id = `${section}-${difficulty}-${i}`;

          if (answers[id] === q.answer) {
            total++;
            sectionScore++;
          }
        });
      });

      sectionWise[section] = sectionScore;
    });

    setResult({ total, sectionWise });
  };

  return (
    <div className="test-container">
    <h2 style={{color:'black'}}>Grade : {grade} Aptitude Test</h2>
      {Object.entries(data.sections).map(([section, levels]) => (
        <div key={section} className="section">
          <h2>{section}</h2>

          {Object.entries(levels).map(([difficulty, questions]) => (
            <div key={difficulty}>
              <h3>{difficulty}</h3>

              {questions.map((q, i) => {
                const id = `${section}-${difficulty}-${i}`;

                return (
                  <div key={id} className="question-card">
                    <p>{q.q}</p>

                    {q.options.map(opt => (
                      <label key={opt}>
                        <input
                          type="radio"
                          name={id}
                          onChange={() => handleAnswer(id, opt)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      <button className="submit-btn" onClick={calculateScore}>
        Submit Test
      </button>
    </div>
  );
}