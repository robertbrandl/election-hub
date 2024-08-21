import React from 'react';
import './Popup.css';

const Popup = ({ stateName, candidates, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>&times;</button>
        <h2>{stateName}</h2>
        <div className="popup-candidates">
          {candidates.map((candidate, index) => (
            <div key={index} className="popup-candidate">
              <div className="candidate-info">
                <span className="candidate-name">{candidate.name}</span>
                <span className="candidate-party">({candidate.party})</span>
              </div>
              <span className="candidate-average">{candidate.average.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
