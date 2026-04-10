import React, { useState, useEffect } from "react";
import "./TestPipeline.css";
import TestPipelineSidebar from "./TestPipelineSidebar";
import CombinedTestReport from "./CombinedTestReport";
import RiasecTestPipeline from "./RiasecTestPipeline";
import PersonalityTestPipeline from "./PersonalityTestPipeline";
import LearningStyleTestPipeline from "./LearningStyleTestPipeline";
import AptitudeTestPipeline from "./AptitudeTestPipeline";

const TestPipeline = () => {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [allTestsCompleted, setAllTestsCompleted] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tests = [
    { name: "RIASEC Career Test", id: "riasec", component: RiasecTestPipeline },
    { name: "Personality Test (MBTI)", id: "personality", component: PersonalityTestPipeline },
    { name: "Learning Style Test", id: "learning", component: LearningStyleTestPipeline },
    { name: "Aptitude Test", id: "aptitude", component: AptitudeTestPipeline }
  ];

  // Handle browser back button and reload
  useEffect(() => {
    const handleBackButton = (e) => {
      if (!allTestsCompleted) {
        e.preventDefault();
        const confirmed = window.confirm(
          "⚠️ WARNING: You cannot go back during the test. Your progress will be lost. Are you sure?"
        );
        if (!confirmed) {
          window.history.pushState(null, null, window.location.href);
        }
      }
    };

    const handleBeforeUnload = (e) => {
      if (!allTestsCompleted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("popstate", handleBackButton);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Initial history state
    window.history.pushState(null, null, window.location.href);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [allTestsCompleted]);

  const handleTestComplete = (testId, results) => {
    setIsTransitioning(true);
    setTestResults((prev) => ({
      ...prev,
      [testId]: results
    }));

    setTimeout(() => {
      if (currentTestIndex < tests.length - 1) {
        setCurrentTestIndex((prev) => prev + 1);
      } else {
        setAllTestsCompleted(true);
      }
      setIsTransitioning(false);
    }, 500);
  };

  const handleRestartTests = () => {
    const confirmed = window.confirm(
      "Are you sure you want to restart all tests? All progress will be lost."
    );
    if (confirmed) {
      setCurrentTestIndex(0);
      setAllTestsCompleted(false);
      setTestResults({});
      setIsTransitioning(false);
    }
  };

  if (allTestsCompleted) {
    return (
      <CombinedTestReport
        testResults={testResults}
        tests={tests}
        onRestart={handleRestartTests}
      />
    );
  }

  const CurrentTestComponent = tests[currentTestIndex].component;

  return (
    <div className="test-pipeline-container">
      <TestPipelineSidebar
        tests={tests}
        currentTestIndex={currentTestIndex}
        completedTests={Object.keys(testResults)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className={`test-pipeline-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle sidebar"
        >
          ☰
        </button>

        <div className={`test-wrapper ${isTransitioning ? "transitioning" : ""}`}>
          <CurrentTestComponent
            onComplete={(results) => handleTestComplete(tests[currentTestIndex].id, results)}
            testNumber={currentTestIndex + 1}
            totalTests={tests.length}
          />
        </div>
      </div>
    </div>
  );
};

export default TestPipeline;
