import React, { useState } from "react";
import "./styles.css";
import logo from "../assets/logos/LU_logo.png";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ isDarkMode, onToggle }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={logo} alt="Logo" style={{ height: '60px' }} />
                </div>
                <div className="navbar-links">
                    <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
                    <Link to="/listings"> <i className="fa-solid fa-graduation-cap"></i> Programs</Link>
                    <div className="dropdown">
                        <button className="dropdown-btn" onClick={toggleDropdown}>
                            <i className="fa-solid fa-info-circle"></i> Assessments <i className="fa-solid fa-chevron-down"></i>
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-content">
                                <Link to="/instructions" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-info"></i> Instructions
                                </Link>
                                <Link to="/riasec" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-chart-simple"></i> RIASEC Test
                                </Link>
                                <Link to="/personality-test" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-brain"></i> Personality Test
                                </Link>
                                <Link to="/learning-style-test" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-brain"></i> Learning Style Test
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link to="#about">About</Link>
                    <Link to="#contact">Contact</Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggle} />
                    <button className="navbar-btn" onClick={() => navigate('/listings')}><i className="fa-brands fa-wpexplorer"></i> Explore</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;