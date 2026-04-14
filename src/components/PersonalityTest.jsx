import React, { useState } from "react";
import "./mbti-pro.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import "./learningStyle.css";
import {personalityDescriptions} from '../assets/data/personalityTestData'

const questions = [
  { id: 1, a: "Making decisions after finding out what others think.", b: "Making decisions without consulting others.", dimA: "E", dimB: "I" },
  { id: 2, a: "Being called imaginative or intuitive.", b: "Being called factual and accurate.", dimA: "N", dimB: "S" },
  { id: 3, a: "Making decisions using analysis.", b: "Making decisions using empathy.", dimA: "T", dimB: "F" },
  { id: 4, a: "Allowing commitments to occur.", b: "Pushing for definite commitments.", dimA: "P", dimB: "J" },
  { id: 5, a: "Quiet thoughtful time alone.", b: "Active energetic time with people.", dimA: "I", dimB: "E" },
  { id: 6, a: "Using known methods.", b: "Trying new methods.", dimA: "S", dimB: "N" },
  { id: 7, a: "Logical step-by-step analysis.", b: "Feelings and beliefs.", dimA: "T", dimB: "F" },
  { id: 8, a: "Avoid deadlines.", b: "Seek schedules.", dimA: "P", dimB: "J" },
  { id: 9, a: "Think quietly first.", b: "Talk freely first.", dimA: "I", dimB: "E" },
  { id: 10, a: "Thinking about possibilities.", b: "Dealing with actual facts.", dimA: "N", dimB: "S" },
  { id: 11, a: "Being thought of as logical.", b: "Being thought of as caring.", dimA: "T", dimB: "F" },
  { id: 12, a: "Consider every angle.", b: "Make quick decisions.", dimA: "P", dimB: "J" },
  { id: 13, a: "Private inner thoughts.", b: "Open shared activities.", dimA: "I", dimB: "E" },
  { id: 14, a: "Abstract ideas.", b: "Concrete reality.", dimA: "N", dimB: "S" },
  { id: 15, a: "Help explore feelings.", b: "Help make logical decisions.", dimA: "F", dimB: "T" },
  { id: 16, a: "Keep options open.", b: "Prefer predictability.", dimA: "P", dimB: "J" },
  { id: 17, a: "Communicate little.", b: "Communicate freely.", dimA: "I", dimB: "E" },
  { id: 18, a: "See overall possibilities.", b: "Focus on details.", dimA: "N", dimB: "S" },
  { id: 19, a: "Decide using feelings.", b: "Decide using reason.", dimA: "F", dimB: "T" },
  { id: 20, a: "Plan ahead.", b: "Plan when necessary.", dimA: "J", dimB: "P" },
  { id: 21, a: "Meeting new people.", b: "Being alone.", dimA: "E", dimB: "I" },
  { id: 22, a: "Ideas.", b: "Facts.", dimA: "N", dimB: "S" },
  { id: 23, a: "Convictions.", b: "Logical conclusions.", dimA: "F", dimB: "T" },
  { id: 24, a: "Keep schedules.", b: "Flexible scheduling.", dimA: "J", dimB: "P" },
  { id: 25, a: "Discuss issues in groups.", b: "Think privately first.", dimA: "E", dimB: "I" },
  { id: 26, a: "Execute detailed plans.", b: "Design concepts.", dimA: "S", dimB: "N" },
  { id: 27, a: "Logical people.", b: "Feeling people.", dimA: "T", dimB: "F" },
  { id: 28, a: "Spontaneous.", b: "Planned.", dimA: "P", dimB: "J" },
  { id: 29, a: "Centre of attraction.", b: "Reserved.", dimA: "E", dimB: "I" },
  { id: 30, a: "Imagine possibilities.", b: "Examine details.", dimA: "N", dimB: "S" },
  { id: 31, a: "Emotional experiences.", b: "Analytical thinking.", dimA: "F", dimB: "T" },
  { id: 32, a: "Start meetings on time.", b: "Start when ready.", dimA: "J", dimB: "P" }
];


