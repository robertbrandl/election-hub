import "./President.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import PollTable from "../../components/PollTable/PollTable";

export const President = () => {
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

  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("national");
  const [selectedState, setSelectedState] = useState("");
  const [isHeadToHead, setIsHeadToHead] = useState(true);
  const [isHighQuality, setIsHighQuality] = useState(true);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [stateColors, setStateColors] = useState({
    California: "#FF6347",
    // Add more states and colors here
  });

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
            (poll) => poll.numeric_grade > 2
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

  return (
    <div>
      <Map stateColors={stateColors} />
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
