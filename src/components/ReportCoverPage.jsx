import React from "react";
import "./report-static-pages.css";

const ReportCoverPage = ({ student_info, date = new Date().toLocaleString() }) => {
    return (
        <div className="report-page cover-page">

            {/* PAGE 1 */}
            <div className="page gradient-bg">
                <div className="header">
                    <img src={require('../assets/logos/LU_logo.png')} alt="" />
                    <h1 style={{color:'lightgoldenrodyellow',fontSize:'36px',fontWeight:'bold'}} >Brainwave Psychometric Assessment</h1>
                    <p style={{fontWeight:'500'}}>
                        Unlock Your Potential: Discover Your Ideal Career Path With Our Comprehensive Assessment
                    </p>
                </div>

                <div className="user-info">
                    <h2>Created for</h2>
                    <h1 className="name">{student_info.name}</h1>
                    <p>Grade {student_info.grade}</p>
                    <p>{date}</p>
                </div>
                <img style={{width:'100%',marginTop:'auto'}} src={require('../assets/report-images/front-page-image.png')} alt="" />
            </div>

            {/* PAGE 2 */}
            <div className="page light-bg center">
                {/* <h1>🎉 Congratulations</h1>
        <p>You are one step closer to your ideal career</p>

        <div className="timeline">
          <div>✔ Register for Assessment</div>
          <div>✔ Successfully Complete Test</div>
          <div>✔ Discover Insights</div>
          <div>✔ Explore Career Options</div>
        </div> */}
                        <img style={{width:'100%'}} src={require('../assets/report-images/Apr25_Pranav Career Assessment and  Psychometric Test-02.png')} alt="report-path" />
            </div>

            {/* PAGE 3 */}
            <div className="page light-bg">
                {/* <h1>What you will find in the report</h1>
        <ul className="list">
          <li>Building Blocks of This Report</li>
          <li>Summary of Your Results</li>
          <li>Detailed Analysis</li>
          <li>Personality Profile</li>
          <li>Career Interest Profile</li>
          <li>Aptitude Profile</li>
          <li>Explanation of Results</li>
          <li>Counsellor’s Note</li>
          <li>What’s Next</li>
          <li>Resources</li>
        </ul> */}
                        <img style={{width:'100%'}} src={require('../assets/report-images/Apr25_Pranav Career Assessment and  Psychometric Test-03.png')} alt="report-path" />

            </div>

            {/* PAGE 4 */}
            <div className="page light-bg">
                <h1>Building Blocks of this Report</h1>

                <div className="grid">
                    <div className="card-121 red">
                        <h3>Personality Profile</h3>
                        <p>Understanding thinking, emotions & behavior</p>
                    </div>

                    <div className="card-121 green">
                        <h3>Career Interest</h3>
                        <p>Fields and domains you enjoy</p>
                    </div>

                    <div className="card-121 orange">
                        <h3>Aptitude</h3>
                        <p>Your natural abilities and talents</p>
                    </div>

                    <div className="card-121 yellow">
                        <h3>Recommendations</h3>
                        <p>Personalized career suggestions</p>
                    </div>
                </div>

                <p className="note">
                    This report is your compass, combining personality, interests, and aptitude to guide your career.
                </p>
                        <img style={{width:'100%'}} src={require('../assets/report-images/Apr25_Pranav Career Assessment and  Psychometric Test-04.png')} alt="report-path" />

            </div>
        </div>
    );
};

export default ReportCoverPage;