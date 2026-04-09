import "./aptitude.css";
import Report from "./Report";
export default function ResultPage({ result }) {
  return (
    <div className="result-container report-container">
        <div className="card">
      <h1>Total Score: {result.total}/50</h1>

      <h2>Section Wise</h2>
      {Object.entries(result.sectionWise).map(([section, score]) => (
        <div key={section}>
          {section}: {score}
        </div>
      ))}
      </div>
      <Report/>
    </div>
  );
}