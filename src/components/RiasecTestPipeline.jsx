import React, { useState, useRef, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./riasec.css";

const questions = [
    { id: 1, text: "I like to work on cars", type: "R" },
    { id: 2, text: "I like to do puzzles", type: "I" },
    { id: 3, text: "I am good at working independently", type: "A" },
    { id: 4, text: "I like to work in teams", type: "S" },
    { id: 5, text: "I am an ambitious person, I set goals for myself", type: "E" },
    { id: 6, text: "I like to organize things", type: "C" },

    { id: 7, text: "I like to build things", type: "R" },
    { id: 8, text: "I like to read about art and music", type: "A" },
    { id: 9, text: "I like to have clear instructions to follow", type: "C" },
    { id: 10, text: "I like to influence or persuade people", type: "E" },
    { id: 11, text: "I like to do experiments", type: "I" },
    { id: 12, text: "I like to teach or train people", type: "S" },

    { id: 13, text: "I like helping people solve problems", type: "S" },
    { id: 14, text: "I like to take care of animals", type: "R" },
    { id: 15, text: "I wouldn't mind working 8 hours in an office", type: "C" },
    { id: 16, text: "I like selling things", type: "E" },
    { id: 17, text: "I enjoy creative writing", type: "A" },
    { id: 18, text: "I enjoy science", type: "I" },

    { id: 19, text: "I am quick to take on new responsibilities", type: "E" },
    { id: 20, text: "I am interested in healing people", type: "S" },
    { id: 21, text: "I enjoy figuring out how things work", type: "I" },
    { id: 22, text: "I like assembling things", type: "R" },
    { id: 23, text: "I am a creative person", type: "A" },
    { id: 24, text: "I pay attention to details", type: "C" },

    { id: 25, text: "I like filing or typing", type: "C" },
    { id: 26, text: "I like to analyze problems", type: "I" },
    { id: 27, text: "I like to play instruments or sing", type: "A" },
    { id: 28, text: "I enjoy learning about cultures", type: "S" },
    { id: 29, text: "I want to start my own business", type: "E" },
    { id: 30, text: "I like to cook", type: "R" },

    { id: 31, text: "I like acting in plays", type: "A" },
    { id: 32, text: "I am a practical person", type: "R" },
    { id: 33, text: "I like working with numbers or charts", type: "C" },
    { id: 34, text: "I like discussions about issues", type: "S" },
    { id: 35, text: "I keep good records of my work", type: "C" },
    { id: 36, text: "I like to lead", type: "E" },

    { id: 37, text: "I like working outdoors", type: "R" },
    { id: 38, text: "I would like to work in an office", type: "C" },
    { id: 39, text: "I am good at math", type: "I" },
    { id: 40, text: "I like helping people", type: "S" },
    { id: 41, text: "I like to draw", type: "A" },
    { id: 42, text: "I like to give speeches", type: "E" }
];

const descriptions = {
    R: "Realistic: Practical people who enjoy working with tools, machines, or outdoors.",
    I: "Investigative: Analytical people who like science, research, and solving problems.",
    A: "Artistic: Creative individuals who enjoy art, music, writing, and design.",
    S: "Social: People who like helping, teaching, and interacting with others.",
    E: "Enterprising: Leaders who enjoy business, persuasion, and entrepreneurship.",
    C: "Conventional: Organized people who enjoy structure, data, and administration."
};

export default function RiasecTestPipeline({ onComplete, testNumber, totalTests }) {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showWarnings, setShowWarnings] = useState(false);

    const handleChange = (id, value) => {
        setAnswers({ ...answers, [id]: value });
    };

    const calculateScore = () => {
        const unanswered = questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            setShowWarnings(true);
            toast.error("Please answer all questions");
            return;
        }

        setShowWarnings(false);

        const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

        questions.forEach(q => {
            if (answers[q.id] === "yes") {
                scores[q.type]++;
            }
        });

        const sorted = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(item => item[0]);

        const resultData = {
            testType: "riasec",
            scores,
            code: sorted.slice(0, 3)
        };

        setResult(resultData);
    };

    const handleSubmit = () => {
        if (result) {
            onComplete(result);
        }
    };

    // Autofill for testing
    const autofill = () => {
        const filledAnswers = {};
        questions.forEach(q => {
            filledAnswers[q.id] = "yes";
        });
        setAnswers(filledAnswers);
        setTimeout(() => {
            setAnswers(filledAnswers);
            setShowWarnings(false);
            const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
            questions.forEach(q => {
                if (filledAnswers[q.id] === "yes") {
                    scores[q.type]++;
                }
            });
            const sorted = Object.entries(scores)
                .sort((a, b) => b[1] - a[1])
                .map(item => item[0]);
            setResult({
                testType: "riasec",
                scores,
                code: sorted.slice(0, 3)
            });
        }, 100);
    };

    if (result) {
        return (
            <div className="test-container">
                <div className="test-header">
                    <h1>RIASEC Career Test Results</h1>
                    <p className="test-progress">Test {testNumber} of {totalTests}</p>
                </div>

                <div className="result-container rounded-text">
                    <h2 style={{ color: '#ff6f00', marginBottom: '20px' }}>
                        Your Interest Code: <strong>{result.code.join("-")}</strong>
                    </h2>

                    <div className="score-grid">
                        {Object.entries(result.scores).map(([key, val]) => (
                            <div className="score-card" key={key}>
                                <h3 style={{ fontSize: '1.5rem',color:'black' }}>{key}</h3>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff6f00' }}>{val}</p>
                                <p>{descriptions[key]}</p>
                            </div>
                        ))}
                    </div>

                    <h3 style={{ marginTop: '30px', marginBottom: '20px' }}>Top 3 RIASEC Personality Types</h3>
                    <div className="score-grid">
                        {result.code.map((code) => (
                            <div className="score-card" key={code}>
                                <h4 style={{color:'black'}}>{getRiasecTitle(code)}</h4>
                                <p>{descriptions[code]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit}>
                    Proceed to Next Test →
                </button>
            </div>
        );
    }

    return (
        <div className="test-container">
            <div className="test-header">
                <h1>RIASEC Career Test</h1>
                <p className="test-progress">Test {testNumber} of {totalTests}</p>
                <p className="test-description">
                    Answer with YES or NO to understand your career interests and personality type
                </p>
            </div>

            <div className="questions-container">
                {questions.map((question) => (
                    <div key={question.id} id={`question-${question.id}`} className="question-box">
                        <label className="question-text">
                            <strong>{question.id}.</strong> {question.text}
                        </label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name={`q-${question.id}`}
                                    value="yes"
                                    checked={answers[question.id] === "yes"}
                                    onChange={(e) => handleChange(question.id, e.target.value)}
                                />
                                Yes
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name={`q-${question.id}`}
                                    value="no"
                                    checked={answers[question.id] === "no"}
                                    onChange={(e) => handleChange(question.id, e.target.value)}
                                />
                                No
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <div className="button-group">
                <button className="submit-btn" onClick={calculateScore}>
                    Submit Test
                </button>
                <button className="submit-btn" onClick={autofill} style={{backgroundColor: '#999', marginLeft: '10px'}}>
                    Auto-fill (Testing)
                </button>
            </div>
        </div>
    );
}

function getRiasecTitle(code) {
    const titles = {
        R: "Realistic",
        I: "Investigative",
        A: "Artistic",
        S: "Social",
        E: "Enterprising",
        C: "Conventional"
    };
    return titles[code] || code;
}
