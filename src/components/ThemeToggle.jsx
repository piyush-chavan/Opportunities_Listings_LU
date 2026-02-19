import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <div className="theme-toggle-container">
      <span className={`theme-label ${!isDarkMode ? 'active' : ''}`}>Light</span>
      <label className="theme-switch">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={onToggle}
        />
        <span className="slider"></span>
      </label>
      <span className={`theme-label ${isDarkMode ? 'active' : ''}`}>Dark</span>
    </div>
  );
};

export default ThemeToggle;
