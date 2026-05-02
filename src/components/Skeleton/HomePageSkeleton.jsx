import React from "react";

const HomePageSkeleton = () => {
  return (
    <>
      <style>{`
        /* ===== Unique Prefix: hpSkl ===== */

        .hpSkl-container {
          padding: 40px 20px;
          text-align: center;
        }

        .hpSkl-title {
          height: 36px;
          width: 60%;
          margin: 0 auto 16px;
          border-radius: 8px;
        }

        .hpSkl-subtitle {
          height: 18px;
          width: 50%;
          margin: 0 auto 30px;
          border-radius: 6px;
        }

        .hpSkl-search {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        .hpSkl-search-input {
          height: 40px;
          width: 400px;
          border-radius: 6px;
        }

        .hpSkl-search-btn {
          height: 40px;
          width: 90px;
          border-radius: 6px;
        }

        .hpSkl-grid {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .hpSkl-card {
          width: 140px;
          height: 140px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }

        .hpSkl-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }

        .hpSkl-label {
          width: 80px;
          height: 14px;
          border-radius: 6px;
        }

        /* shimmer base */
        .hpSkl-title,
        .hpSkl-subtitle,
        .hpSkl-search-input,
        .hpSkl-search-btn,
        .hpSkl-icon,
        .hpSkl-label {
          background: linear-gradient(
            90deg,
            #e0e0e0 25%,
            #f0f0f0 37%,
            #e0e0e0 63%
          );
          background-size: 400% 100%;
          animation: hpSkl-loading 1.2s ease infinite;
        }

        @keyframes hpSkl-loading {
          0% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0 50%;
          }
        }

        /* shimmer overlay */
        .hpSkl-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120px;
          height: 100%;
          width: 120px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.6),
            transparent
          );
          animation: hpSkl-shimmer 1.4s infinite;
        }

        @keyframes hpSkl-shimmer {
          100% {
            left: 100%;
          }
        }
      `}</style>

      <div className="hpSkl-container">
        <div className="hpSkl-title"></div>
        <div className="hpSkl-subtitle"></div>

        <div className="hpSkl-search">
          <div className="hpSkl-search-input"></div>
          <div className="hpSkl-search-btn"></div>
        </div>

        <div className="hpSkl-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="hpSkl-card">
              <div className="hpSkl-icon"></div>
              <div className="hpSkl-label"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePageSkeleton;