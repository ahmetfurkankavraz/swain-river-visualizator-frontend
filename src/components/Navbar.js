import React from 'react';
import { Link } from 'react-router-dom';

function Navbar(){
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
              <Link to="/list-measurements">List Measurements</Link>
            </li>
            <li>
              <Link to="/save-measurement">Save Measurement</Link>
            </li>
          </ul>
        </nav>
      );
}

export default Navbar;