import React from 'react';
import './OpportunityCard.css';

const OpportunityCard = ({ opportunity, index, columnsToDisplay }) => {
  // Get all fields except 'id'
  let fields = Object.keys(opportunity).filter(key => key !== 'id');
  
  // Filter fields based on columnsToDisplay configuration
  if (columnsToDisplay && Array.isArray(columnsToDisplay) && columnsToDisplay.length > 0) {
    fields = fields.filter(field => columnsToDisplay.includes(field));
  }
  
  // Get the first field for the title (or use first available field)
  const titleField = fields.find(field => opportunity[field]) || fields[0];
  const titleValue = titleField ? opportunity[titleField] : null;
  
  // Get remaining fields for the body (exclude title field)
  const bodyFields = fields.filter(field => field !== titleField);
  
  return (
    <div className="opportunity-card">
      <div className="card-left">
        <div className="card-id">#{index + 1}</div>
        {titleValue && (
          <h3 className="card-title">{titleValue}</h3>
        )}
      </div>
      <br />
      <div className='opportunity-card-body'>
      <div className="card-right">
        <div className="card-body">
          {bodyFields.map((field, fieldIndex) => {
            const value = opportunity[field];
            if (!value) return null;
            
            return (
              <div key={fieldIndex} className="card-field">
                <span className="field-label">{field}:</span>
                <span className="field-value">{value}</span>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
