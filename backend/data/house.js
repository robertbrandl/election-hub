import axios from 'axios';
import Papa from 'papaparse';

const getPollingData = async (cycleYear) => {
  try {
    // Fetch the CSV data
    const response = await fetch('https://projects.fivethirtyeight.com/polls-page/data/house_polls.csv');
    const csvData = await response.text();

    // Parse the CSV data
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true, // Treat the first row as headers
        dynamicTyping: true, // Automatically converts numeric values
        complete: function (results) {
            console.log(results.data)
            const filteredData = results.data.filter(poll => poll.cycle === cycleYear);
            resolve(filteredData); // Return the filtered data
        },
        error: function (error) {
          reject(error); // Handle parsing error
        }
      });
    });
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error; // Re-throw the error for higher-level handling
  }
};

export default {
  getPollingData
};
