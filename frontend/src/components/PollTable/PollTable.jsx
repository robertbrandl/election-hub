import React from 'react';
import "./PollTable.css"

const PollTable = ({ data }) => {
  const renderField = (field) => field ? field : 'N/A'; // Helper function to handle empty fields
  return (
    <div className="poll-table">
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
            {data.map((poll, index) => (
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
                <td>{renderField(poll.sponsors ? poll.sponsors: 'N/A')}</td>
                <td>{renderField(poll.sponsor_candidate_party)}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default PollTable;