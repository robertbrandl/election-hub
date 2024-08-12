import "./UpcomingElections.css";
import axios from "axios";
import { useState, useEffect} from "react";
export const UpcomingElections = () => {
    const [electionData, setElectionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        setError("");
        async function fetchData() {
          setLoading(true);
          try {
            let response = null;
            response = await axios.get(
              `http://localhost:3000/upcomingelections`,
              {}
            );
            console.log(response)
            console.log(response.data.elections);
            const sortedElections = response.data.elections.sort((a, b) => {
                const dateA = new Date(a.electionDay);
                const dateB = new Date(b.electionDay);
                return dateA - dateB;
            });
            setElectionData(sortedElections);
          } catch (e) {
            console.log(e)
            setError(e.response || e.message);
          }
          setLoading(false);
        }
        fetchData();
      }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const correctedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return correctedDate.toLocaleDateString(undefined, options);
    };
    
    if (loading) {
        return <div>Loading...</div>;
    } else if (error) {
        return <div className="error-gen">Error: {error}</div>;
    }
    return (
        <div className="election-grid">
            {electionData && 
            electionData.map((election) => (
                <div key={election.id} className="election-card">
                    <h2 className="election-name">{election.name}</h2>
                    <br / >
                    <p className="election-id">ID: {election.id}</p>
                    <br / >
                    <p className="election-day">Election Day: {formatDate(election.electionDay)}</p>
                    <br / >
                </div>
            ))}
        </div>
    );
}