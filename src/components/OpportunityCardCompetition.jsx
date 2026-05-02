import React, { useState } from 'react';
import './OpportunityCard.css';

const selectivity_mapping = {
  "Highly Selective": "Highly Recommended",
  "Selective": "Recommended",
  "General": "Can be considered",
  "Open": "Not Recommended"
}
function excelDateToJSDate(serial) {
  try{
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400; // seconds
  const date_info = new Date(utc_value * 1000);
  return date_info.toDateString();
  }
  catch(err){
    return "N/A"
  }
  return "N/A"
}

const OpportunityCardCompetition = ({ opportunity, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const note = opportunity['Note'] || '';
  const applicationLink = opportunity['Official Link'] || opportunity['official link'] || '';
  const description = opportunity['Subject(s) Details from SOURCE'] || note || '';
  const maxLength = 140;

  return (
    <div className="opportunity-card" style={{width:'340px'}}>
      <div className="card-content">
        <div className="card-tag tag-default">#{index + 1}</div>

        {opportunity['Competition Name'] && <p className="card-program-title">{opportunity['Competition Name']}</p>}
        {opportunity['Organizing Body / Host Institution'] && <p className='card-entity-name'>{opportunity['Organizing Body / Host Institution']}</p>}

        <hr />
        {opportunity['Format'] && <div className="card-tag tag-default">{opportunity['Format']}</div>}
        {opportunity['Country'] && <div className="card-tag tag-default">{opportunity['Country']}</div>}
        {opportunity['Cost'] && <div className="card-tag tag-default">{opportunity['Cost']}</div>}
        {opportunity['Format'] && <div className="card-tag tag-default">{opportunity['Format']}</div>}

        <div className="kv-container">
          <table className="kv-table">
            <tbody>
              {/* <tr>
                <th>Country</th>
                <td>{opportunity['Country'] || 'N/A'}</td>
              </tr> */}
              <tr>
                <th><i class="fa-solid fa-book"></i></th>
                <td>{opportunity['Subject Stream'] || 'N/A'}</td>
              </tr>
              <tr>
                <th><i class="fa-solid fa-person-arrow-up-from-line"></i></th>
                <td>{opportunity['Age'] || 'Any'}</td>
              </tr>
              <tr>
                <th><i class="fa-solid fa-user-graduate"></i></th>
                <td>{opportunity['Grade'] || 'Any'}</td>
              </tr>
              <tr>
                <th><i class="fa-solid fa-calendar"></i></th>
                <td>{excelDateToJSDate(opportunity['Application / Registration Deadline']) ||  'N/A'}</td>
              </tr>
              {/* <tr>
                <th>Format</th>
                <td>{opportunity['Format'] || opportunity['Format Details'] || 'N/A'}</td>
              </tr>
              <tr>
                <th>Cost</th>
                <td>{opportunity['Cost'] || 'N/A'}</td>
              </tr> */}
            </tbody>
          </table>
        </div>

        <details >
          <summary style={{ cursor: 'pointer', color: '#3951dc', fontSize: '12px' }}>
            Detailed View
          </summary>
          <div style={{ fontSize: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {opportunity['Competition Type'] && <div className="card-tag tag-default">{opportunity['Competition Type']}</div>}
              {/* {opportunity['Competition Value'] && <div className="card-tag tag-default">{opportunity['Competition Value']}</div>} */}
              {opportunity['Subject'] && <div className="card-tag tag-default">{opportunity['Subject']}</div>}
              {opportunity['Team Size'] && <div className="card-tag tag-default">Team: {opportunity['Team Size']}</div>}
              {/* {opportunity['Rounds / Structure'] && <div className="card-tag tag-default">{opportunity['Rounds / Structure']}</div>} */}
              {/* {opportunity['Duration / Timeline'] && <div className="card-tag tag-default">{opportunity['Duration / Timeline']}</div>} */}
              {opportunity['Citizenship'] && <div className="card-tag tag-default">{opportunity['Citizenship']}</div>}
              {opportunity['Residency'] && <div className="card-tag tag-default">{opportunity['Residency']}</div>}
              {opportunity['Enrollment Rule'] && <div className="card-tag tag-default">{opportunity['Enrollment Rule']}</div>}
              {opportunity['Geographic Access'] && <div className="card-tag tag-default">{opportunity['Geographic Access']}</div>}
              {opportunity['Data Year'] && <div className="card-tag tag-default">{opportunity['Data Year']}</div>}
            </div>


            {/* {opportunity['Age'] && <p>Age: {opportunity['Age']}</p>} */}
            {opportunity['Prestige / Selectivity'] && <p><b>Selectivity:</b> {selectivity_mapping[opportunity['Prestige / Selectivity']] || opportunity['Prestige / Selectivity']}</p>}
            {opportunity['Eligibility Details from Source'] && <p><b>Eligibility:</b> {opportunity['Eligibility Details from Source']}</p>}
            {opportunity['Cost Details'] && <p><b>Cost Details:</b> {opportunity['Cost Details']}</p>}
            {opportunity['Awards & Recognition'] && <p><b>Awards & Recognition:</b> {opportunity['Awards & Recognition']}</p>}
            {opportunity['Application Requirements'] && <p><b>Application Requirements:</b> {opportunity['Application Requirements']}</p>}
            {opportunity['Deadline Passed / Not'] && <p><b>Deadline Status:</b> {opportunity['Deadline Passed / Not']}</p>}
            {opportunity['All Deadlines'] && <p><b>All Deadlines:</b> {opportunity['All Deadlines']}</p>}


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

            {applicationLink && (
              <a target="_blank" rel="noreferrer" href={applicationLink} className='card-text mui-button'>
                <b>Official Link</b>
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
