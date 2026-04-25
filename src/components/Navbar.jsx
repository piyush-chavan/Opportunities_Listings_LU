import React, { useState } from "react";
import "./styles.css";
import logo from "../assets/logos/LU_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
// import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [programsopen, setprogramsopen] = useState(false)

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/sign-in');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={logo} alt="Logo" style={{ height: '60px' }} />
                </div>
                <div className="navbar-links">
                    <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
                    <div className="dropdown">
                        <button className="dropdown-btn" onClick={() => setprogramsopen(!programsopen)}>
                            <i className="fa-solid fa-graduation-cap"></i> Programs <i className="fa-solid fa-chevron-down"></i>
                        </button>
                        {programsopen && (
                            <div className="dropdown-content">
                                <Link to="/summer_programs" onClick={() => setprogramsopen(false)}>
                                    <i class="fa-solid fa-award"></i> Summer programs
                                </Link>
                                <Link to="/competitions" onClick={() => setprogramsopen(false)}>
                                    <i class="fa-solid fa-trophy"></i> Competitions
                                </Link>
                                <Link to="/internships" onClick={() => setprogramsopen(false)}>
                                    <i class="fa-solid fa-briefcase"></i> Internships
                                </Link>
                                <Link to="/scholarships" onClick={() => setprogramsopen(false)}>
                                    <i class="fa-brands fa-google-scholar"></i> Scholarships
                                </Link>
                                <Link to="/courses" onClick={() => setprogramsopen(false)}>
                                    <i class="fa-solid fa-award"></i> Courses
                                </Link>

                            </div>
                        )}
                    </div>
                    <div className="dropdown">
                        <button className="dropdown-btn" onClick={toggleDropdown}>
                            <i className="fa-solid fa-info-circle"></i> Assessments <i className="fa-solid fa-chevron-down"></i>
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-content">
                                <Link to="/instructions" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-info"></i> Instructions
                                </Link>
                                <Link to="/test-pipeline" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-chart-line"></i> Psychometric Assessment
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
                                <Link to="/aptitude-test" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-calculator"></i> Aptitude Test
                                </Link>
                                <Link to="/report" onClick={() => setDropdownOpen(false)}>
                                    <i className="fa-solid fa-file"></i> Report
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* <Link to="#about">About</Link>
                    <Link to="#contact">Contact</Link> */}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;