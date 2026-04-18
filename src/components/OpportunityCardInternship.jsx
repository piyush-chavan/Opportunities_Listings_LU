import React, { useState } from 'react';
import './OpportunityCard.css';

const selectivity_mapping = {
    "Highly Selective": "Highly Recommended",
    "Selective": "Recommended",
    "General": "Can be considered",
    "Open": "Not Recommended"
}
const OpportunityCardInternship = ({ opportunity, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const description = opportunity['Subject(s) Details from SOURCE'] || opportunity['Summary'] || opportunity['Note'] || '';
    const maxLength = 140;

    return (
        <div className="opportunity-card">
            <div className="card-content">
                <div className="card-tag">#{index + 1}</div>

                {opportunity['Program Name'] && <p className="card-program-title">{opportunity['Program Name']}</p>}
                {opportunity['Host Institution / Organizer'] && <p className='card-entity-name'>{opportunity['Host Institution / Organizer']}</p>}

                <hr />
                <br />

                <div class="kv-container">
                    <table class="kv-table">
                        <tbody>
                            <tr>
                                <th>Subject</th>
                                <td>{opportunity['Subject']}</td>
                            </tr>
                            <tr>
                                <th>Subject Stream</th>
                                <td>{opportunity['Subject Stream']}</td>
                            </tr>
                            <tr>
                                <th>Application Deadline</th>
                                <td>{opportunity['Application Deadline'] || opportunity['All Deadlines']}</td>
                            </tr>
                            <tr>
                                <th>Cost</th>
                                <td>{opportunity['Cost']}</td>
                            </tr>
                            <tr>
                                <th>Cost Details</th>
                                <td>{opportunity['Cost Details']}</td>
                            </tr>
                            <tr>
                                <th>Selectivity</th>
                                <td>{selectivity_mapping[opportunity['Selectivity']]}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* {opportunity['Subject'] && <p className="card-text"><b>Subject:</b> {opportunity['Subject']}</p>}
                {opportunity['Subject Stream'] && <p className="card-text"><b>Subject Stream:</b> {opportunity['Subject Stream']}</p>}
                {opportunity['Application Deadline'] && <p className='card-text'><b>Deadline:</b> {opportunity['Application Deadline'] || opportunity['All Deadlines']}</p>}
                {opportunity['Cost'] && <p className="card-text"><b>Cost:</b> {opportunity['Cost']}</p>}
                {opportunity['Cost Details'] && <p className="card-text"><b>Cost Details:</b> {opportunity['Cost Details']}</p>}
                {opportunity['Selectivity'] && <p className="card-text"><b>Selectivity:</b> {selectivity_mapping[opportunity['Selectivity']]}</p>} */}
                {opportunity['Official Link'] && (
                    <a target="_blank" rel="noreferrer" href={opportunity['Official Link']} className='card-text mui-button'>
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
                            {opportunity['Duration/Timeline'] && <div className="card-tag">{opportunity['Duration/Timeline']}</div>}
                            {opportunity['Program Value'] && <div className="card-tag">{opportunity['Program Value']}</div>}
                            {opportunity['Format'] && <div className="card-tag">{opportunity['Format']}</div>}
                            {opportunity['Country'] && <div className="card-tag">{opportunity['Country']}</div>}
                            {opportunity['Citizenship'] && <div className="card-tag">{opportunity['Citizenship']}</div>}
                            {opportunity['Residency'] && <div className="card-tag">{opportunity['Residency']}</div>}
                            {opportunity['Enrollment Rule (School)'] && <div className="card-tag">{opportunity['Enrollment Rule (School)']}</div>}
                            {opportunity['Geographic Access'] && <div className="card-tag">{opportunity['Geographic Access']}</div>}
                            {opportunity['Cost'] && <div className="card-tag">{opportunity['Cost']}</div>}
                            {opportunity['Data Year'] && <div className="card-tag">{opportunity['Data Year']}</div>}

                        </div>

                        {opportunity['Eligibility Details from SOURCE'] && <p className="card-text"><b>Eligibility:</b> {opportunity['Eligibility Details from SOURCE']}</p>}

                        {opportunity['Age'] && <p className="card-text"><b>Age:</b> {opportunity['Age']}</p>}
                        {opportunity['Grade'] && <p className="card-text"><b>Grade:</b> {opportunity['Grade']}</p>}


                        {description && (
                            <p className="card-text">
                                <b>Description: </b>
                                {isExpanded || description.length <= maxLength ? description : `${description.slice(0, maxLength)}... `}
                                {description.length > maxLength && (
                                    <span onClick={() => setIsExpanded(!isExpanded)} style={{ color: '#0b57d0', cursor: 'pointer', marginLeft: 6 }}>
                                        {isExpanded ? 'Show Less' : 'Show More'}
                                    </span>
                                )}
                            </p>
                        )}

                        {opportunity['LU Rating'] && <p className="card-text"><b>LU Rating:</b> {opportunity['LU Rating']}</p>}
                        {opportunity['LU Remarks'] && <p className="card-text"><b>LU Remarks:</b> {opportunity['LU Remarks']}</p>}
                        {opportunity['Notes'] && <p className="card-text"><b>Notes:</b> {opportunity['Notes']}</p>}
                        {/* {opportunity['Source'] && <p className="card-text"><b>Source:</b> {opportunity['Source']}</p>} */}
                        {opportunity['Tagging'] && <p className="card-text"><b>Tags:</b> {opportunity['Tagging']}</p>}

                    </div>
                </details>
            </div>
        </div>
    );
};

export default OpportunityCardInternship;
