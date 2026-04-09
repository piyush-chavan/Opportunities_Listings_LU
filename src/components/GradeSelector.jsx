import "./aptitude.css";
export default function GradeSelector({ setGrade }) {
  return (
    <div>
      <h1>Aptitude Test</h1> <br />
      <h2 style={{textAlign:'center'}}>Select Your Grade/Class : </h2> <br />

      <div className="grade-container">

        {["G8", "G9", "G10", "G11", "G12"].map(g => (
          <button key={g} onClick={() => setGrade(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}