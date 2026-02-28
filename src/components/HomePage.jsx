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
            <div style={{ padding:"50px 20%",display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div className="simple-card" onClick={() => navigate('/listings?category=internship')}>
                    <div className="simple-card-icon">
                        <i class="fa-brands fa-safari"></i>
                    </div>
                    <div className="simple-card-text">
                        Browse All
                    </div>
                </div>

            </div>

        </section>
    );
};

export default HomePage;