import React, { useState } from 'react';
import './OpportunityCard.css';

const selectivity_mapping = {
    "Highly Selective": "Highly Recommended",
    "Selective": "Recommended",
    "General": "Can be considered",
    "Open": "Not Recommended"
};

const InternshipTableCard = ({ opportunity, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const description = opportunity['Subject(s) Details from SOURCE'] || opportunity['Subject(s) Details from Source'] || opportunity['Summary'] || opportunity['Note'] || '';
    const maxLength = 140;

    const defaultColumns = [
        'Internship Name',
        'Organizing Body / Host Institution',
        'Subject Stream',
        'Grade',
        'Format',
        'Duration / Timeline',
        'Application / Registration Deadline',
        'Cost',
        'Compensation & Benefits',
        'Prestige / Selectivity',
        'Official Link'
    ];

    const allFields = Object.keys(opportunity).filter(key => key !== 'id' && opportunity[key]);
    const expandedFields = allFields.filter(key => !defaultColumns.includes(key));

    return (
        <div className="opportunity-card">
            <div className="card-content">
                <div className="card-tag">#{index + 1}</div>

                {opportunity['Program Name'] && <p className="card-program-title">{opportunity['Program Name']}</p>}
                {opportunity['Host Institution / Organizer'] && <p className='card-entity-name'>{opportunity['Host Institution / Organizer']}</p>}

                <hr />
                <br />

                <div className="kv-container">
                    <table className="kv-table">
                        <tbody>
                            <tr>
                                <th>Internship Name</th>
                                <td>{opportunity['Internship Name'] || opportunity['Program Name']}</td>
                            </tr>
                            <tr>
                                <th>Organizing Body / Host Institution</th>
                                <td>{opportunity['Organizing Body / Host Institution'] || opportunity['Host Institution / Organizer']}</td>
                            </tr>
                            <tr>
                                <th>Subject Stream</th>
                                <td>{opportunity['Subject Stream']}</td>
                            </tr>
                            <tr>
                                <th>Grade</th>
                                <td>{opportunity['Grade']}</td>
                            </tr>
                            <tr>
                                <th>Format</th>
                                <td>{opportunity['Format']}</td>
                            </tr>
                            <tr>
                                <th>Duration / Timeline</th>
                                <td>{opportunity['Duration / Timeline'] || opportunity['Duration / Structure']}</td>
                            </tr>
                            <tr>
                                <th>Application / Registration Deadline</th>
                                <td>{opportunity['Application / Registration Deadline'] || opportunity['All Deadlines']}</td>
                            </tr>
                            <tr>
                                <th>Cost</th>
                                <td>{opportunity['Cost']}</td>
                            </tr>
                            <tr>
                                <th>Compensation & Benefits</th>
                                <td>{opportunity['Compensation & Benefits'] || opportunity['Stipend / Compensation']}</td>
                            </tr>
                            <tr>
                                <th>Prestige / Selectivity</th>
                                <td>{selectivity_mapping[opportunity['Prestige / Selectivity']] || opportunity['Prestige / Selectivity']}</td>
                            </tr>
                            <tr>
                                <th>Official Link</th>
                                <td>{opportunity['Official Link'] ? <a target="_blank" rel="noreferrer" href={opportunity['Official Link']}>Visit</a> : 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <details className="card-details">
                    <summary>View All Details</summary>
                    <div className="details-content">
                        {expandedFields.map(key => (
                            <p key={key}><strong>{key}:</strong> {opportunity[key]}</p>
                        ))}
                    </div>
                </details>
            </div>
        </div>
    );
};

export default InternshipTableCard;