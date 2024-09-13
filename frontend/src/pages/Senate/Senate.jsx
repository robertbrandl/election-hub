import "./Senate.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import PollTable from "../../components/PollTable/PollTable";
import SenateBar from "../../components/SenateBar/SenateBar";

export const Senate = () => {
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
  
    // Step 1: Identify the most recent poll and DEM/REP candidates for each state
    polls.forEach((poll) => {
      const state = poll.state;
  
      if (!mostRecentCandidates[state] || new Date(poll.end_date) > new Date(mostRecentCandidates[state].end_date)) {
        mostRecentCandidates[state] = {
          poll,
          demCandidate: null,
          repCandidate: null,
        };
  
        // Identify DEM and REP candidates in the most recent poll
        poll.candidates.forEach((candidate) => {
          if (candidate.party === "DEM") {
            mostRecentCandidates[state].demCandidate = candidate.name;
          } else if (candidate.party === "REP") {
            mostRecentCandidates[state].repCandidate = candidate.name;
          } else if (state == "Vermont" && candidate.party === "IND"){
            mostRecentCandidates[state].demCandidate = candidate.name;
          } else if (state === "Nebraska" && (candidate.party === "IND" || candidate.party === "DEM")){
            mostRecentCandidates[state].demCandidate = candidate.name;
          }
        });
      }
    });
  
    // Step 2: Calculate averages using only polls that contain the identified DEM/REP candidates
    polls.forEach((poll) => {
      const state = poll.state;
      const { demCandidate, repCandidate } = mostRecentCandidates[state];
  
      // Check if the poll contains the identified DEM and REP candidates
      const hasDemCandidate = poll.candidates.some(candidate => candidate.name === demCandidate);
      const hasRepCandidate = poll.candidates.some(candidate => candidate.name === repCandidate);
  
      if (hasDemCandidate && hasRepCandidate) {
        if (!stateAverages[state]) {
          stateAverages[state] = {};
        }
  
        poll.candidates.forEach((candidate) => {
          const { name, pct, party } = candidate;
  
          if (!stateAverages[state][name]) {
            stateAverages[state][name] = {
              total: 0,
              count: 0,
              party: party,
            };
          }
  
          stateAverages[state][name].total += pct;
          stateAverages[state][name].count += 1;
        });
      }
    });
  
    // Step 3: Calculate the average for each candidate in each state
    Object.keys(stateAverages).forEach((state) => {
      Object.keys(stateAverages[state]).forEach((candidate) => {
        stateAverages[state][candidate].average =
          stateAverages[state][candidate].total /
          stateAverages[state][candidate].count;
      });
    });
  
    return stateAverages;
  };
  
  

  const determineLeadingCandidate = (stateAverages) => {
    const stateColors = {};
    console.log(stateAverages)

    Object.keys(stateAverages).forEach((state) => {
      let leadingCandidate = null;
      let leadingParty = null;
      let highestAverage = 0;

      Object.keys(stateAverages[state]).forEach((candidate) => {
        const avg = stateAverages[state][candidate].average;
        if (avg > highestAverage) {
          highestAverage = avg;
          leadingCandidate = candidate;
          leadingParty = stateAverages[state][leadingCandidate].party;
        }
      });
      console.log(leadingCandidate)

      // Assign color based on the leading candidate (simplified example)
      if (leadingParty === "REP") {
        stateColors[state] = "#FF6347"; // Red
      } else if (leadingParty === "DEM") {
        stateColors[state] = "#4682B4"; // Blue
      } else {
        stateColors[state] = "#32CD32"; // Green or other
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
      filtered = filtered.filter((poll) => poll.numeric_grade > 2);
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

  return (
    <div>
      <br />
      <SenateBar stateAverages={stateAverage}/>
      <Map stateColors={stateColors} stateAverages={stateAverage}/>
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
        <span>{isHighQuality ? "High Quality" : "All"}</span>
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
