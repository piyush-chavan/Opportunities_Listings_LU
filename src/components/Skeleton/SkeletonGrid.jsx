import React from "react";
import ProgramCardSkeleton from "./ProgramCardSkeleton";
import "./programSkeleton.css";

const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="skl-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProgramCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default SkeletonGrid;