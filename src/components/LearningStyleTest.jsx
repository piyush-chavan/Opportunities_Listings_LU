import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        text: "Focuses on being involved in experiences and dealing with immediate human situations in a personal way. It emphasizes feeling more than thinking and values intuition and real-world experiences over abstract theories."
    },
    RO: {
        title: "Reflective Observation (RO)",
        text: "Focuses on understanding ideas and situations through careful observation and reflection. It emphasizes understanding over action and prefers analyzing how things happen."
    },
    AC: {
        title: "Abstract Conceptualization (AC)",
        text: "Focuses on logic, ideas, and concepts. It emphasizes thinking over feeling and prefers building theories and models rather than relying on intuition."
    },
    AE: {
        title: "Active Experimentation (AE)",
        text: "Focuses on actively influencing situations and applying ideas in practice. It emphasizes doing over observing and prefers practical application."
    }
};

const quadrantDetails = {
    Convergent: {
        desc: `The convergent learning style relies primarily on the dominant learning abilities of
abstract conceptualization and active experimentation. The greatest strength of this approach lies in
problem solving, decision-making, and the practical application of ideas. The style works best in
situations where there is a single correct answer or solution to a question or problem. The style
suggests a preference for task accomplishment or productivity rather than for more socio-emotional
experiences..`
    },
    Divergent: {
        desc: `The divergent learning style has the opposite learning strengths from the convergent. It
emphasizes concrete experience and reflective observation. Its greatest strength lies in imaginative
ability and awareness of meaning and values. The primary adaptive ability of divergence is to view
concrete situations from many perspectives and to organize many relationships into a meaningful
"gestalt." The emphasis in this orientation is on adaptation by observation rather than action. It is
called divergent because it works best in situations that call for generation of alternative ideas and
implications, such as a "brainstorming" idea session. The style suggests a preference for socioemotional experiences over task accomplishment.`
    },
    Assimilative: {
        desc: `In assimilation, the dominant learning abilities are abstract conceptualization and
reflective observation. The greatest strength of this orientation lies in inductive reasoning and the
ability to create theoretical models, in assimilating disparate observations into an integrated
explanation. As in convergence, this orientation is focused less on socio-emotional interactions and
more on ideas and abstract concepts. Ideas are valued more for being logically sound and precise
than for their practical values. It is more important that the theory be logically sound and precise.`
    },
    Accommodative: {
        desc: ` The accommodative learning style has the opposite strengths from assimilation,
emphasizing concrete experience and active experimentation. The greatest strength of this
orientation lies in doing things, in carrying out plans and tasks and getting involved in new
experiences. The adaptive emphasis of this orientation is on opportunity seeking, risk taking and
action. This style is called accommodative because it is best suited for those situations where one
must adapt oneself to changing immediate circumstances. In situations where the theory or plans do
not fit the facts, those with an accommodative style will most likely discard the plan or theory.`
    }
};

