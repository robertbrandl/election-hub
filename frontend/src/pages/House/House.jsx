import "./House.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import PollTable from "../../components/PollTable/PollTable";

export const House = () => {
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
          numeric_grade: poll.numeric_grade,
          seat_number: poll.seat_number,
          seat_name: poll.seat_name,
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

  const calculateDistrictAverages = (polls) => {
    const districtAverages = {};

    polls.forEach((poll) => {
      const state = poll.state;
      const district = poll.seat_number;

      if (!districtAverages[state]) {
        districtAverages[state] = {};
      }

      if (!districtAverages[state][district]) {
        districtAverages[state][district] = {};
      }

      poll.candidates.forEach((candidate) => {
        const { name, pct, party } = candidate;

        if (!districtAverages[state][district][name]) {
          districtAverages[state][district][name] = {
            total: 0,
            count: 0,
            party: party, // Include the party here
          };
        }

        districtAverages[state][district][name].total += pct;
        districtAverages[state][district][name].count += 1;
      });
    });

    // Calculate the average for each candidate in each district
    Object.keys(districtAverages).forEach((state) => {
      Object.keys(districtAverages[state]).forEach((district) => {
        Object.keys(districtAverages[state][district]).forEach((candidate) => {
          districtAverages[state][district][candidate].average =
            districtAverages[state][district][candidate].total /
            districtAverages[state][district][candidate].count;
        });
      });
    });

    return districtAverages;
  };

  const determineLeadingCandidate = (districtAverages) => {
    const districtColors = {};

    Object.keys(districtAverages).forEach((state) => {
      districtColors[state] = {};

      Object.keys(districtAverages[state]).forEach((district) => {
        let leadingCandidate = null;
        let leadingParty = null;
        let highestAverage = 0;

        Object.keys(districtAverages[state][district]).forEach((candidate) => {
          const avg = districtAverages[state][district][candidate].average;
          if (avg > highestAverage) {
            highestAverage = avg;
            leadingCandidate = candidate;
            leadingParty =
              districtAverages[state][district][leadingCandidate].party;
          }
        });

        // Assign color based on the leading candidate (simplified example)
        if (leadingParty === "REP") {
        } else if (leadingParty === "DEM") {
        } else {
        }
      });
    });

    return districtColors;
  };

  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isHeadToHead, setIsHeadToHead] = useState(true);
  const [isHighQuality, setIsHighQuality] = useState(true);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [districtColors, setDistrictColors] = useState({});
  const [districtAverage, setDistrictAverage] = useState(null);

  useEffect(() => {
    setError("");
    async function fetchPolls() {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/house/polls",
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

        const districtAverages = calculateDistrictAverages(mergedPolls);
        setDistrictAverage(districtAverages);

        setPollData(mergedPolls);
        setDistrictColors(districtColors);
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
      filtered = filtered.filter((poll) => poll.state === selectedState);
    }

    if (selectedDistrict) {
      filtered = filtered.filter(
        (poll) => poll.seat_number === parseInt(selectedDistrict)
      );
    }

    setFilteredPolls(filtered);
  };

  useEffect(() => {
    if (pollData) {
      updateFilteredPolls(pollData);
    }
  }, [isHeadToHead, isHighQuality, selectedState, selectedDistrict]);

  const getUniqueStates = () => {
    if (!pollData) return [];
    const states = pollData
      .map((poll) => poll.state)
      .filter((state) => state)
      .sort();
    return Array.from(new Set(states));
  };

  const getUniqueDistricts = (state) => {
    if (!pollData) return [];
    const districts = pollData
      .filter((poll) => poll.state === state)
      .map((poll) => poll.seat_number)
      .filter((seat_number) => seat_number)
      .sort();
    return Array.from(new Set(districts));
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDistrict("");
    const districts = getUniqueDistricts(state);
    setAvailableDistricts(districts);
  };

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div className="error-gen">Error: {error}</div>;
  }

  return (
    <div>
      <Map stateColors={districtColors} stateAverages={districtAverage} />
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
      
      {/* State Dropdown */}
      <select
        value={selectedState}
        onChange={(e) => handleStateChange(e.target.value)}
      >
        <option value="">Select a state</option>
        {getUniqueStates().map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {/* District Dropdown (only show if a state is selected) */}
      {selectedState && (
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">Select a district</option>
          {availableDistricts.map((district) => (
            <option key={district} value={district}>
              District {district}
            </option>
          ))}
        </select>
      )}

      {/* Poll Table */}
      {filteredPolls && filteredPolls.length > 0 ? (
        <PollTable data={filteredPolls} />
      ) : (
        <div>No polls available for the 2024 cycle.</div>
      )}
    </div>
  );
};
