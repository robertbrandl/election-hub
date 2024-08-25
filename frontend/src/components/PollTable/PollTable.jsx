import React from 'react';
import "./PollTable.css";

const PollTable = ({ data}) => {
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
            <th>Sponsor Candidate</th>
            <th>Sponsor Candidate Party</th>
            <th>Pollster Rating (Out of 3)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((poll, index) => {
            const candidates = poll.candidates || [{ candidate_name: poll.candidate_name, party: poll.party, pct: poll.pct }];
            
            return candidates.map((candidate, candidateIndex) => (
              <tr key={`${poll.poll_id}-${candidateIndex}`}>
                {candidateIndex === 0 ? (
                  <>
                    <td>{renderField(poll.pollster)}</td>
                    <td>{renderField(candidate.name)}</td>
                    <td>{renderField(candidate.party)}</td>
                    <td>{renderField(poll.start_date)} - {renderField(poll.end_date)}</td>
                    <td>{renderField(candidate.pct)}</td>
                    <td>{renderField(poll.population)}</td>
                    <td>{renderField(poll.methodology)}</td>
                    <td>{renderField(poll.sample_size)}</td>
                    <td>
                      {poll.url ? <a href={poll.url} target="_blank" rel="noopener noreferrer">View Poll</a> : 'N/A'}
                    </td>
                    <td>{renderField(poll.sponsors ? poll.sponsors : 'N/A')}</td>
                    <td>{renderField(poll.sponsor_candidate)}</td>
                    <td>{renderField(poll.sponsor_candidate_party)}</td>
                    <td>{renderField(poll.numeric_grade)}</td>
                  </>
                ) : (
                  <>
                    <td></td>
                    <td>{renderField(candidate.name)}</td>
                    <td>{renderField(candidate.party)}</td>
                    <td></td>
                    <td>{renderField(candidate.pct)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </>
                )}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PollTable;
