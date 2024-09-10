import React from "react";
import "./EVBar.css";

const EVBar = ({ stateAverages }) => {
  const electoralVotes = {
    "Alabama": 9, "Alaska": 3, "Arizona": 11, "Arkansas": 6, "California": 54,
    "Colorado": 10, "Connecticut": 7, "Delaware": 3, "District of Columbia": 3,
    "Florida": 30, "Georgia": 16, "Hawaii": 4, "Idaho": 4, "Illinois": 19,
    "Indiana": 11, "Iowa": 6, "Kansas": 6, "Kentucky": 8, "Louisiana": 8,
    "Maine": 2, "Maine CD-1": 1, "Maine CD-2": 1, "Maryland": 10, "Massachusetts": 11, "Michigan": 15,
    "Minnesota": 10, "Mississippi": 6, "Missouri": 10, "Montana": 4,
    "Nebraska": 4, "Nebraska CD-2": 1, "Nevada": 6, "New Hampshire": 4, "New Jersey": 14,
    "New Mexico": 5, "New York": 28, "North Carolina": 16, "North Dakota": 3,
    "Ohio": 17, "Oklahoma": 7, "Oregon": 8, "Pennsylvania": 19,
    "Rhode Island": 4, "South Carolina": 9, "South Dakota": 3, "Tennessee": 11,
    "Texas": 40, "Utah": 6, "Vermont": 3, "Virginia": 13, "Washington": 12,
    "West Virginia": 4, "Wisconsin": 10, "Wyoming": 3,
  };

  let totalVotes = { "Republican": 0, "Democrat": 0 };
  let leadingCandidates = { "Republican": "", "Democrat": "" };

  Object.keys(stateAverages).forEach((state) => {
    const stateResult = stateAverages[state];
    let leadingParty = null;
    let highestAverage = 0;
    let leadingCandidate = null;

    Object.keys(stateResult).forEach((candidate) => {
      const avg = stateResult[candidate].average;
      if (avg > highestAverage) {
        highestAverage = avg;
        leadingParty = stateResult[candidate].party;
        leadingCandidate = candidate;
      }
    });

    if (leadingParty === "REP") {
      totalVotes["Republican"] += electoralVotes[state] || 0;
      leadingCandidates["Republican"] = leadingCandidate;
    } else if (leadingParty === "DEM") {
      totalVotes["Democrat"] += electoralVotes[state] || 0;
      leadingCandidates["Democrat"] = leadingCandidate;
    }
  });

  const totalElectoralVotes = 538;
  const republicanPercentage = (totalVotes["Republican"] / totalElectoralVotes) * 100;
  const democratPercentage = (totalVotes["Democrat"] / totalElectoralVotes) * 100;

  return (
    <div className="electoral-vote-bar">
      <div className="candidate-name">{leadingCandidates["Republican"]}</div>
      <div className="bar-container">
        <div className="bar republican" style={{ width: `${republicanPercentage}%` }}>
          {totalVotes["Republican"]} EV
        </div>
        <div className="bar democrat" style={{ width: `${democratPercentage}%` }}>
          {totalVotes["Democrat"]} EV
        </div>
      </div>
      <div className="candidate-name">{leadingCandidates["Democrat"]}</div>
    </div>
  );
};

export default EVBar;