const generatePDF = async (result) => {
  const pdf = new jsPDF();

  // Set up colors for different personality types
  const typeColors = {
    'ENFP': [255, 165, 0], // Orange
    'ISTJ': [70, 130, 180], // Steel Blue
    'INTJ': [138, 43, 226], // Blue Violet
    'ENTJ': [220, 20, 60], // Crimson
    'ISFP': [255, 20, 147], // Deep Pink
    'ENFJ': [50, 205, 50], // Lime Green
    'ESFJ': [255, 215, 0], // Gold
    'ENTP': [255, 69, 0], // Red Orange
    'ESTJ': [0, 191, 255], // Deep Sky Blue
    'ESFP': [255, 105, 180], // Hot Pink
    'INFP': [186, 85, 211], // Medium Orchid
    'ISFJ': [60, 179, 113], // Medium Sea Green
    'INTP': [255, 140, 0], // Dark Orange
    'ISTP': [0, 206, 209], // Dark Turquoise
    'INFJ': [147, 112, 219], // Medium Purple
    'ESTP': [255, 99, 71] // Tomato
  };

  const primaryColor = typeColors[result.type] || [99, 102, 241];

  // Add title with background
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, 210, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Personal Style Inventory Report', 105, 25, { align: 'center' });

  // Add personality type section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Your Personality Type', 20, 60);

  // Type box with color
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(20, 65, 50, 20, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(result.type, 45, 78, { align: 'center' });

  // Description
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const desc = descriptions[result.type] || "See personality profile in detailed report.";
  const descLines = pdf.splitTextToSize(desc, 120);
  pdf.text(descLines, 80, 75);

  // Add scores section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dimension Scores', 20, 110);

  // Create bar chart for scores
  const dimensions = ['E', 'I', 'N', 'S', 'T', 'F', 'P', 'J'];
  const dimNames = {
    'E': 'Extraversion', 'I': 'Introversion', 'N': 'Intuition', 'S': 'Sensing',
    'T': 'Thinking', 'F': 'Feeling', 'P': 'Perceiving', 'J': 'Judging'
  };

  let yPos = 120;
  dimensions.forEach(dim => {
    if (result.scores[dim] !== undefined) {
      const score = result.scores[dim];
      const percentage = (score / result.maxDimScore) * 100;

      // Dimension name
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${dim} - ${dimNames[dim]}`, 20, yPos);

      // Bar background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(80, yPos - 5, 100, 8, 'F');

      // Bar fill
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(80, yPos - 5, percentage, 8, 'F');

      // Score text
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${score}/${result.maxDimScore}`, 185, yPos);

      yPos += 15;
    }
  });

  // Add interpretation guide
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Score Interpretation', 20, yPos + 10);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const interpretation = [
    '20-21: Balanced preference between dimensions',
    '22-24: Moderate strength in one dimension',
    '25-29: Strong preference in one dimension',
    '30-40: Very strong personality tendency'
  ];

  let interpY = yPos + 20;
  interpretation.forEach(line => {
    pdf.text(line, 25, interpY);
    interpY += 8;
  });

  // Add new page for detailed information
  pdf.addPage();

  // About section
  pdf.setFillColor(240, 248, 255);
  pdf.rect(0, 0, 210, 50, 'F');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('About This Personality Test', 20, 30);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const aboutText = "The Personal Style Inventory helps individuals understand their natural preferences in how they think, interact, make decisions and organize their lives. The test is based on the Myers-Briggs framework which describes personality through four pairs of dimensions that combine to form 16 personality types.";
  const aboutLines = pdf.splitTextToSize(aboutText, 170);
  pdf.text(aboutLines, 20, 60);

  // Dimensions section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('The Four Personality Dimensions', 20, 100);

  const dimensionDetails = [
    {
      title: "Introversion vs Extroversion",
      content: "Introverts prefer working independently and reflecting before acting, while extroverts are outgoing and enjoy interacting with people and external activities.",
      color: [70, 130, 180]
    },
    {
      title: "Intuition vs Sensing",
      content: "Intuitive individuals focus on possibilities, ideas and future concepts, while sensing individuals prefer concrete facts, details and practical information.",
      color: [255, 165, 0]
    },
    {
      title: "Thinking vs Feeling",
      content: "Thinkers make decisions using logic and analysis, while feelers prioritize empathy, values and harmony with others.",
      color: [50, 205, 50]
    },
    {
      title: "Perceiving vs Judging",
      content: "Perceivers stay flexible and open to new information, while judgers prefer structure, planning and firm decisions.",
      color: [138, 43, 226]
    }
  ];

  let dimY = 120;
  dimensionDetails.forEach(dim => {
    // Color bar
    pdf.setFillColor(dim.color[0], dim.color[1], dim.color[2]);
    pdf.rect(15, dimY - 5, 5, 25, 'F');

    // Title
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(dim.title, 25, dimY);

    // Content
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const contentLines = pdf.splitTextToSize(dim.content, 160);
    pdf.text(contentLines, 25, dimY + 8);

    dimY += contentLines.length * 5 + 20;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('Generated on ' + new Date().toLocaleDateString(), 20, 280);
  pdf.text('Personal Style Inventory - MBTI Based Assessment', 105, 280, { align: 'center' });

  // Save the PDF
  pdf.save('MBTI_Test_Results.pdf');
};

export default function PersonalityTest() {

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const q = questions[step];

  const handleScore = (value) => {
    setAnswers({
      ...answers,
      [q.id]: {
        // Score 0..5 for option A (more A = higher), option B is inverse.
        a: value,
        b: 5 - value
      }
    });
  };

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const calculate = () => {
    // Determine the max possible score per dimension (each dimension appears in half of the total questions).
    const perDimCount = questions.length / 2; // 16 for 32 questions
    const maxDimScore = perDimCount * 5; // max 80

    let scores = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, P: 0, J: 0 };

    questions.forEach(q => {
      if (answers[q.id]) {
        const { a, b } = answers[q.id];
        scores[q.dimA] += a;
        scores[q.dimB] += b;
      }
    });

    const type =
      (scores.E > scores.I ? "E" : "I") +
      (scores.N > scores.S ? "N" : "S") +
      (scores.T > scores.F ? "T" : "F") +
      (scores.J > scores.P ? "J" : "P");

    setResult({ scores, type, maxDimScore });
  };

  if (result) {
    return (
      <div className="resultPage">

        <h1>Your Personality Type</h1>

        <div className="typeBox">{result.type}</div>

        {/* <p className="desc">
          {personalityDescriptions[result.type] || "See personality profile in report."}
        </p> */}
        <div style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'justify' }} className="style-card highlight">

          <div className="style-header">
            <h4 style={{ fontSize: '1.5rem' }}>Key Letter Meaning</h4>
          </div>

          <p style={{ fontSize: '1rem' }} className="desc">
            <div style={{ display: 'flex', flexWrap: 'wrap', padding: '20px' }}>
              <div style={{ flex: 1 }}><ul>
                <li>I Introversion</li>
                <li>N Intuition</li>
                <li>T Thinking</li><li>P Perceiving</li>
              </ul></div>
              <div style={{ flex: 1 }}><ul>
                <li>E Extroversion</li>
                <li>S Sensing</li>
                <li>F Feeling</li>
                <li> J Judging</li>
              </ul></div>
            </div>



          </p>

        </div>
        <div style={{ maxWidth: '600px', margin: '20px auto', textAlign: 'justify' }} className="style-card highlight">

          <div className="style-header">
            <h4 style={{ fontSize: '1.5rem' }}>{result.type}</h4>
          </div>

          <p style={{ fontSize: '1rem' }} className="desc">
            {personalityDescriptions[result.type] || "See personality profile in report."}
          </p>

        </div>

        {/* <div className="chart">

{Object.entries(result.scores).map(([k,v])=>(
<div key={k} className="barRow">
<span>{k}</span>
<div className="bar">
<div className="fill" style={{width:(result.maxDimScore ? (v/result.maxDimScore)*100 : 0)+"%"}} />
</div>
<span className="barValue">{v}</span>
</div>
))}

</div> */}

        {/* <button onClick={() => generatePDF(result)} className="downloadBtn">
Download PDF Report
</button> */}

        <button onClick={() => window.location.reload()} className="restart">
          Restart Test
        </button>

      </div>
    )
  }

  return (

    <div className="testPage">

      <h1 className="title">Personal Style Inventory</h1>

      <div className="progress">
        <div style={{ width: ((step + 1) / questions.length) * 100 + "%" }}></div>
      </div>

      <div className="card">

        <h3>Question {q.id}</h3>
        <h3>I Prefer : </h3>

        <p className="optionA"><b>A. </b> {q.a}</p>

        <div className="scoreBoard">
          <div className="scoreButtons">
            <p><b>A. Preferance</b></p>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`scoreBtn ${answers[q.id]?.a === n ? "active" : ""}`}
                onClick={() => handleScore(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <br /><br />
          <div className="scoreButtons">
            <p><b>B. Preferance </b></p>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`scoreBtn ${answers[q.id]?.a === (5-n) ? "active" : ""}`}
                onClick={() => handleScore(5-n)}
              >
                {n}
              </button>
            ))}
          </div>
          {/* <div className="scoreSummary">
            <span className="scoreText">A: {answers[q.id]?.a ?? 2}</span>
            <span className="scoreText">B: {5 - (answers[q.id]?.a ?? 2)}</span>
          </div> */}
        </div>

        <p className="optionB"><b>B. </b> {q.b}</p>

      </div>

      <div className="navBtns">

        <button onClick={prev} disabled={step === 0}>
          Back
        </button>

        {step === questions.length - 1 ?
          <button onClick={calculate}>See Result</button>
          :
          <button onClick={next}>Next</button>
        }

      </div>

    </div>
  )
}