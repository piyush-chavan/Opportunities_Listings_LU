import React, { useState } from 'react';
import './OpportunityCard.css';

const selectivity_mapping = {
    "Highly Selective": "Highly Recommended",
    "Selective": "Recommended",
    "General": "Can be considered",
    "Open": "Not Recommended"
};

const ScholarshipTableCard = ({ opportunity, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const description = opportunity['Subject(s) Details from SOURCE'] || opportunity['Summary'] || opportunity['Note'] || '';
    const maxLength = 140;

    const defaultColumns = [
        'Scholarship Name',
        'Awarding Organization',
        'Subject Stream',
        'Grade',
        'Scholarship Type',
        'Award Amount',
        'Award Period',
        'Application Deadline',
        'Selectivity',
        'Official Link'
    ];

    const allFields = Object.keys(opportunity).filter(key => key !== 'id' && opportunity[key]);
    const expandedFields = allFields.filter(key => !defaultColumns.includes(key));

    return (
        <div className="opportunity-card">
            <div className="card-content">
                <div className="card-tag">#{index + 1}</div>

                {opportunity['Scholarship Name'] && <p className="card-program-title">{opportunity['Scholarship Name']}</p>}
                {opportunity['Awarding Organization'] && <p className='card-entity-name'>{opportunity['Awarding Organization']}</p>}

                <hr />
                <br />

                <div className="kv-container">
                    <table className="kv-table">
                        <tbody>
                            <tr>
                                <th>Scholarship Name</th>
                                <td>{opportunity['Scholarship Name']}</td>
                            </tr>
                            <tr>
                                <th>Awarding Organization</th>
                                <td>{opportunity['Awarding Organization']}</td>
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
                                <th>Scholarship Type</th>
                                <td>{opportunity['Scholarship Type']}</td>
                            </tr>
                            <tr>
                                <th>Award Amount</th>
                                <td>{opportunity['Award Amount']}</td>
                            </tr>
                            <tr>
                                <th>Award Period</th>
                                <td>{opportunity['Award Period']}</td>
                            </tr>
                            <tr>
                                <th>Application Deadline</th>
                                <td>{opportunity['Application Deadline'] || opportunity['All Deadlines']}</td>
                            </tr>
                            <tr>
                                <th>Selectivity</th>
                                <td>{selectivity_mapping[opportunity['Selectivity']] || opportunity['Selectivity']}</td>
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

export default ScholarshipTableCard;