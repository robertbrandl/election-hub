import axios from 'axios';
import Papa from 'papaparse';
const getPollingData = async () => {
    // Fetch the CSV data
    fetch('https://projects.fivethirtyeight.com/polls-page/president_polls.csv')
    .then(response => response.text())
    .then(csvData => {
    // Parse the CSV data
    Papa.parse(csvData, {
        header: true, // Treat the first row as headers
        dynamicTyping: true, // Automatically converts numeric values
        complete: function(results) {
        console.log(results.data); // The parsed data
        // Example: Filtering polls for a specific candidate
        //const bidenPolls = results.data.filter(poll => poll.candidate_name === 'Joseph R. Biden Jr.');
        //console.log('Biden Polls:', bidenPolls);
        },
        error: function(error) {
        console.error('Parsing Error:', error);
        }
    });
    })
    .catch(error => console.error('Fetch Error:', error));
}
export default {
    getPollingData
};