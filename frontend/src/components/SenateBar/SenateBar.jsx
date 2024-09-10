import React from "react";
import "./SenateBar.css";

const SenateBar = ({ stateAverages }) => {

  let totalVotes = { "Republican": 38, "Democrat": 28 };

  Object.keys(stateAverages).forEach((state) => {
    const stateResult = stateAverages[state];
    let leadingParty = null;
    let highestAverage = 0;

    Object.keys(stateResult).forEach((candidate) => {
      const avg = stateResult[candidate].average;
      if (avg > highestAverage) {
        highestAverage = avg;
        leadingParty = stateResult[candidate].party;
      }
    });

    if (leadingParty === "REP") {
      totalVotes["Republican"] += 1;
    } else {//else if (leadingParty === "DEM")
      totalVotes["Democrat"] += 1;
    }
  });

  const totalSeats = 100;
  const republicanPercentage = (totalVotes["Republican"] / totalSeats) * 100;
  const democratPercentage = (totalVotes["Democrat"] / totalSeats) * 100;

  return (
    <div className="electoral-vote-bar">
      <div className="candidate-name">Republican</div>
      <div className="bar-container">
        <div className="bar republican" style={{ width: `${republicanPercentage}%` }}>
          {totalVotes["Republican"]} Seats
        </div>
        <div className="bar democrat" style={{ width: `${democratPercentage}%` }}>
          {totalVotes["Democrat"]} Seats
        </div>
      </div>
      <div className="candidate-name">Democrat</div>
    </div>
  );
};

export default SenateBar;
