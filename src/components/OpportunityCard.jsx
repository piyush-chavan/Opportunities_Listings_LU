import React,{useState} from 'react';
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

  const [isExpanded, setIsExpanded] = useState(false);
  const description = opportunity["Description"];
  const maxLength = 100; // Set your desired character limit

  return (
    <div className="opportunity-card">
      <div className="card-content">
        <div className="card-tag">#{index + 1}</div>

        {opportunity["Name of Program"] && <p className="card-program-title">
          {opportunity["Name of Program"]}
        </p>}
        {opportunity["Entity Name"] && <p className='card-entity-name'>
          {opportunity["Entity Name"]}
        </p>}
        {opportunity["Type of Opportunity"] && <div className="card-tag">
          {opportunity["Type of Opportunity"]}
        </div>}
        {opportunity["Season"] && <div className="card-tag">
          {opportunity["Season"]}
        </div>}
        {opportunity["Salary"] && <div className="card-tag">
          {opportunity["Salary"]}
        </div>}
        {opportunity["Mode"] && <div className="card-tag">
          {opportunity["Mode"]}
        </div>}

        {opportunity["Program Fee/Tuition"] && <div className="card-tag">
          {opportunity["Program Fee/Tuition"]}
        </div>}

        {opportunity["This Opportunity is Only Open To"] && <div className="card-tag">
          {opportunity["This Opportunity is Only Open To"]}
        </div>}
      <br />
        {/* {opportunity["Link to Application Page/Website"] && 
        <a target='_blank' href={opportunity["Link to Application Page/Website"]} className='card-text mui-button'>
          <b><i class="fa-solid fa-share"></i> Apply Here</b> 
        </a>} */}

        {opportunity["Address"] && <p className='card-text'>
          <b><i class="fa-solid fa-location-dot"></i> Address :</b> {opportunity["Address"]}
        </p>}

        {opportunity["Location"] && <p className='card-text'>
          <b><i class="fa-solid fa-location-dot"></i> Location : </b>{opportunity["Location"]}
        </p>}

        {opportunity["Application Deadline"] && <p className='card-text'>
          <b><i class="fa-solid fa-calendar"></i> Deadline : </b> {opportunity["Application Deadline"]}
        </p>}

        {opportunity["Interest Area"] &&
          <p className="card-text">
            <b><i class="fa-solid fa-circle-check"></i> Interest Area : </b> {opportunity["Interest Area"]}
          </p>
        }

        {opportunity["Grade"] &&
          <p className="card-text">
            <b><i class="fa-solid fa-user-graduate"></i> Grade : </b> {opportunity["Grade"]}
          </p>
        }

        {opportunity["Age"] &&
          <p className="card-text">
            <b><i class="fa-solid fa-child-reaching"></i> Age : </b> {opportunity["Age"]}
          </p>
        }

        {description && (
          <p className="card-text">
            <b><i class="fa-solid fa-circle-info"></i> Description : </b>
            {isExpanded || description.length <= maxLength
              ? description
              : `${description.slice(0, maxLength)}... `}

            {description.length > maxLength && (
              <span
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ color: '#0b57d0', cursor: 'pointer', fontWeight: '500', marginLeft: '5px' }}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </span>
            )}
          </p>
        )}

{opportunity["Link to Application Page/Website"] && 
        <a target='_blank' href={opportunity["Link to Application Page/Website"]} className='card-text mui-button'>
          <b><i class="fa-solid fa-share"></i> Apply Here</b> 
        </a>}

      </div>

      {/* <div className="card-left">
        <div className="card-tag">#{index + 1}</div>
        {titleValue && (
          <h3 className="card-title">{titleValue}</h3>
        )}
      </div>
      <br />
      <div className='opportunity-card-body'>
        <div className="card-right">
          <div className="card-body">
            <div>{bodyFields.length}</div>
            <div>{opportunity["Title"]}</div>
            <div className="card-program">
              {opportunity["Name of Program"]}
            </div>
            <div className="card-program">
              {opportunity["Name of Program"]}
            </div>
            <div className="card-program">
              {opportunity["Name of Program"]}
            </div>
            {bodyFields.map((field, fieldIndex) => {
              const value = opportunity[field];
              if (!value) return null;

              return (
                <div key={fieldIndex} className="card-field">
                  <span className="field-label">{field}</span>
                  <span className="field-value">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default OpportunityCard;
