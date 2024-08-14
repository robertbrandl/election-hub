import "./President.css";
import axios from "axios";
import { useState, useEffect} from "react";
export const President = () => {
    const [pollData, setPollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        setError("");
        async function fetchPolls() {
          setLoading(true);
          try {
            let response = null;
            response = await axios.get(
              `http://localhost:3000/president/polls`,
              {}
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
    return (
        <div>
        </div>
    );
}