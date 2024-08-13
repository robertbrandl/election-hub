import axios from 'axios';
const getUpcomingElections = async () => {
    const apiKey = process.env.API_KEY;
    let ret = await axios.get(`https://www.googleapis.com/civicinfo/v2/elections?key=${apiKey}`);
    console.log(ret.data.elections);
    return ret.data.elections
}
export default {
    getUpcomingElections
};