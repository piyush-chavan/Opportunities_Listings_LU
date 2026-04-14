import "./Report.css";

const Report = () => {
    return (
        <div style={{color:'white'}} className="report-container">

            <h1 className="title">Aptitude & Career Report</h1>

            {/* Purpose */}
            <section className="card">
                <h2>Purpose of This Report</h2>
                <p>
                    This report supports career discovery and exploration for a Grade XY student.
                    It helps understand thinking style, learning patterns, and future pathways.
                </p>
            </section>

            {/* Aptitude Areas */}
            <section className="card">
                <h2>Key Aptitude Areas</h2>
                <ul>
                    <li>Language & Expression</li>
                    <li>Numbers & Data</li>
                    <li>Logical Reasoning</li>
                    <li>Visual & Spatial Thinking</li>
                    <li>Scientific & Mechanical Thinking</li>
                    <li>Attention to Detail</li>
                    <li>Practical Judgment</li>
                </ul>
            </section>

            {/* Numerical */}
            <section className="card">
                <h2>Numerical Aptitude</h2>
                <p>Comfort with numbers, calculations, and logic.</p>

                <h3>Careers</h3>
                <ul>
                    <li>Data Scientist</li>
                    <li>Economist</li>
                    <li>Chartered Accountant</li>
                    <li>Financial Analyst</li>
                    <li>Statistician</li>
                </ul>

                <h3>Fields</h3>
                <ul>
                    <li>Mathematics</li>
                    <li>Statistics</li>
                    <li>Economics</li>
                    <li>Finance</li>
                    <li>Data Science</li>
                </ul>
            </section>

            {/* DI */}
            <section className="card">
                <h2>Data Interpretation (DI)</h2>
                <p>Ability to analyze charts, graphs, and trends.</p>

                <h3>Careers</h3>
                <ul>
                    <li>Business Analyst</li>
                    <li>Market Research Analyst</li>
                    <li>Management Consultant</li>
                </ul>

                <h3>Fields</h3>
                <ul>
                    <li>Business Administration</li>
                    <li>Economics</li>
                    <li>Data Analytics</li>
                </ul>
            </section>

            {/* Mechanical */}
            <section className="card">
                <h2>Mechanical Aptitude</h2>
                <p>Understanding machines and systems.</p>

                <h3>Careers</h3>
                <ul>
                    <li>Mechanical Engineer</li>
                    <li>Robotics Engineer</li>
                    <li>Automobile Engineer</li>
                </ul>

                <h3>Fields</h3>
                <ul>
                    <li>Mechanical Engineering</li>
                    <li>Robotics</li>
                    <li>Mechatronics</li>
                </ul>
            </section>

            {/* Verbal */}
            <section className="card">
                <h2>Verbal Aptitude</h2>
                <p>Communication, comprehension, and expression.</p>

                <h3>Careers</h3>
                <ul>
                    <li>Lawyer</li>
                    <li>Journalist</li>
                    <li>Teacher</li>
                    <li>Content Writer</li>
                </ul>

                <h3>Fields</h3>
                <ul>
                    <li>Law</li>
                    <li>Psychology</li>
                    <li>Journalism</li>
                    <li>Communication</li>
                </ul>
            </section>

            {/* Career Table */}
            <section className="card">
                <h2>Career Mapping</h2>

                <table className="career-table">
                    <thead>
                        <tr>
                            <th>MBTI</th>
                            <th>Aptitude</th>
                            <th>Career Cluster</th>
                            <th>Examples</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>INTJ</td>
                            <td>Numerical + DI</td>
                            <td>Strategic & Analytical Careers</td>
                            <td>Data Scientist, Economist, AI Researcher, Systems Engineer</td>
                        </tr>
                        <tr>
                            <td>INTP</td>
                            <td>Numerical</td>
                            <td>Research & Innovation</td>
                            <td>Mathematician, Physicist, Software Engineer, Academic Researcher</td>
                        </tr>
                        <tr>
                            <td>ENTJ</td>
                            <td>Numerical + Verbal</td>
                            <td>Leadership & Business Strategy</td>
                            <td>Business Executive, Investment Banker, Entrepreneur, Management Consultant</td>
                        </tr>
                        <tr>
                            <td>ENTP</td>
                            <td>Verbal + DI</td>
                            <td>Innovation & Strategy</td>
                            <td>Marketing Strategist, Product Manager, Entrepreneur, Political Analyst</td>
                        </tr>
                        <tr>
                            <td>INFJ</td>
                            <td>Verbal</td>
                            <td>Helping & Purpose-driven Careers</td>
                            <td>Psychologist, Counselor, Social Worker, NGO Leader</td>
                        </tr>
                        <tr>
                            <td>INFP</td>
                            <td>Verbal</td>
                            <td>Creative & Human-centered Careers</td>
                            <td>Writer, Filmmaker, Graphic Designer, Therapist</td>
                        </tr>
                        <tr>
                            <td>ENFJ</td>
                            <td>Verbal + DI</td>
                            <td>Leadership in People Development</td>
                            <td>Teacher, HR Leader, Corporate Trainer, Organizational Psychologist</td>
                        </tr>
                        <tr>
                            <td>ENFP</td>
                            <td>Verbal</td>
                            <td>Creative & Communication Careers</td>
                            <td>Journalist, Media Professional, Marketing Manager, Event Manager</td>
                        </tr>
                        <tr>
                            <td>ISTJ</td>
                            <td>Numerical + DI</td>
                            <td>Structured & Administrative Careers</td>
                            <td>Accountant, Auditor, Government Officer, Operations Manager</td>
                        </tr>
                        <tr>
                            <td>ISFJ</td>
                            <td>Verbal</td>
                            <td>Service-oriented Careers</td>
                            <td>Nurse, Teacher, Healthcare Administrator, Social Worker</td>
                        </tr>
                        <tr>
                            <td>ESTJ</td>
                            <td>Numerical + DI</td>
                            <td>Management & Administration</td>
                            <td>Business Manager, Project Manager, Operations Director</td>
                        </tr>
                        <tr>
                            <td>ESFJ</td>
                            <td>Verbal</td>
                            <td>People-centered Service Careers</td>
                            <td>HR Professional, Hospitality Manager, School Counselor</td>
                        </tr>
                        <tr>
                            <td>ISTP</td>
                            <td>Mechanical + Numerical</td>
                            <td>Technical & Engineering Careers</td>
                            <td>Mechanical Engineer, Pilot, Robotics Engineer, Automotive Engineer</td>
                        </tr>
                        <tr>
                            <td>ISFP</td>
                            <td>Mechanical + Creative</td>
                            <td>Design & Artistic Careers</td>
                            <td>Fashion Designer, Interior Designer, Photographer</td>
                        </tr>
                        <tr>
                            <td>ESTP</td>
                            <td>Mechanical + DI</td>
                            <td>Action-oriented Business Careers</td>
                            <td>Entrepreneur, Sales Manager, Sports Manager, Stock Trader</td>
                        </tr>
                        <tr>
                            <td>ESFP</td>
                            <td>Verbal</td>
                            <td>Entertainment & Public Interaction</td>
                            <td>Actor, Media Personality, Tourism Professional, Event Manager</td>
                        </tr>
                    </tbody>
                </table>
            </section>

        </div>
    );
};

export default Report;