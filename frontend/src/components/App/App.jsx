import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "../Navbar/Navbar";
import { UpcomingElections } from '../../pages/UpcomingElections/UpcomingElections';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
      <Route exact path="/upcomingelections" element={<UpcomingElections />} />

      </Routes>
    </>
  )
}

export default App;
