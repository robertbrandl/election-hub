import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "../Navbar/Navbar";
import { UpcomingElections } from '../../pages/UpcomingElections/UpcomingElections';
import { President } from '../../pages/President/President';
import { NotFound } from '../../pages/NotFound/NotFound';
import { Home } from '../../pages/Home/Home';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/upcomingelections" element={<UpcomingElections />} />
        <Route exact path="/president" element={<President />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  )
}

export default App;
