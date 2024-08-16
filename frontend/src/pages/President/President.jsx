import "./President.css";
import axios from "axios";
import { useState, useEffect} from "react";
import Map from "../../components/Map/Map";
import PollTable from "../../components/PollTable/PollTable";
export const President = () => {
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
            console.log(response)
            console.log(response.data.polls);
            setPollData(response.data.polls);
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
              <PollTable data={getFilteredPolls()} />
            </div>
          )}</></>
      ) : (
        <div>No polls available for the 2024 cycle.</div>
      )}
    </div>
  );
}