import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "../Navbar/Navbar";
import { UpcomingElections } from '../../pages/UpcomingElections/UpcomingElections';
import { President } from '../../pages/President/President';
import { NotFound } from '../../pages/NotFound/NotFound';
import { Home } from '../../pages/Home/Home';
import {Senate} from "../../pages/Senate/Senate";
import {House} from "../../pages/House/House";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/upcomingelections" element={<UpcomingElections />} />
        <Route exact path="/president" element={<President />} />
        <Route exact path="/senate" element={<Senate />} />
        <Route exact path="/house" element={<House />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  )
}

export default App;
