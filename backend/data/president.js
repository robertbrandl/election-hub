import axios from 'axios';
const getData = async () => {
    let ret = await axios.get("https://www.googleapis.com/civicinfo/v2/divisions?key=AIzaSyB_hmbBzUABhHbtIfVxzzxTtDpP3TG1-rw");
    console.log(ret.data);
}
export default {
    getData
};