import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import "./learningStyle.css";

const questions = [
    ["involved", "tentative", "discriminating", "practical"],
    ["receptive", "impartial", "analytical", "relevant"],
    ["feeling", "watching", "thinking", "doing"],
    ["accepting", "aware", "evaluating", "risk-taker"],
    ["intuitive", "questioning", "logical", "productive"],
    ["concrete", "observing", "abstract", "active"],
    ["present-oriented", "reflecting", "future-oriented", "practical"],
    ["open to new experiences", "perceptive", "intelligent", "competent"],
    ["experience", "observation", "conceptualization", "experimentation"],
    ["intense", "reserve", "rational", "responsible"]
];

const individualStyles = {
    CE: {
        title: "Concrete Experience (CE)",
        text: "Focuses on being involved in experiences and dealing with immediate human situations in a personal way. It emphasizes feeling more than thinking."
    },
    RO: {
        title: "Reflective Observation (RO)",
        text: "Focuses on understanding ideas and situations through careful observation and reflection. It emphasizes understanding over action."
    },
    AC: {
        title: "Abstract Conceptualization (AC)",
        text: "Focuses on logic, ideas, and concepts. It emphasizes thinking over feeling and prefers building theories and models."
    },
    AE: {
        title: "Active Experimentation (AE)",
        text: "Focuses on actively influencing situations and applying ideas in practice. It emphasizes doing over observing."
    }
};

const quadrantDetails = {
    Convergent: {
        desc: `The convergent learning style relies primarily on the dominant learning abilities of abstract conceptualization and active experimentation. The greatest strength of this approach lies in problem solving, decision-making, and the practical application of ideas.`
    },
    Divergent: {
        desc: `The divergent learning style has the opposite learning strengths from the convergent. It emphasizes concrete experience and reflective observation. Its greatest strength lies in imaginative ability and awareness of meaning and values.`
    },
    Assimilative: {
        desc: `In assimilation, the dominant learning abilities are abstract conceptualization and reflective observation. The greatest strength of this orientation lies in inductive reasoning and the ability to create theoretical models.`
    },
    Accommodative: {
        desc: `The accommodative learning style has the opposite strengths from assimilation, emphasizing concrete experience and active experimentation. The greatest strength of this orientation lies in doing things and carrying out plans and tasks.`
    }
};

