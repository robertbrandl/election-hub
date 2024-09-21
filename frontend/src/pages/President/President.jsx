import "./President.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import PollTable from "../../components/PollTable/PollTable";
import EVBar from "../../components/EVBar/EVBar";

export const President = () => {
  let high_quality_score = 2;//change as needed
  const mergePolls = (polls) => {
    const mergedPolls = [];

    polls.forEach((poll) => {
      const existingPoll = mergedPolls.find(
        (merged) => merged.poll_id === poll.poll_id && merged.question_id === poll.question_id
      );

      if (existingPoll) {
        existingPoll.candidates.push({
          name: poll.candidate_name || 'N/A',
          pct: poll.pct !== undefined ? poll.pct : 'N/A',
          party: poll.party || 'N/A',
        });
      } else {
        mergedPolls.push({
          poll_id: poll.poll_id,
          question_id: poll.question_id,
          pollster: poll.pollster,
          state: poll.state,
          methodology: poll.methodology || 'N/A',
          sample_size: poll.sample_size || 'N/A',
          start_date: poll.start_date,
          url: poll.url || 'N/A',
          end_date: poll.end_date,
          population: poll.population_full,
          sponsors: poll.sponsors,
          sponsor_candidate: poll.sponsor_candidate,
          sponsor_candidate_party: poll.sponsor_candidate_party,
          numeric_grade: poll.numeric_grade,
          stage: poll.stage,
          candidates: [
            {
              name: poll.candidate_name || 'N/A',
              pct: poll.pct !== undefined ? poll.pct : 'N/A',
              party: poll.party || 'N/A',
            },
          ],
        });
      }
    });

    return mergedPolls;
  };
  const calculatePollAverages = (polls) => {
    const stateAverages = {};
  
    polls.forEach((poll) => {
      const hasDemAndRep = poll.candidates.some(candidate => candidate.party === 'DEM' && candidate.name === "Kamala Harris") && 
                       poll.candidates.some(candidate => candidate.party === 'REP' && candidate.name === 'Donald Trump');
      if (poll.state && poll.stage && poll.stage === "general" && hasDemAndRep){
      const state = poll.state;
  
      if (!stateAverages[state]) {
        stateAverages[state] = {};
      }
  
      poll.candidates.forEach((candidate) => {
        const { name, pct, party } = candidate;
  
        if (!stateAverages[state][name]) {
          stateAverages[state][name] = {
            total: 0,
            count: 0,
            party: party, // Include the party here
          };
        }
  
        stateAverages[state][name].total += pct;
        stateAverages[state][name].count += 1;
      });
    }});
  
    // Calculate the average for each candidate in each state
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
  const [activeTab, setActiveTab] = useState("national");
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
          "http://localhost:3000/president/polls",
          {
            params: {
              cycleYear: 2024,
            },
          }
        );

        let mergedPolls = mergePolls(response.data.polls);
        console.log(response.data.polls)
        mergedPolls = mergedPolls.map(poll => {
            if (poll.population === "lv") {
              return { ...poll, population: "Likely Voters" };
            }
            else if (poll.population === "rv") {
                return { ...poll, population: "Registered Voters" };
            }
            else if (poll.population === "a") {
                return { ...poll, population: "Adults" };
            }
            return poll;
          });
          console.log(mergedPolls)
        const stateAverages = calculatePollAverages(mergedPolls);
        setStateAverage(stateAverages)
        const updatedStateColors = determineLeadingCandidate(stateAverages);
        setStateColors(updatedStateColors);
        setPollData(mergedPolls);
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

    if (isHighQuality){
        filtered = filtered.filter(
            (poll) => poll.numeric_grade > high_quality_score
          );
    }

    if (activeTab === "national") {
      filtered = filtered.filter((poll) => poll.state === null).slice(0, 10);
    } else if (activeTab === "state") {
      if (selectedState) {
        filtered = filtered.filter(
          (poll) => poll.state === selectedState
        ).slice(0, 10);
      }
    }

    setFilteredPolls(filtered);
  };

  useEffect(() => {
    if (pollData) {
      updateFilteredPolls(pollData);
    }
  }, [isHeadToHead, isHighQuality, activeTab, selectedState]);

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
  const PresLegend = () => {
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
      <EVBar stateAverages={stateAverage} />
      <div className="map-legend-container">
        <Map stateColors={stateColors} stateAverages={stateAverage} />
        <PresLegend />
      </div>
      <div className="tab-bar">
        <button
          onClick={() => setActiveTab("national")}
          className={activeTab === "national" ? "active" : ""}
        >
          National Polls
        </button>
        <button
          onClick={() => setActiveTab("state")}
          className={activeTab === "state" ? "active" : ""}
        >
          State Polls
        </button>
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
        <span>{isHighQuality ? "High Quality" : "All"}</span>
      </div>
      {activeTab === "state" && <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select a state</option>
                {getUniqueStates().map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>}
      {filteredPolls && filteredPolls.length > 0 ? (
        <>
          {activeTab === "national" && <PollTable data={filteredPolls} />}
          {activeTab === "state" && (
            <div>
              {selectedState && <PollTable data={filteredPolls} />}
            </div>
          )}
        </>
      ) : (
        <div>No polls available for the 2024 cycle.</div>
      )}
    </div>
  );
};
