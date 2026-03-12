import React, { useState, useRef, useEffect } from "react";
import "./riasec.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    { id: 15, text: "I wouldn’t mind working 8 hours in an office", type: "C" },
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

export default function RIASECTest() {

    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [showWarnings, setShowWarnings] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChange = (id, value) => {
        setAnswers({ ...answers, [id]: value });
    };

    const calculateScore = () => {
        const unanswered = questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            setShowWarnings(true);
            toast.error("Please answer all questions");
            const firstUnanswered = unanswered[0].id;
            document.getElementById(`question-${firstUnanswered}`).scrollIntoView({ behavior: 'smooth' });
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

        setResult({
            scores,
            code: sorted.slice(0, 3)
        });
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
    };

    const restart = () => {
        setAnswers({});
        setResult(null);
        setShowWarnings(false);
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
    };

    const fillAllAnswers = (value) => {
        const filledAnswers = {};
        questions.forEach(q => {
            filledAnswers[q.id] = value;
        });
        setAnswers(filledAnswers);
        setShowWarnings(false);
    };

    if (result) {
        return (
            <div className="result-container rounded-text">

                <h1 className="gradient-text" style={{ fontWeight: '700' }} >Your RIASEC Result</h1>
                <h2 style={{ color: '#ff6f00' }}>Interest Code: {result.code.join("-")}</h2>


                <div className="score-grid">
                    {Object.entries(result.scores).map(([key, val]) => (
                        <div className="score-card" key={key}>
                            <h1 style={{ fontSize: '2rem' }}>{key}</h1>
                            <p>{val}</p>
                            <p style={{ fontWeight: '500' }}>{descriptions[key]}</p>
                        </div>
                    ))}
                </div>
                <h2 className="gradient-text">RIASEC Personality Types</h2>
                <div className="score-grid">

                    <div className="score-card">
                        <h3>R — Realistic</h3>
                        <p>
                            Practical people who enjoy working with tools, machines, or outdoors.
                            They prefer hands-on activities and physical work.
                        </p>
                        <ul>
                            <li>Agriculture</li>
                            <li>Engineering</li>
                            <li>Construction</li>
                            <li>Mechanic / Machinist</li>
                            <li>Computers</li>
                        </ul>
                    </div>

                    <div className="score-card">
                        <h3>I — Investigative</h3>
                        <p>
                            Analytical thinkers who enjoy research, science, and solving complex problems.
                        </p>
                        <ul>
                            <li>Marine Biology</li>
                            <li>Chemistry</li>
                            <li>Zoology</li>
                            <li>Medicine</li>
                            <li>Psychology</li>
                        </ul>
                    </div>

                    <div className="score-card">
                        <h3>A — Artistic</h3>
                        <p>
                            Creative individuals who enjoy self-expression through art, music, writing,
                            and design.
                        </p>
                        <ul>
                            <li>Fine Arts</li>
                            <li>Photography</li>
                            <li>Architecture</li>
                            <li>Interior Design</li>
                            <li>Media & Communication</li>
                        </ul>
                    </div>

                    <div className="score-card">
                        <h3>S — Social</h3>
                        <p>
                            People who enjoy helping, teaching, and supporting others.
                        </p>
                        <ul>
                            <li>Counseling</li>
                            <li>Nursing</li>
                            <li>Education</li>
                            <li>Public Relations</li>
                            <li>Travel & Hospitality</li>
                        </ul>
                    </div>

                    <div className="score-card">
                        <h3>E — Enterprising</h3>
                        <p>
                            Natural leaders who enjoy persuasion, business, entrepreneurship,
                            and leadership roles.
                        </p>
                        <ul>
                            <li>Marketing / Sales</li>
                            <li>Law</li>
                            <li>Banking</li>
                            <li>Real Estate</li>
                            <li>Political Science</li>
                        </ul>
                    </div>

                    <div className="score-card">
                        <h3>C — Conventional</h3>
                        <p>
                            Organized people who enjoy structured work with data,
                            numbers, and systems.
                        </p>
                        <ul>
                            <li>Accounting</li>
                            <li>Administration</li>
                            <li>Banking</li>
                            <li>Insurance</li>
                            <li>Data Processing</li>
                        </ul>
                    </div>


                </div>
                <button className="restart-btn" onClick={restart}>
                    Take Test Again
                </button>

            </div>
        );
    }

    return (
        <div className="test-container rounded-text">

            <h1 className="gradient-text" style={{ fontWeight: '700' }}>RIASEC Interest Test</h1>

            {questions.map(q => (
                <div className="question-card" key={q.id} id={`question-${q.id}`}>
                    <p>{q.id}. {q.text} {showWarnings && !answers[q.id] && <span style={{ color: 'red', fontSize: '1.2em' }}>!</span>}</p>
                    {showWarnings && !answers[q.id] && <p style={{ color: 'red', fontSize: '0.9em', margin: '5px 0' }}>This question is required.</p>}

                    <div className="options">

                        <label>
                            <input
                                type="radio"
                                name={`q${q.id}`}
                                onChange={() => handleChange(q.id, "yes")}
                            />
                            Yes
                        </label>

                        <label>
                            <input
                                type="radio"
                                name={`q${q.id}`}
                                onChange={() => handleChange(q.id, "no")}
                            />
                            No
                        </label>

                    </div>

                </div>
            ))}

            <button className="submit-btn" onClick={calculateScore}>
                Submit Test
            </button>
            <button className="fill-btn" onClick={() => fillAllAnswers("yes")}>
                Fill All "Yes"
            </button>
            <button className="fill-btn" onClick={() => fillAllAnswers("no")}>
                Fill All "No"
            </button>

            {showScrollButton && (
                <button className="scroll-to-top-btn" onClick={scrollToTop} title="Scroll to top">
                    ↑
                </button>
            )}
        </div>
    );
}