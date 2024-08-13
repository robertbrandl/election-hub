import React from 'react';
import './Home.css';
export const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to PlaylistHub!</h1>
      <p>
        Discover, create, and share music playlists with friends. Whether
        you're searching for curated playlists or eager to share your latest
        compilation, PlaylistHub has got you covered.
      </p>
      <h2>Project Description</h2>
      <p>
        Finding and sharing music playlists can be cumbersome with the myriad
        of streaming platforms available. PlaylistHub simplifies this process
        by providing a central hub where users can create, share, and explore
        playlists effortlessly.
      </p>
      <h3>Features</h3>
      <ul>
        <li>Song Search</li>
        <li>Individual Song Page</li>
        <li>Sharing Playlist</li>
        <li>Followed User Playlists</li>
        <li>Individual Playlist Page</li>
        <li>User's Statistics Page</li>
        <li>User Account Management</li>
      </ul>
      <h2>Get Started</h2>
      <p>
        Ready to dive in? Start exploring PlaylistHub by navigating through our
        various pages using the navigation bar. Sign up to unlock additional 
        features such as saving playlists and accessing personalized statistics.
      </p>
    </div>
  );
};

