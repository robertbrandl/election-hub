import React from "react";
import "./Popup.css";

const Popup = ({ stateName, races, onClose }) => {
  console.log(races);
  return (
    <div className="popup">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>&times;</button>
        <h2>{stateName}</h2>
        {races.map((race, index) => (
          <div key={index}>
            <h3>{race.seat}</h3>
            <div className="popup-candidates">
              {race.candidates
                .sort((a, b) => b.average - a.average)
                .map((candidate, i) => (
                  <div key={i} className="popup-candidate">
                    <div className="candidate-info">
                      <span className="candidate-name">{candidate.name}</span>
                      <span className="candidate-party">({candidate.party})</span>
                    </div>
                    <span className="candidate-average">
                      {candidate.average.toFixed(2)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
