import React from "react";
import "./styles.css";

const Footer = () => {
  return (
    <footer className="lu-footer">
      <div className="lu-footer-container">

        {/* Column 1: Our Services */}
        <div className="lu-footer-column">
          <h4>Our Services</h4>
          <a href="https://www.letsunbound.com/college-counselling" target="_blank" rel="noopener noreferrer">College Counselling</a>
          <a href="https://www.letsunbound.com/ascend-program" target="_blank" rel="noopener noreferrer">Ascend Program</a>
          <a href="https://www.letsunbound.com/academic-tutoring" target="_blank" rel="noopener noreferrer">Academic Tutoring</a>
          <a href="https://www.letsunbound.com/career-discovery" target="_blank" rel="noopener noreferrer">Career Discovery</a>
          <a href="https://www.letsunbound.com/global-competition-prep" target="_blank" rel="noopener noreferrer">Global Competition Prep</a>
          <a href="https://www.letsunbound.com/math-kangaroo" target="_blank" rel="noopener noreferrer">Math Kangaroo</a>
          <a href="https://www.letsunbound.com/uk-admissions" target="_blank" rel="noopener noreferrer">UK Admission</a>
          <a href="https://www.letsunbound.com/passion-projects" target="_blank" rel="noopener noreferrer">Passion Projects</a>
          <a href="https://www.letsunbound.com/research-innovation-lab" target="_blank" rel="noopener noreferrer">Research & Innovation Lab</a>
        </div>

        {/* Column 2: Test Prep */}
        <div className="lu-footer-column">
          <h4>Test Prep</h4>
          <a href="https://www.letsunbound.com/test-prep-sat-old" target="_blank" rel="noopener noreferrer">SAT Prep</a>
          <a href="https://www.letsunbound.com/test-prep-ap" target="_blank" rel="noopener noreferrer">AP Mastery</a>
        </div>

        {/* Column 3: Life Skills */}
        <div className="lu-footer-column">
          <h4>Life Skills</h4>
          <a href="https://www.letsunbound.com/life-skills-math-prep" target="_blank" rel="noopener noreferrer">Math Prep</a>
          <a href="https://www.letsunbound.com/life-skills-public-speaking" target="_blank" rel="noopener noreferrer">Public Speaking</a>
          <a href="https://www.letsunbound.com/life-skills-coding" target="_blank" rel="noopener noreferrer">Coding</a>
          <a href="https://www.letsunbound.com/life-skills-financial-literacy" target="_blank" rel="noopener noreferrer">Financial Literacy</a>
          <a href="https://www.letsunbound.com/life-skills-entreneurship" target="_blank" rel="noopener noreferrer">Entrepreneurship</a>
        </div>

        {/* Column 4: Resources */}
        <div className="lu-footer-column">
          <h4>Resources</h4>
          <a href="https://www.letsunbound.com/blog" target="_blank" rel="noopener noreferrer">Blog</a>
          <a href="https://www.letsunbound.com/events" target="_blank" rel="noopener noreferrer">Events</a>
          <a href="https://www.letsunbound.com/ebooks" target="_blank" rel="noopener noreferrer">Ebooks</a>
          <a href="https://www.letsunbound.com/success-stories" target="_blank" rel="noopener noreferrer">Success Stories</a>
        </div>

        {/* Column 5: Others */}
        <div className="lu-footer-column">
          <h4>Others</h4>
          <a href="https://www.letsunbound.com/join-us-as-a-mentor" target="_blank" rel="noopener noreferrer">Join Us As A Mentor</a>
          <a href="https://www.letsunbound.com/join-us-as-a-counsellor" target="_blank" rel="noopener noreferrer">Join Us As A Counsellor</a>
          <a href="https://www.letsunbound.com/about-us" target="_blank" rel="noopener noreferrer">About Us</a>
        </div>

      </div>

      {/* Bottom Copyright & Policies */}
      <div className="lu-footer-bottom">
        <span>© 2026 Lets Unbound</span>
        <div className="lu-footer-policies">
          <a href="https://www.letsunbound.com/terms-conditions" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
          <a href="https://www.letsunbound.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;