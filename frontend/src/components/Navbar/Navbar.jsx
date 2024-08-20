import React, { useContext } from "react";
import "./Navbar.css";
import { Link, useNavigate} from "react-router-dom";
export const Navbar = () => {
  return <div>{<Navigation />}</div>;
};
const Navigation = () => {
  const navigate = useNavigate();
  const signout = () =>{
    navigate("/")
  }
  return (
    <>
    <nav className="title">
    <ul>
      <li>
        <Link to="/" className="playlist-hub">Election Hub</Link>
      </li>
    </ul></nav>
    <nav className="mainbar">
    <ul>
      <li>
        <Link to="/upcomingelections">Upcoming Elections</Link>
      </li>
      <li>
        <Link to="/president">State of the Presidential Race</Link>
      </li>
      <li>
        <Link to="/senate">Senate Battleground</Link>
      </li>
      <li>
        <Link to="/house">
          Contest for the House
        </Link>
      </li>
    </ul>
    </nav>
    </>
  );
};