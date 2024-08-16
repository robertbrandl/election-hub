import "./President.css";
import axios from "axios";
import { useState, useEffect} from "react";
import Map from "../../components/Map/Map";
import PollTable from "../../components/PollTable/PollTable";
export const President = () => {
    const mergePolls = (polls) => {
        const mergedPolls = [];
      
        polls.forEach((poll) => {
          // Check if there's already a poll object with the same poll_id and question_id in the mergedPolls array
          const existingPoll = mergedPolls.find(
            (merged) => merged.poll_id === poll.poll_id && merged.question_id === poll.question_id
          );
      
          if (existingPoll) {
            // If found, add the candidate and their percentage to the existing object
            existingPoll.candidates.push({
              name: poll.candidate_name || 'N/A',
              pct: poll.pct !== undefined ? poll.pct : 'N/A',
              party: poll.party || 'N/A',
            });
          } else {
            // If not found, create a new entry in the mergedPolls array
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
              candidates: [
                {
                  name: poll.candidate_name || 'N/A',
                  pct: poll.pct !== undefined ? poll.pct : 'N/A',
                  party: poll.party || 'N/A',
                }
              ]
            });
          }
        });
      
        return mergedPolls;
      };
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('national');
    const [selectedState, setSelectedState] = useState('');
    const [stateColors, setStateColors] = useState({
        'California': '#FF6347', // Example state color
        'Texas': '#4682B4',
        'Florida': '#32CD32',
        // Add more states and colors here
      });
    useEffect(() => {
        setError("");
        async function fetchPolls() {
          setLoading(true);
          try {
            let response = null;
            response = await axios.get(
                'http://localhost:3000/president/polls',
                {
                  params: {
                    cycleYear: 2024, 
                  }
                }
              );
            console.log(response.data.polls);
            console.log(mergePolls(response.data.polls));
            setPollData(mergePolls(response.data.polls));
          } catch (e) {
            console.log(e)
            setError(e.response || e.message);
          }
          setLoading(false);
        }
        fetchPolls();
      }, []);
    if (loading) {
        return <div>Loading...</div>;
    } else if (error) {
        return <div className="error-gen">Error: {error}</div>;
    } 

    const getFilteredPolls = () => {
        if (!pollData) return [];
    
        if (activeTab === 'national') {
          return pollData.filter(poll => poll.state === null).slice(0, 10);
        } else if (activeTab === 'state') {
          if (selectedState) {
            return pollData.filter(poll => poll.state === selectedState).slice(0, 10);
          }
        }
        return [];
      };
    const getUniqueStates = () => {
        if (!pollData) return [];
        const states = pollData.map(poll => poll.state).filter(state => state).sort();
        return Array.from(new Set(states)); // Remove duplicates
    };
      

  return (
    <div>
      <Map stateColors={stateColors} />
      <div className="tab-bar">
        <button onClick={() => setActiveTab('national')} className={activeTab === 'national' ? 'active' : ''}>
          National Polls
        </button>
        <button onClick={() => setActiveTab('state')} className={activeTab === 'state' ? 'active' : ''}>
          State Polls
        </button>
      </div>
      {pollData && pollData.length > 0 ? (
        <><>{activeTab === 'national' && <PollTable data={getFilteredPolls()} />}</>
        <>{activeTab === 'state' && (
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select a state</option>
                {getUniqueStates().map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {selectedState && <PollTable data={getFilteredPolls()} />}
            </div>
          )}</></>
      ) : (
        <div>No polls available for the 2024 cycle.</div>
      )}
    </div>
  );
}