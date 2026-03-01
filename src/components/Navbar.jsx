import React from "react";
import "./styles.css";
import logo from "../assets/logos/LU_logo.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={logo} alt="Logo" style={{ height: '60px' }} />
                </div>
                <div className="navbar-links">
                    <Link to="/"><i class="fa-solid fa-house"></i> Home</Link>
                    <Link to="/listings"> <i class="fa-solid fa-graduation-cap"></i> Programs</Link>
                    <Link to="#about">About</Link>
                    <Link to="#contact">Contact</Link>
                </div>

                <button className="navbar-btn" onClick={() => navigate('/listings')}><i class="fa-brands fa-wpexplorer"></i> Explore</button>
            </div>
        </nav>
    );
};

export default Navbar;