export default function LearningStyleTestPipeline({ onComplete, testNumber, totalTests }) {
    const [answers, setAnswers] = useState(
        Array(10).fill().map(() => ["", "", "", ""])
    );
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const handleChange = (q, i, val) => {
        const updated = [...answers];
        updated[q][i] = val;
        setAnswers(updated);
    };

    const validate = () => {
        for (let i = 0; i < answers.length; i++) {
            const row = answers[i];

            if (row.includes("")) {
                return `Question ${i + 1} is incomplete`;
            }

            const nums = row.map(Number);
            if (new Set(nums).size !== 4) {
                return `Question ${i + 1} must have unique values (1–4)`;
            }
        }
        return "";
    };

    const calculate = () => {
        const err = validate();
        if (err) {
            setError(err);
            toast.error(err);
            return;
        }

        let CE = 0, RO = 0, AC = 0, AE = 0;

        answers.forEach((row) => {
            CE += Number(row[0]);
            RO += Number(row[1]);
            AC += Number(row[2]);
            AE += Number(row[3]);
        });

        let quadrant = "";
        if (AC > CE && AE > RO) quadrant = "Convergent";
        else if (CE > AC && RO > AE) quadrant = "Divergent";
        else if (AC > CE && RO > AE) quadrant = "Assimilative";
        else quadrant = "Accommodative";

        const learningStyle = `${AC > CE ? "AC" : "CE"}-${AE > RO ? "AE" : "RO"}`;

        setResult({ CE, RO, AC, AE, quadrant, learningStyle, testType: "learning" });
        setError("");
    };

    const dominantStyles = result
        ? result.learningStyle.split("-")
        : [];

    // Autofill for testing
    const autofill = () => {
        const filledAnswers = Array(questions.length).fill(null).map(() => Array(4).fill(""));
        questions.forEach((q, qi) => {
            filledAnswers[qi] = ["4", "3", "2", "1"];
        });
        setAnswers(filledAnswers);
        setTimeout(() => {
            let CE = 0, RO = 0, AC = 0, AE = 0;
            filledAnswers.forEach((row) => {
                const values = row.map(Number);
                CE += values[0];
                RO += values[1];
                AC += values[2];
                AE += values[3];
            });
            let quadrant = "";
            if (CE > AC && AE > RO) quadrant = "Accommodative";
            else if (CE > AC && RO > AE) quadrant = "Divergent";
            else if (AC > CE && RO > AE) quadrant = "Assimilative";
            else quadrant = "Convergent";
            const learningStyle = `${AC > CE ? "AC" : "CE"}-${AE > RO ? "AE" : "RO"}`;
            setResult({ CE, RO, AC, AE, quadrant, learningStyle, testType: "learning" });
        }, 100);
    };

    if (result) {
        return (
            <div className="test-container">
                <div className="test-header">
                    <h1>Learning Style Test Results</h1>
                    <p className="test-progress">Test {testNumber} of {totalTests}</p>
                </div>

                <div className="container">
                    <h2 style={{ color:'#333',marginTop: '20px', marginBottom: '30px', textAlign: 'center' }}>
                        Your Learning Style: <strong>{result.learningStyle}</strong>
                    </h2>

                    <h3 style={{ marginBottom: '20px',color:'#333' }}>Dominant Learning Styles</h3>
                    <div className="styles-grid">
                        {dominantStyles.map((key) => (
                            <div key={key} className="style-card highlight">
                                <div className="style-header">
                                    <h4>{individualStyles[key].title}</h4>
                                    <span className="score">{result[key]}</span>
                                </div>
                                <p>{individualStyles[key].text}</p>
                            </div>
                        ))}
                    </div>

                    <br />
                    <div className="style-card highlight">
                        <div className="style-header">
                            <h4 style={{ fontSize: '1.2rem' }}>Dominant Learning Orientation: {result.quadrant}</h4>
                        </div>
                        <p className="desc" style={{ fontSize: '1rem', textAlign: 'justify' }}>
                            {quadrantDetails[result.quadrant].desc}
                        </p>
                    </div>

                    <button className="submit-btn" onClick={() => onComplete(result)} style={{ marginTop: '30px' }}>
                        Proceed to Next Test →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="test-container">
            <div className="test-header">
                <h1>Learning Style Assessment</h1>
                <p className="test-progress">Test {testNumber} of {totalTests}</p>
                <p className="test-description">
                    Rank each word from 1-4 (4 = Most like you, 1 = Least like you)
                </p>
            </div>

            <div className="container">
                {/* Instructions */}
                <div style={{color:'white'}} className="card">
                    <h3>Instructions</h3>
                    <ul style={{ marginLeft: '20px' }}>
                        <li>Each question has 4 words.</li>
                        <li>Assign ranks from 1 to 4 to each word.</li>
                        <li>4 = Most like you, 1 = Least like you.</li>
                        <li>No duplicate numbers allowed per question.</li>
                        <li>Complete all questions before submitting.</li>
                    </ul>
                </div>

                {questions.map((q, qi) => (
                    <div key={qi} className="card" style={{color:'white'}}>
                        <p><strong>Q{qi + 1}</strong></p>

                        {q.map((word, i) => (
                            <div key={i} className="option">
                                <span>{word}</span>
                                <select
                                    value={answers[qi][i]}
                                    onChange={(e) => handleChange(qi, i, e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {[1, 2, 3, 4].map((n) => {
                                        const isUsedElsewhere =
                                            answers[qi].includes(String(n)) &&
                                            answers[qi][i] !== String(n);

                                        return (
                                            <option
                                                key={n}
                                                value={n}
                                                disabled={isUsedElsewhere}
                                            >
                                                {n}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        ))}
                    </div>
                ))}

                {error && <p className="error-message" style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={calculate} className="submit-btn">
                        Submit Test
                    </button>
                    <button onClick={autofill} className="submit-btn" style={{backgroundColor: '#999'}}>
                        Auto-fill (Testing)
                    </button>
                </div>
            </div>
        </div>
    );
}
