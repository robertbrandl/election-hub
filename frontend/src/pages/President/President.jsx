import "./President.css";
import axios from "axios";
import { useState, useEffect} from "react";
import Map from "../../components/Map/Map";
export const President = () => {
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
            setPollData(response.data.polls.slice(0,20));
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
    const renderField = (field) => field ? field : 'N/A'; // Helper function to handle empty fields

  return (
    <div>
      <Map stateColors={stateColors} />
      {pollData && pollData.length > 0 ? (
        <table className="poll-table">
          <thead>
            <tr>
              <th>Pollster</th>
              <th>Candidate</th>
              <th>Party</th>
              <th>Date</th>
              <th>Poll Result (%)</th>
              <th>Population</th>
              <th>Methodology</th>
              <th>Sample Size</th>
              <th>URL</th>
              <th>Sponsors</th>
              <th>Sponsor Party</th>
            </tr>
          </thead>
          <tbody>
            {pollData.map((poll, index) => (
              <tr key={index}>
                <td>{renderField(poll.pollster)}</td>
                <td>{renderField(poll.candidate_name)}</td>
                <td>{renderField(poll.party)}</td>
                <td>{renderField(poll.start_date)} - {renderField(poll.end_date)}</td>
                <td>{renderField(poll.pct)}</td>
                <td>{renderField(poll.population)}</td>
                <td>{renderField(poll.methodology)}</td>
                <td>{renderField(poll.sample_size)}</td>
                <td>
                  {poll.url ? <a href={poll.url} target="_blank" rel="noopener noreferrer">View Poll</a> : 'N/A'}
                </td>
                <td>{renderField(poll.sponsors ? poll.sponsors.join(', ') : 'N/A')}</td>
                <td>{renderField(poll.sponsor_candidate_party)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No polls available for the 2024 cycle.</div>
      )}
    </div>
  );
}