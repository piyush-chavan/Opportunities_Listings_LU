import React from "react";
import "./TestPipelineSidebar.css";

const TestPipelineSidebar = ({
  tests,
  currentTestIndex,
  completedTests,
  isOpen,
  onToggle
}) => {
  const getTestStatus = (testIndex) => {
    const testId = tests[testIndex]?.id;
    if (testIndex < currentTestIndex) {
      return "completed";
    } else if (testIndex === currentTestIndex) {
      return "current";
    } else {
      return "pending";
    }
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>Test Progress</h2>
          <span className="progress-counter">
            {currentTestIndex + 1} / {tests.length}
          </span>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${((currentTestIndex + 1) / tests.length) * 100}%` }}
          ></div>
        </div>

        <ul className="test-list">
          {tests.map((test, index) => {
            const status = getTestStatus(index);
            return (
              <li key={test.id} className={`test-item ${status}`}>
                <div className="test-item-content">
                  <span className="test-number">{index + 1}</span>
                  <span className="test-name">{test.name}</span>
                  {status === "completed" && <span className="status-badge">✓</span>}
                  {status === "current" && <span className="status-badge">⏳</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="sidebar-footer">
          <p className="hint">Current: {tests[currentTestIndex]?.name}</p>
        </div>
      </div>

      {!isOpen && (
        <button className="sidebar-expand-btn" onClick={onToggle} title="Expand sidebar">
          ▶
        </button>
      )}
    </>
  );
};

export default TestPipelineSidebar;
