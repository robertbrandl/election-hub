import axios from 'axios';
const getUpcomingElections = async () => {
    let ret = await axios.get("https://www.googleapis.com/civicinfo/v2/elections?key=");
    console.log(ret.data.elections);
    return ret.data.elections
}
export default {
    getUpcomingElections
};
