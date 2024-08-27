import React from 'react';
import './Home.css';

export const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to ElectionHub!</h1>
        <p>Your one-stop platform for the latest polling data, election insights, and more.</p>
      </header>
      
      <div className="home-content">
        <div className="card-section">
          <div className="info-card">
            <h2>2024 Presidential Election</h2>
            <p>Stay updated with the latest polls, news, and trends.</p>
            <button>View Presidential Polls</button>
          </div>
          <div className="info-card">
            <h2>Senate Races</h2>
            <p>Get insights into key Senate races across the country.</p>
            <button>View Senate Polls</button>
          </div>
          <div className="info-card">
            <h2>House of Representatives</h2>
            <p>Explore detailed polling data for House races by district.</p>
            <button>View House Polls</button>
          </div>
        </div>

        <div className="call-to-action">
          <h2>Make Your Voice Heard</h2>
          <p>Register to vote and ensure your participation in the upcoming elections.</p>
          <a href="https://vote.gov/" target="_blank" rel="noopener noreferrer">
            <button className="cta-button">Register to Vote</button>
          </a>
        </div>
      </div>
    </div>
  );
};
