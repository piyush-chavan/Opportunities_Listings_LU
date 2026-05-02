import React from "react";
import "./programSkeleton.css";

const ProgramCardSkeleton = () => {
  return (
    <div className="skl-card">
      <div className="skl-title"></div>

      <div className="skl-subtitle"></div>

      <div className="skl-tags">
        <div className="skl-tag"></div>
        <div className="skl-tag"></div>
        <div className="skl-tag"></div>
      </div>

      <div className="skl-row"></div>
      <div className="skl-row short"></div>

      <div className="skl-row"></div>
      <div className="skl-row short"></div>

      <div className="skl-footer"></div>
    </div>
  );
};

export default ProgramCardSkeleton;