import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const categories = [
    { title: "Browse All", icon: "🔍", path: "/listings" },
    { title: "Internships", icon: "💼", path: "/listings?type=Internship" },
    { title: "LU Summer Programs", icon: "🏫", path: "/summer_programs" },
    { title: "Research", icon: "🔬", path: "/listings?type=Research" },
    { title: "Summer Programs", icon: "☀️", path: "/listings?season=Summer" },
    { title: "Remote", icon: "💻", path: "/listings?mode=Remote" },
    { title: "STEM", icon: "⚗️", path: "/listings?interest=STEM" },
    { title: "Paid Programs", icon: "💰", path: "/listings?salary=Paid" },
    { title: "High School", icon: "🎓", path: "/listings?grade=Junior" },
    { title: "In Person", icon: "👥", path: "/listings?mode=In Person" },
  ];

  const backgroundImage = ""
//   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
        color: isDarkMode ? "#ffffff" : "#000000",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.2)",
          zIndex: 1,
        }}
      ></div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              color: isDarkMode ? "#ffffff" : "#000000",
            }}
          >
            Discover Opportunities for High Schoolers
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              marginBottom: "2rem",
              color: isDarkMode ? "#cccccc" : "#333333",
            }}
          >
            Search internships, summer programs, competitions & more tailored for your future
          </p>
          <div style={{ maxWidth: "600px", margin: "0 auto", marginBottom: "2rem" }}>
            <input
              type="text"
              placeholder="Search programs, internships, opportunities..."
              style={{
                width: "80%",
                padding: "0.5rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px 0 0 4px",
                backgroundColor: isDarkMode ? "#333333" : "#ffffff",
                color: isDarkMode ? "#ffffff" : "#000000",
              }}
              onClick={() => navigate("/listings")}
            />
            <button
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderLeft: "none",
                borderRadius: "0 4px 4px 0",
                backgroundColor: isDarkMode ? "#555555" : "#007bff",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => navigate("/listings")}
            >
              Search
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                width: "150px",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)",
                color: isDarkMode ? "#ffffff" : "#000000",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onClick={() => navigate(category.path)}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{category.icon}</div>
              <h3 style={{ margin: "0", fontSize: "1rem" }}>{category.title}</h3>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1.1rem",
              backgroundColor: isDarkMode ? "#333333" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onClick={() => navigate("/listings")}
            onMouseOver={(e) => (e.target.style.backgroundColor = isDarkMode ? "#555555" : "#218838")}
            onMouseOut={(e) => (e.target.style.backgroundColor = isDarkMode ? "#333333" : "#28a745")}
          >
            Explore All Opportunities
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;