import React from "react";
import "./Popup.css";

const Popup = ({ stateName, races, onClose }) => {
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
            {(stateName == "Hawaii" || stateName == "Delaware" || stateName == "Mississippi" || stateName == "Wyoming" || stateName == "Connecticut") && <br />}
            {(stateName == "Hawaii" || stateName == "Delaware" || stateName == "Mississippi" || stateName == "Wyoming" || stateName == "Connecticut" ) &&<h4>***No Polls Conducted. Percentages based on 2018 Senate Election Results.</h4>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
