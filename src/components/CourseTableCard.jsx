import React, { useState } from 'react';
import './OpportunityCard.css';

const selectivity_mapping = {
    "Highly Selective": "Highly Recommended",
    "Selective": "Recommended",
    "General": "Can Be Considered",
    "Open": "Not Recommended"
};

const CourseTableCard = ({ opportunity, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const description = opportunity['Subject(s) Details from SOURCE'] || opportunity['Summary'] || opportunity['Note'] || '';
    const maxLength = 140;

    const defaultColumns = [
        'Course / Certification Name',
        'Provider / Host Institution',
        'Subject Stream',
        'Grade',
        'Rigour Level',
        'Cost',
        'Official Link'
    ];

    const allFields = Object.keys(opportunity).filter(key => key !== 'id' && opportunity[key]);
    const expandedFields = allFields.filter(key => !defaultColumns.includes(key));

    return (
        <div className="opportunity-card">
            <div className="card-content">
                <div className="card-tag">#{index + 1}</div>

                {opportunity['Course / Certification Name'] && <p className="card-program-title">{opportunity['Course / Certification Name']}</p>}
                {opportunity['Provider / Host Institution'] && <p className='card-entity-name'>{opportunity['Provider / Host Institution']}</p>}

                <hr />
                <br />

                <div className="kv-container">
                    <table className="kv-table">
                        <tbody>
                            <tr>
                                <th>Course / Certification Name</th>
                                <td>{opportunity['Course / Certification Name']}</td>
                            </tr>
                            <tr>
                                <th>Provider / Host Institution</th>
                                <td>{opportunity['Provider / Host Institution']}</td>
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
                                <th>Rigour Level</th>
                                <td>{opportunity['Rigour Level']}</td>
                            </tr>
                            <tr>
                                <th>Cost</th>
                                <td>{opportunity['Cost']}</td>
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

export default CourseTableCard;