import React, { useState } from 'react';
import './OpportunityCard.css';

const selectivity_mapping = {
  "Highly Selective": "Highly Recommended",
  "Selective": "Recommended",
  "General": "Can be considered",
  "Open": "Not Recommended"
}

const OpportunityCardCompetition = ({ opportunity, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const note = opportunity['Note'] || '';
  const applicationLink = opportunity['Official Link'] || opportunity['official link'] || '';
  const description = opportunity['Subject(s) Details from SOURCE'] || note || '';
  const maxLength = 140;

  return (
    <div className="opportunity-card">
      <div className="card-content">
        <div className="card-tag">#{index + 1}</div>

        {opportunity['Competition Name'] && <p className="card-program-title">{opportunity['Competition Name']}</p>}
        {opportunity['Organizing Body / Host Institution'] && <p className='card-entity-name'>{opportunity['Organizing Body / Host Institution']}</p>}

        <hr />
        <br />

        <div className="kv-container">
          <table className="kv-table">
            <tbody>
              <tr>
                <th>Country</th>
                <td>{opportunity['Country'] || 'N/A'}</td>
              </tr>
              <tr>
                <th>Subject Stream</th>
                <td>{opportunity['Subject Stream'] || 'N/A'}</td>
              </tr>
              <tr>
                <th>Grade</th>
                <td>{opportunity['Grade'] || 'Any'}</td>
              </tr>
              <tr>
                <th>Deadline</th>
                <td>{opportunity['Application / Registration Deadline'] || opportunity['All Deadlines'] || 'N/A'}</td>
              </tr>
              <tr>
                <th>Format</th>
                <td>{opportunity['Format'] || opportunity['Format Details'] || 'N/A'}</td>
              </tr>
              <tr>
                <th>Cost</th>
                <td>{opportunity['Cost'] || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {applicationLink && (
          <a target="_blank" rel="noreferrer" href={applicationLink} className='card-text mui-button'>
            <b>Official Link</b>
          </a>
        )}
        <br />
        <details>
          <summary style={{ cursor: 'pointer', color: '#cddc39' }}>
            Detailed View
          </summary>
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {opportunity['Competition Type'] && <div className="card-tag">{opportunity['Competition Type']}</div>}
              {opportunity['Competition Value'] && <div className="card-tag">{opportunity['Competition Value']}</div>}
              {opportunity['Subject'] && <div className="card-tag">{opportunity['Subject']}</div>}
              {opportunity['Team Size'] && <div className="card-tag">Team: {opportunity['Team Size']}</div>}
              {opportunity['Rounds / Structure'] && <div className="card-tag">{opportunity['Rounds / Structure']}</div>}
              {opportunity['Duration / Timeline'] && <div className="card-tag">{opportunity['Duration / Timeline']}</div>}
              {opportunity['Citizenship'] && <div className="card-tag">{opportunity['Citizenship']}</div>}
              {opportunity['Residency'] && <div className="card-tag">{opportunity['Residency']}</div>}
              {opportunity['Enrollment Rule'] && <div className="card-tag">{opportunity['Enrollment Rule']}</div>}
              {opportunity['Geographic Access'] && <div className="card-tag">{opportunity['Geographic Access']}</div>}
              {opportunity['Data Year'] && <div className="card-tag">{opportunity['Data Year']}</div>}
            </div>

            <table className="kv-table" style={{ marginTop: '15px', width: '100%' }}>
              <tbody>
                {opportunity['Age'] && <tr><th>Age</th><td>{opportunity['Age']}</td></tr>}
                {opportunity['Prestige / Selectivity'] && <tr><th>Selectivity</th><td>{selectivity_mapping[opportunity['Prestige / Selectivity']] || opportunity['Prestige / Selectivity']}</td></tr>}
                {opportunity['Eligibility Details from Source'] && <tr><th>Eligibility</th><td>{opportunity['Eligibility Details from Source']}</td></tr>}
                {opportunity['Cost Details'] && <tr><th>Cost Details</th><td>{opportunity['Cost Details']}</td></tr>}
                {opportunity['Awards & Recognition'] && <tr><th>Awards & Recognition</th><td>{opportunity['Awards & Recognition']}</td></tr>}
                {opportunity['Application Requirements'] && <tr><th>Application Requirements</th><td>{opportunity['Application Requirements']}</td></tr>}
                {opportunity['Deadline Passed / Not'] && <tr><th>Deadline Status</th><td>{opportunity['Deadline Passed / Not']}</td></tr>}
                {opportunity['All Deadlines'] && <tr><th>All Deadlines</th><td>{opportunity['All Deadlines']}</td></tr>}
              </tbody>
            </table>

            {description && (
              <p className="card-text">
                <b>Details: </b>
                {isExpanded || description.length <= maxLength ? description : `${description.slice(0, maxLength)}... `}
                {description.length > maxLength && (
                  <span onClick={() => setIsExpanded(!isExpanded)} style={{ color: '#0b57d0', cursor: 'pointer', marginLeft: 6 }}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </span>
                )}
              </p>
            )}

            {opportunity['Official Rules'] && (
              <a target="_blank" rel="noreferrer" href={opportunity['Official Rules']} className='card-text mui-button'>
                Official Rules
              </a>
            )}

            {opportunity['LU Rating'] && <p className="card-text"><b>LU Rating:</b> {opportunity['LU Rating']}</p>}
            {opportunity['LU Remarks'] && <p className="card-text"><b>LU Remarks:</b> {opportunity['LU Remarks']}</p>}
          </div>
        </details>
      </div>
    </div>
  );
};

export default OpportunityCardCompetition;
