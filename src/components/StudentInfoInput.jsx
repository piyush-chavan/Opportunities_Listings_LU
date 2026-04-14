import { useState } from "react";

const StudentInfoInput = ({onComplete}) => {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff6f00, #ff9100)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
          width: "320px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#000", marginBottom: "20px" }}>
          Student Info
        </h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "14px",
          }}
        />

        {/* Grade Input */}
        <input
          type="text"
          placeholder="Enter Grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "14px",
          }}
        />

        {/* Button */}
        <button
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#000",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#333")}
          onMouseOut={(e) => (e.target.style.background = "#000")}
          onClick={() => onComplete({name,grade})}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StudentInfoInput;