export default function LearningStyleTest() {
    const [answers, setAnswers] = useState(
        Array(10).fill().map(() => ["", "", "", ""])
    );
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const navigate = useNavigate();

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
            return;
        }

        let CE = 0,
            RO = 0,
            AC = 0,
            AE = 0;

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

        setResult({ CE, RO, AC, AE, quadrant, learningStyle });
        setError("");

    };

    // DEV: Autofill random
    const autofill = () => {
        const filled = answers.map(() => {
            const arr = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
            return arr;
        });
        setAnswers(filled);
    };

    const dominantStyles = result
        ? result.learningStyle.split("-")
        : [];
    return (
        <div className="container">
            <h1>Learning Style Assessment</h1>

            {!result && (
                <>
                    {/* Instructions */}
                    <div className="card">
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
                        <div key={qi} className="card">
                            <p><strong>Q{qi + 1}</strong></p>

                            {q.map((word, i) => (
                                <div key={i} className="option">
                                    <span>{word}</span>
                                    {/* <select
                                        value={answers[qi][i]}
                                        onChange={(e) =>
                                            handleChange(qi, i, e.target.value)
                                        }
                                    >
                                        <option value="">-</option>
                                        {[1, 2, 3, 4].map((n) => (
                                            <option key={n}>{n}</option>
                                        ))}
                                    </select> */}
                                    <select
                                        value={answers[qi][i]}
                                        onChange={(e) =>
                                            handleChange(qi, i, e.target.value)
                                        }
                                    >
                                        <option value="">clear</option>

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

                    {error && <p className="error">{error}</p>}

                    <div className="btns">
                        <button onClick={calculate}>Submit</button>
                        <button className="secondary" onClick={autofill}>
                            Autofill (Dev)
                        </button>
                    </div>
                </>
            )}

            {result && (
                <div className="result card">
                    <h2>Your Result</h2>
                    {/* <div className="styles-grid">

                        {[
                            { key: "CE", score: result.CE },
                            { key: "RO", score: result.RO },
                            { key: "AC", score: result.AC },
                            { key: "AE", score: result.AE }
                        ].map((style) => (
                            <div key={style.key} className="style-card">

                                <div className="style-header">
                                    <h4>{individualStyles[style.key].title}</h4>
                                    <span className="score">{style.score}</span>
                                </div>

                                <p>{individualStyles[style.key].text}</p>

                            </div>
                        ))}

                    </div> */}

                    <p><strong>Learning Style:</strong> {result.learningStyle}</p>
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


                    <br /><br />
                    <div className="style-card highlight">

                        <div className="style-header">
                            <h4 style={{ fontSize: '1.2rem' }}>Dominant Learning Orientation: {result.quadrant}</h4>
                        </div>

                        <p className="desc" style={{ fontSize: '1rem', textAlign: 'justify' }}>
                            {quadrantDetails[result.quadrant].desc}
                        </p>

                    </div>


                    {/* Graph */}
                    <div className="kolb-wrapper">
                        <h3 className="title">Learning Style Profile</h3>

                        <div className="kolb-graph">
                            {(() => {
                                const size = 400;
                                const padding = 60; // extra space for labels
                                const full = size + padding * 2;
                                const center = full / 2;
                                const max = 40;
                                const scale = (size / 2 - 20) / max;

                                const CE = result.CE;
                                const RO = result.RO;
                                const AC = result.AC;
                                const AE = result.AE;

                                const top = { x: center, y: center - CE * scale };
                                const right = { x: center + RO * scale, y: center };
                                const bottom = { x: center, y: center + AC * scale };
                                const left = { x: center - AE * scale, y: center };

                                const areas = {
                                    Accommodative: CE * AE,
                                    Divergent: CE * RO,
                                    Convergent: AC * AE,
                                    Assimilative: AC * RO
                                };

                                const dominant = Object.keys(areas).reduce((a, b) =>
                                    areas[a] > areas[b] ? a : b
                                );

                                let highlight = [];
                                if (dominant === "Accommodative")
                                    highlight = [top, { x: center, y: center }, left];
                                else if (dominant === "Divergent")
                                    highlight = [top, { x: center, y: center }, right];
                                else if (dominant === "Convergent")
                                    highlight = [bottom, { x: center, y: center }, left];
                                else
                                    highlight = [bottom, { x: center, y: center }, right];

                                return (
                                    <svg width={full} height={full}>

                                        {/* Axes */}
                                        <line x1={center} y1={padding} x2={center} y2={full - padding} stroke="#cbd5f5" strokeWidth="2" />
                                        <line x1={padding} y1={center} x2={full - padding} y2={center} stroke="#cbd5f5" strokeWidth="2" />

                                        {/* Axis ticks */}
                                        {[10, 20, 30, 40].map((v) => (
                                            <g key={v} fill="#64748b" fontSize="11">
                                                <text x={center + 8} y={center - v * scale}>{v}</text>
                                                <text x={center + 8} y={center + v * scale}>{v}</text>
                                                <text x={center - v * scale} y={center + 15}>{v}</text>
                                                <text x={center + v * scale} y={center + 15}>{v}</text>
                                            </g>
                                        ))}

                                        {/* Diamond */}
                                        <polygon
                                            points={`${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`}
                                            fill="rgba(99,102,241,0.15)"
                                            stroke="#6366f1"
                                            strokeWidth="2"
                                        />

                                        {/* Dominant area */}
                                        <polygon
                                            points={highlight.map(p => `${p.x},${p.y}`).join(" ")}
                                            fill="rgba(99,102,241,0.35)"
                                        />

                                        {/* Points */}
                                        {[top, right, bottom, left].map((p, i) => (
                                            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#4f46e5" />
                                        ))}

                                        {/* Axis Labels (OUTSIDE, NO OVERLAP) */}
                                        <text x={center} y={25} textAnchor="middle" className="axis-label">
                                            Concrete Experience (CE)
                                        </text>

                                        <text x={center} y={full - 10} textAnchor="middle" className="axis-label">
                                            Abstract Conceptualization (AC)
                                        </text>

                                        <text x={10} y={center} textAnchor="start" dominantBaseline="middle" className="axis-label">
                                            Active Experimentation (AE)
                                        </text>

                                        <text x={full - 10} y={center} textAnchor="end" dominantBaseline="middle" className="axis-label">
                                            Reflective Observation (RO)
                                        </text>

                                        {/* Quadrants (spaced properly) */}
                                        <text x={center - 120} y={center - 80} className="quad-label">
                                            Accommodative
                                        </text>

                                        <text x={center + 70} y={center - 80} className="quad-label">
                                            Divergent
                                        </text>

                                        <text x={center - 120} y={center + 90} className="quad-label">
                                            Convergent
                                        </text>

                                        <text x={center + 70} y={center + 90} className="quad-label">
                                            Assimilative
                                        </text>

                                    </svg>
                                );
                            })()}
                        </div>
                    </div>

                    <button className="restart-btn" onClick={() => setResult(null)}>
                        Take Test Again
                    </button>
                </div>
            )}

        </div>
    );
}