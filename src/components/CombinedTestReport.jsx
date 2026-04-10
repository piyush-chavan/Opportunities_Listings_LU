import React, { useRef } from "react";
import jsPDF from "jspdf";
import "./TestPipeline.css";

const CombinedTestReport = ({ testResults, tests, onRestart }) => {
  const reportRef = useRef();

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    let yPos = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = doc.internal.pageSize.getWidth() - 2 * margin;

    // Helper function to add text with word wrapping
    const addText = (text, x, y, size = 12, isBold = false) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, maxWidth - 10);
      doc.text(lines, x, y);
      return y + lines.length * (size / 2.5);
    };

    // Add title
    doc.setFillColor(255, 111, 0);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Career & Learning Assessment Report", doc.internal.pageSize.getWidth() / 2, 15, {
      align: "center"
    });

    yPos = 35;
    doc.setTextColor(0, 0, 0);

    // Add date
    const currentDate = new Date().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    yPos = addText(`Report Generated: ${currentDate}`, margin, yPos, 10);
    yPos += 5;

    // Process each test result
    const riasecResult = testResults.riasec;
    const personalityResult = testResults.personality;
    const learningResult = testResults.learning;
    const aptitudeResult = testResults.aptitude;

    // RIASEC Section
    if (riasecResult) {
      yPos = addText("1. RIASEC Career Interest Test", margin, yPos, 14, true);
      yPos += 3;
      yPos = addText(
        `Interest Code: ${riasecResult.code.join("-")}`,
        margin,
        yPos,
        12,
        true
      );
      yPos += 5;

      // Scores
      let scoreText = "Dimension Scores: ";
      Object.entries(riasecResult.scores).forEach(([key, val]) => {
        scoreText += `${key}: ${val}, `;
      });
      scoreText = scoreText.slice(0, -2);
      yPos = addText(scoreText, margin + 2, yPos, 10);
      yPos += 5;

      const descriptions = {
        R: "Realistic - Practical people who work with tools and machines",
        I: "Investigative - Analytical people who like science and research",
        A: "Artistic - Creative individuals in art, music, and design",
        S: "Social - People who like helping and interacting with others",
        E: "Enterprising - Leaders in business and persuasion",
        C: "Conventional - Organized people who enjoy structure and data"
      };

      yPos = addText("Top 3 Interests:", margin + 2, yPos, 10, true);
      yPos += 2;
      riasecResult.code.forEach(code => {
        yPos = addText(`• ${descriptions[code]}`, margin + 5, yPos, 9);
      });

      yPos += 8;
    }

    // Personality Section
    if (personalityResult) {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      yPos = addText("2. Personality Test (MBTI)", margin, yPos, 14, true);
      yPos += 3;
      yPos = addText(`Personality Type: ${personalityResult.type}`, margin, yPos, 12, true);
      yPos += 5;

      const dimensionLabels = {
        E: "Extraversion",
        I: "Introversion",
        N: "Intuition",
        S: "Sensing",
        T: "Thinking",
        F: "Feeling",
        P: "Perceiving",
        J: "Judging"
      };

      yPos = addText("Dimension Breakdown:", margin + 2, yPos, 10, true);
      yPos += 2;

      Object.entries(personalityResult.scores).forEach(([key, val]) => {
        yPos = addText(
          `${dimensionLabels[key]}: ${val}`,
          margin + 5,
          yPos,
          9
        );
      });

      yPos += 8;
    }

    // Learning Style Section
    if (learningResult) {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      yPos = addText("3. Learning Style Assessment", margin, yPos, 14, true);
      yPos += 3;
      yPos = addText(
        `Learning Style: ${learningResult.learningStyle}`,
        margin,
        yPos,
        12,
        true
      );
      yPos += 5;

      yPos = addText(
        `Dominant Orientation: ${learningResult.quadrant}`,
        margin + 2,
        yPos,
        10,
        true
      );
      yPos += 3;

      const styleLabels = {
        CE: "Concrete Experience",
        RO: "Reflective Observation",
        AC: "Abstract Conceptualization",
        AE: "Active Experimentation"
      };

      yPos = addText("Learning Dimension Scores:", margin + 2, yPos, 10, true);
      yPos += 2;

      ["CE", "RO", "AC", "AE"].forEach(key => {
        yPos = addText(
          `${styleLabels[key]}: ${learningResult[key]}`,
          margin + 5,
          yPos,
          9
        );
      });

      yPos += 8;
    }

    // Aptitude Section
    if (aptitudeResult) {
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }

      yPos = addText("4. Aptitude Test (Grade " + aptitudeResult.grade + ")", margin, yPos, 14, true);
      yPos += 3;

      yPos = addText(
        `Overall Score: ${aptitudeResult.total}/${aptitudeResult.totalQuestions} (${aptitudeResult.percentage}%)`,
        margin,
        yPos,
        12,
        true
      );
      yPos += 5;

      yPos = addText("Section Wise Performance:", margin + 2, yPos, 10, true);
      yPos += 2;

      Object.entries(aptitudeResult.sectionWise).forEach(([section, data]) => {
        const sectionPercentage = Math.round((data.score / data.total) * 100);
        yPos = addText(
          `${section}: ${data.score}/${data.total} (${sectionPercentage}%)`,
          margin + 5,
          yPos,
          9
        );
      });

      yPos += 8;
    }

    // Summary Section
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    yPos = addText("Assessment Summary", margin, yPos, 14, true);
    yPos += 5;

    const summaryText =
      "This comprehensive assessment report includes your performance across four key areas: Career Interests (RIASEC), Personality Type (MBTI), Learning Style, and Aptitude. These results provide valuable insights into your strengths, preferences, and potential career paths. Use this information for career guidance, educational planning, and personal development.";

    yPos = addText(summaryText, margin + 2, yPos, 10);

    // Footer
    yPos = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on ${currentDate}`, margin, yPos);
    doc.text("Page " + doc.internal.pages.length, doc.internal.pageSize.getWidth() - margin - 10, yPos);

    // Save PDF
    doc.save("Assessment_Report.pdf");
  };

  return (
    <div className="combined-report-container">
      <div className="report-header">
        <h1>📊 Combined Assessment Report</h1>
        <p>Your Complete Career & Learning Assessment Results</p>
      </div>

      <div className="report-content" ref={reportRef}>
        {/* RIASEC Results */}
        {testResults.riasec && (
          <section className="report-section">
            <div className="section-number">1</div>
            <h2>RIASEC Career Interest Test</h2>
            <div className="result-card">
              <h3>Your Interest Code: <span className="highlight">{testResults.riasec.code.join("-")}</span></h3>
              <div className="scores-grid">
                {Object.entries(testResults.riasec.scores).map(([key, val]) => (
                  <div key={key} className="score-item">
                    <strong>{key}</strong>
                    <span className="score-value">{val}</span>
                  </div>
                ))}
              </div>
              <div className="interests-list">
                <h4>Top 3 Career Interests:</h4>
                <ul>
                  {testResults.riasec.code.map(code => (
                    <li key={code}><strong>{code}:</strong> {getRiasecDescription(code)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Personality Results */}
        {testResults.personality && (
          <section className="report-section">
            <div className="section-number">2</div>
            <h2>Personality Test (MBTI)</h2>
            <div className="result-card">
              <h3>Your Personality Type: <span className="highlight">{testResults.personality.type}</span></h3>
              <div className="personality-breakdown">
                <h4>Dimension Analysis:</h4>
                <div className="dimension-grid">
                  <div className="dimension-pair">
                    <div className="dimension">
                      <span className="dimension-label">Extraversion</span>
                      <span className="dimension-value">{testResults.personality.scores.E}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="dimension">
                      <span className="dimension-label">Introversion</span>
                      <span className="dimension-value">{testResults.personality.scores.I}</span>
                    </div>
                  </div>
                  <div className="dimension-pair">
                    <div className="dimension">
                      <span className="dimension-label">Intuition</span>
                      <span className="dimension-value">{testResults.personality.scores.N}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="dimension">
                      <span className="dimension-label">Sensing</span>
                      <span className="dimension-value">{testResults.personality.scores.S}</span>
                    </div>
                  </div>
                  <div className="dimension-pair">
                    <div className="dimension">
                      <span className="dimension-label">Thinking</span>
                      <span className="dimension-value">{testResults.personality.scores.T}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="dimension">
                      <span className="dimension-label">Feeling</span>
                      <span className="dimension-value">{testResults.personality.scores.F}</span>
                    </div>
                  </div>
                  <div className="dimension-pair">
                    <div className="dimension">
                      <span className="dimension-label">Perceiving</span>
                      <span className="dimension-value">{testResults.personality.scores.P}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="dimension">
                      <span className="dimension-label">Judging</span>
                      <span className="dimension-value">{testResults.personality.scores.J}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Learning Style Results */}
        {testResults.learning && (
          <section className="report-section">
            <div className="section-number">3</div>
            <h2>Learning Style Assessment</h2>
            <div className="result-card">
              <h3>Your Learning Style: <span className="highlight">{testResults.learning.learningStyle}</span></h3>
              <h4 style={{color:'#333'}}>Dominant Orientation: <span className="quadrant">{testResults.learning.quadrant}</span></h4>
              <div className="learning-scores">
                <p><strong>Concrete Experience:</strong> {testResults.learning.CE}</p>
                <p><strong>Reflective Observation:</strong> {testResults.learning.RO}</p>
                <p><strong>Abstract Conceptualization:</strong> {testResults.learning.AC}</p>
                <p><strong>Active Experimentation:</strong> {testResults.learning.AE}</p>
              </div>
            </div>
          </section>
        )}

        {/* Aptitude Results */}
        {testResults.aptitude && (
          <section className="report-section">
            <div className="section-number">4</div>
            <h2>Aptitude Test Results (Grade {testResults.aptitude.grade})</h2>
            <div className="result-card">
              <h3>Overall Score: <span className="highlight">{testResults.aptitude.total}/{testResults.aptitude.totalQuestions}</span></h3>
              <div className="aptitude-percentage">
                <div className="percentage-circle">
                  <span className="percentage-value">{testResults.aptitude.percentage}%</span>
                </div>
              </div>
              <div className="section-performance">
                <h4>Section Wise Performance:</h4>
                <div className="sections-grid">
                  {Object.entries(testResults.aptitude.sectionWise).map(([section, data]) => (
                    <div key={section} className="section-score">
                      <h5>{section}</h5>
                      <p className="score">{data.score}/{data.total}</p>
                      <p className="accuracy">{Math.round((data.score / data.total) * 100)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Summary */}
        <section className="report-section summary-section">
          <h2>Assessment Summary</h2>
          <div className="summary-content">
            <p>
              This comprehensive assessment report includes your performance across four key areas: Career Interests
              (RIASEC), Personality Type (MBTI), Learning Style, and Aptitude. These results provide valuable insights
              into your strengths, preferences, and potential career paths. Use this information for career guidance,
              educational planning, and personal development.
            </p>
          </div>
        </section>
      </div>

      <div className="report-actions">
        <button style={{height:'fit-content'}} className="pdf-btn-1" onClick={generatePDF}>
          📥 Download PDF Report
        </button>
        <button className="restart-btn-1" onClick={onRestart}>
          🔄 Retake Tests
        </button>
      </div>
    </div>
  );
};

function getRiasecDescription(code) {
  const descriptions = {
    R: "Realistic - Practical people who work with tools, machines, or outdoors",
    I: "Investigative - Analytical thinkers who enjoy science and research",
    A: "Artistic - Creative individuals in art, music, writing, and design",
    S: "Social - People who like helping, teaching, and interacting with others",
    E: "Enterprising - Leaders who enjoy business, persuasion, and entrepreneurship",
    C: "Conventional - Organized people who enjoy structure, data, and administration"
  };
  return descriptions[code] || code;
}

export default CombinedTestReport;
