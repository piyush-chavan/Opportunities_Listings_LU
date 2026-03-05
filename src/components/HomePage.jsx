import React from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Discover Opportunities for High Schoolers</h1>
                <p>Search internships, summer programs, competitions & more</p>

                <div className="hero-search" onClick={() => navigate('/listings')}>
                    <input
                        type="text"
                        placeholder="Search programs, internships..."
                    />
                    <button>Search</button>
                </div>
            </div>
            <div style={{ padding: "50px 10%", display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div className="simple-card" onClick={() => navigate('/listings')}>
                    <div className="simple-card-icon">
                        <i class="fa-brands fa-safari"></i>
                    </div>
                    <div className="simple-card-text">
                        Browse All
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?type=Internship')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-briefcase"></i>
                    </div>
                    <div className="simple-card-text">
                        Internships
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/summer_programs')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-sun"></i>
                    </div>
                    <div className="simple-card-text">
                        LU Summer Programs
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?type=Research')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-flask"></i>
                    </div>
                    <div className="simple-card-text">
                        Research
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?season=Summer')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-sun"></i>
                    </div>
                    <div className="simple-card-text">
                        Summer Programs
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?mode=Remote')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-laptop"></i>
                    </div>
                    <div className="simple-card-text">
                        Remote
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?interest=STEM')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-atom"></i>
                    </div>
                    <div className="simple-card-text">
                        STEM
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?salary=Paid')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-money-bill-wave"></i>
                    </div>
                    <div className="simple-card-text">
                        Paid Programs
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?grade=Junior')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <div className="simple-card-text">
                        High School
                    </div>
                </div>

                <div className="simple-card" onClick={() => navigate('/listings?mode=In Person')}>
                    <div className="simple-card-icon">
                        <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div className="simple-card-text">
                        In Person
                    </div>
                </div>

            </div>

        </section>
    );
};

export default HomePage;