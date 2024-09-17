import "./Senate.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import PollTable from "../../components/PollTable/PollTable";
import SenateBar from "../../components/SenateBar/SenateBar";

export const Senate = () => {
  let high_quality_score = 2;//change as needed
  const mergePolls = (polls) => {
    const mergedPolls = [];

    polls.forEach((poll) => {
      const existingPoll = mergedPolls.find(
        (merged) =>
          merged.poll_id === poll.poll_id &&
          merged.question_id === poll.question_id
      );

      if (existingPoll) {
        existingPoll.candidates.push({
          name: poll.candidate_name || "N/A",
          pct: poll.pct !== undefined ? poll.pct : "N/A",
          party: poll.party || "N/A",
        });
      } else {
        mergedPolls.push({
          poll_id: poll.poll_id,
          question_id: poll.question_id,
          pollster: poll.pollster,
          state: poll.state,
          methodology: poll.methodology || "N/A",
          sample_size: poll.sample_size || "N/A",
          start_date: poll.start_date,
          url: poll.url || "N/A",
          end_date: poll.end_date,
          population: poll.population_full,
          sponsors: poll.sponsors,
          sponsor_candidate: poll.sponsor_candidate,
          sponsor_candidate_party: poll.sponsor_candidate_party,
          seat_number: poll.seat_number,
          numeric_grade: poll.numeric_grade,
          candidates: [
            {
              name: poll.candidate_name || "N/A",
              pct: poll.pct !== undefined ? poll.pct : "N/A",
              party: poll.party || "N/A",
            },
          ],
        });
      }
    });

    return mergedPolls;
  };

  const calculatePollAverages = (polls) => {
    const stateAverages = {};
    const mostRecentCandidates = {};
    const additionalCandidatesSet = {};
  
    // Step 1: Find the most recent candidates for each state
    polls.forEach((poll) => {
      const state = poll.state;
      const hasBobMenendez = poll.candidates.some(candidate => candidate.name === "Bob Menendez");
      if (state === "New Jersey" && hasBobMenendez) {
        return; // Skip this poll
      }
      const seatNumber = poll.seat_number; // Get the seat number
  
      // Use state and seat_number as key for Nebraska, but just state for others
      const stateKey = state === "Nebraska" ? `${state}-${seatNumber}` : state;
  
      // Initialize or update most recent candidates based on stateKey
      if (
        !mostRecentCandidates[stateKey] ||
        (new Date(poll.end_date) > new Date(mostRecentCandidates[stateKey].end_date) && poll.candidates.length > 2)
      ) {
        mostRecentCandidates[stateKey] = {
          poll,
          demCandidate: null,
          repCandidate: null,
          additionalCandidates: {},
        };
  
        poll.candidates.forEach((candidate) => {
          if (candidate.party === "DEM") {
            mostRecentCandidates[stateKey].demCandidate = candidate.name;
          } else if (candidate.party === "REP") {
            mostRecentCandidates[stateKey].repCandidate = candidate.name;
          } else if (state === "Vermont" && candidate.party === "IND") {
            mostRecentCandidates[stateKey].demCandidate = candidate.name;
          } else if (state === "Nebraska" && (candidate.party === "IND" || candidate.party === "DEM")) {
            mostRecentCandidates[stateKey].demCandidate = candidate.name;
          } else {
            mostRecentCandidates[stateKey].additionalCandidates[candidate.party] = candidate.name;
          }
        });
  
        additionalCandidatesSet[stateKey] = mostRecentCandidates[stateKey].additionalCandidates;
      }
    });
  
    // Step 2: Calculate averages using high-quality polls, fallback to all polls if no high-quality polls exist
    const calculateAveragesForPolls = (pollsToUse, stateKey) => {
      pollsToUse.forEach((poll) => {
        const hasBobMenendez = poll.candidates.some(candidate => candidate.name === "Bob Menendez");
        if (poll.state === "New Jersey" && hasBobMenendez) {
          return; // Skip this poll
        }
        const { demCandidate, repCandidate, additionalCandidates } = mostRecentCandidates[stateKey] || {};
  
        if (demCandidate && repCandidate) {
          const hasDemCandidate = poll.candidates.some((candidate) => candidate.name === demCandidate);
          const hasRepCandidate = poll.candidates.some((candidate) => candidate.name === repCandidate);
  
          let hasAllAdditionalCandidates = true;
          if (additionalCandidatesSet[stateKey] && poll.candidates.length > 2) {
            Object.keys(additionalCandidatesSet[stateKey]).forEach((party) => {
              const expectedCandidate = additionalCandidatesSet[stateKey][party];
              const hasCandidate = poll.candidates.some((candidate) => candidate.name === expectedCandidate);
              if (!hasCandidate) {
                hasAllAdditionalCandidates = false;
              }
            });
          }
  
          // Only process if DEM, REP, and all additional candidates are found
          if (hasDemCandidate && hasRepCandidate && hasAllAdditionalCandidates) {
            if (!stateAverages[stateKey]) {
              stateAverages[stateKey] = {};
            }
  
            poll.candidates.forEach((candidate) => {
              const { name, pct, party } = candidate;
  
              if (!stateAverages[stateKey][name]) {
                stateAverages[stateKey][name] = {
                  total: 0,
                  count: 0,
                  party: party,
                };
              }
  
              stateAverages[stateKey][name].total += pct;
              stateAverages[stateKey][name].count += 1;
            });
          }
        }
      });
    };
  
    const statesChecked = new Set();
  
    // Ensure fallback to all polls if no high-quality polls exist or if high-quality polls don't have correct candidates
    polls.forEach((poll) => {
      const state = poll.state;
      const seatNumber = poll.seat_number;
      const stateKey = state === "Nebraska" ? `${state}-${seatNumber}` : state;
  
      // Skip if we've already processed this stateKey
      if (statesChecked.has(stateKey)) {
        return;
      }
  
      // Separate high-quality and all polls
      const highQualityPolls = polls.filter(p => p.state === state && (!seatNumber || p.seat_number === seatNumber) && p.numeric_grade > high_quality_score);
      const allPolls = polls.filter(p => p.state === state && (!seatNumber || p.seat_number === seatNumber));
  
      let usedPolls = [];
      let fallbackToAllPolls = false;
  
      // If averageQuality is true, first try high-quality polls
      if (averageQuality) {
        if (highQualityPolls.length > 0) {
          const correctCandidatesInHighQuality = highQualityPolls.some(poll => {
            const { demCandidate, repCandidate } = mostRecentCandidates[stateKey] || {};
            return poll.candidates.some((candidate) => candidate.name === demCandidate) &&
                   poll.candidates.some((candidate) => candidate.name === repCandidate);
          });
  
          // If high-quality polls do not have correct candidates, fallback to all polls
          if (correctCandidatesInHighQuality) {
            usedPolls = highQualityPolls;
          } else {
            fallbackToAllPolls = true;
          }
        } else {
          fallbackToAllPolls = true; // No high-quality polls, fallback to all
        }
      }
  
      if (!averageQuality || fallbackToAllPolls) {
        // If not using high-quality or falling back to all polls
        usedPolls = allPolls;
      }
  
      // Calculate averages for the selected polls
      calculateAveragesForPolls(usedPolls, stateKey);
  
      statesChecked.add(stateKey);
    });
  
    // Step 3: Calculate final averages for each candidate
    Object.keys(stateAverages).forEach((stateKey) => {
      Object.keys(stateAverages[stateKey]).forEach((candidate) => {
        stateAverages[stateKey][candidate].average =
          stateAverages[stateKey][candidate].total / stateAverages[stateKey][candidate].count;
      });
    });
  
    // Handle states with no polls
    const customCandidates = {
      "Hawaii": {
        "Mazie Hirono": { total: 60, count: 1, party: "DEM", average: 71.15 },
        "Bob McDermott": { total: 40, count: 1, party: "REP", average: 28.85 },
      },
      "Delaware": {
        "Lisa Blunt Rochester": { total: 55, count: 1, party: "DEM", average: 59.95 },
        "Eric Hansen": { total: 45, count: 1, party: "REP", average: 37.81 },
      },
      "Connecticut": {
        "Chris Murphy": { total: 55, count: 1, party: "DEM", average: 59.53 },
        "Matthew Corey": { total: 45, count: 1, party: "REP", average: 39.35 },
      },
      "Rhode Island": {
        "Sheldon Whitehouse": { total: 55, count: 1, party: "DEM", average: 61.44 },
        "Patricia Morgan": { total: 45, count: 1, party: "REP", average: 38.33 },
      },
      "Wyoming": {
        "Scott Morrow": { total: 55, count: 1, party: "DEM", average: 30.10 },
        "John Barrasso": { total: 45, count: 1, party: "REP", average: 66.96 },
      },
      "Mississippi": {
        "Ty Pinkins": { total: 55, count: 1, party: "DEM", average: 39.47 },
        "Roger Wicker": { total: 45, count: 1, party: "REP", average: 58.49 },
      },
    };
  
    const statesWithNoPolls = ["Hawaii", "Delaware", "Rhode Island", "Connecticut", "Wyoming", "Mississippi"];
  
    statesWithNoPolls.forEach((state) => {
      if (!stateAverages[state] && customCandidates[state]) {
        stateAverages[state] = customCandidates[state];
      }
    });
  
    return stateAverages;
  };
  
  
  
  
  
  

  const determineLeadingCandidate = (stateAverages) => {
    const stateColors = {};
  
    Object.keys(stateAverages).forEach((state) => {
      let leadingCandidate = null;
      let secondCandidate = null;
      let highestAverage = 0;
      let secondHighestAverage = 0;
  
      // Find leading and second candidate
      Object.keys(stateAverages[state]).forEach((candidate) => {
        const avg = stateAverages[state][candidate].average;
        if (avg > highestAverage) {
          secondHighestAverage = highestAverage;
          secondCandidate = leadingCandidate;
          highestAverage = avg;
          leadingCandidate = candidate;
        } else if (avg > secondHighestAverage) {
          secondHighestAverage = avg;
          secondCandidate = candidate;
        }
      });
  
      const leadingParty = stateAverages[state][leadingCandidate].party;
      const margin = highestAverage - secondHighestAverage;
  
      // Determine shading based on margin
      let color = "";
      if (leadingParty === "REP") {
        if (margin <= 2) {
          color = "#FFCCCB"; // Very light red
        } else if (margin <= 5) {
          color = "#FF7F7F"; // Lighter red
        } else if (margin <= 10) {
          color = "#FF6347"; // Medium red
        } else {
          color = "#FF0000"; // Dark red
        }
      } else if (leadingParty === "DEM") {
        if (margin <= 2) {
          color = "#ADD8E6"; // Very light blue
        } else if (margin <= 5) {
          color = "#6CA6CD"; // Lighter blue
        } else if (margin <= 10) {
          color = "#4682B4"; // Medium blue
        } else {
          color = "#00008B"; // Dark blue
        }
      } else {
        if (margin <= 2) {
          color = "#98FB98"; // Very light green
        } else if (margin <= 5) {
          color = "#32CD32"; // Lighter green
        } else if (margin <= 10) {
          color = "#228B22"; // Medium green
        } else {
          color = "#006400"; // Dark green
        }
      }
  
      // Handle Nebraska seat logic with adjusted colors
      if (state !== "Nebraska-0" && state !== "Nebraska-2") {
        stateColors[state] = color;
      } else if (state === "Nebraska-0") {
        stateColors["Nebraska"] = color;
      }
    });
  
    return stateColors;
  };
  

  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isHeadToHead, setIsHeadToHead] = useState(true);
  const [isHighQuality, setIsHighQuality] = useState(true);
  const [averageQuality, setAverageQuality] = useState(false);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [stateColors, setStateColors] = useState({});
  const [stateAverage, setStateAverage] = useState(null);

  useEffect(() => {
    setError("");
    async function fetchPolls() {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/senate/polls",
          {
            params: {
              cycleYear: 2024,
            },
          }
        );

        let mergedPolls = mergePolls(response.data.polls);
        mergedPolls = mergedPolls.map((poll) => {
          if (poll.population === "lv") {
            return { ...poll, population: "Likely Voters" };
          } else if (poll.population === "rv") {
            return { ...poll, population: "Registered Voters" };
          } else if (poll.population === "a") {
            return { ...poll, population: "Adults" };
          }
          return poll;
        });

        const stateAverages = calculatePollAverages(mergedPolls);
        setStateAverage(stateAverages)
        const updatedStateColors = determineLeadingCandidate(stateAverages);

        setPollData(mergedPolls);
        setStateColors(updatedStateColors);
        updateFilteredPolls(mergedPolls);
      } catch (e) {
        console.log(e);
        setError(e.response || e.message);
      }
      setLoading(false);
    }
    fetchPolls();
  }, []);
  useEffect(() => {
    setError("");
    async function fetchPolls() {
      setLoading(true);
      try {

        const stateAverages = calculatePollAverages(pollData);
        setStateAverage(stateAverages)
        const updatedStateColors = determineLeadingCandidate(stateAverages);

        setStateColors(updatedStateColors);
      } catch (e) {
        console.log(e);
        setError(e.response || e.message);
      }
      setLoading(false);
    }
    fetchPolls();
  }, [averageQuality]);

  const updateFilteredPolls = (polls) => {
    let filtered = polls;

    if (isHeadToHead) {
      filtered = filtered.filter(
        (poll) => poll.candidates && poll.candidates.length === 2
      );
    } else {
      filtered = filtered.filter(
        (poll) => poll.candidates && poll.candidates.length > 2
      );
    }

    if (isHighQuality) {
      filtered = filtered.filter((poll) => poll.numeric_grade > high_quality_score);
    }

    if (selectedState) {
      filtered = filtered.filter((poll) => poll.state === selectedState).slice(0, 10);
    }

    setFilteredPolls(filtered);
  };

  useEffect(() => {
    if (pollData) {
      updateFilteredPolls(pollData);
    }
  }, [isHeadToHead, isHighQuality, selectedState]);

  const getUniqueStates = () => {
    if (!pollData) return [];
    const states = pollData
      .map((poll) => poll.state)
      .filter((state) => state)
      .sort();
    return Array.from(new Set(states));
  };

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div className="error-gen">Error: {error}</div>;
  }
  const SenateLegend = () => {
    return (
      <div className="senate-legend">
        <h4>Margin Breakdown</h4>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#FFCCCB" }}></div>
          <span>Tilt R (0-2%)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#FF7F7F" }}></div>
          <span>Lean R (2-5%)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#FF6347" }}></div>
          <span>Likely R (5-10%)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#FF0000" }}></div>
          <span>Safe R (&gt;10%)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#ADD8E6" }}></div>
          <span>Tilt D (0-2%)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#6CA6CD" }}></div>
          <span>Lean D (2-5%)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#4682B4" }}></div>
          <span>Likely D (5-10%)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ backgroundColor: "#00008B" }}></div>
          <span>Safe D (&gt;10%)</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <br />
      <SenateBar stateAverages={stateAverage}/>
      <div className="map-legend-container">
        <Map stateColors={stateColors} stateAverages={stateAverage}/>
        <div className="toggle-container">
          <label className="switch">
            <input
              type="checkbox"
              checked={averageQuality}
              onChange={() => setAverageQuality(!averageQuality)}
            />
            <span className="slider round"></span>
          </label>
          <span>{averageQuality ? "High Quality: ON" : "High Quality: OFF"}</span>
        </div>
        <SenateLegend />
      </div>
      <div className="toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={isHeadToHead}
            onChange={() => setIsHeadToHead(!isHeadToHead)}
          />
          <span className="slider round"></span>
        </label>
        <span>{isHeadToHead ? "Head-to-Head Polls" : "Full Field Polls"}</span>
      </div>
      <div className="toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={isHighQuality}
            onChange={() => setIsHighQuality(!isHighQuality)}
          />
          <span className="slider round"></span>
        </label>
        <span>{isHighQuality ? "High Quality: ON" : "High Quality: OFF"}</span>
      </div>
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option value="">Select a state</option>
        {getUniqueStates().map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
      {filteredPolls && filteredPolls.length > 0 ? (
        <PollTable data={filteredPolls} />
      ) : (
        <div>No polls available for the 2024 cycle.</div>
      )}
    </div>
  );
};
