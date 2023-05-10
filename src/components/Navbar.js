import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({logOut}){
    return (
        <nav className='navbar'>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/interpolate">Interpolate</Link>
            </li>
            <li>
              <Link to="/compare">Compare</Link>
            </li>
            <li>
              <Link to="/list-measurements">List Measurements</Link>
            </li>
            <li>
              <Link to="/save-measurement">Save Measurement</Link>
            </li>
            <li>
              <Link to="/crossing-points-observer">CrossingPointsObserver</Link>
            </li>
          </ul>
          <button className='logout' onClick={logOut}>Log Out</button>
        </nav>
      );
}

export default Navbar;