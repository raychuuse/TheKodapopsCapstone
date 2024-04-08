import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import {useAuth} from "../AuthProvider";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = useAuth();

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  if (auth.token == null)
    return;

  const userId = 1;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className='container-fluid'>
        <a className="navbar-brand" href="/">
          MDRS
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/loco">
                Loco
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/harvester">
                Harvester
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/siding">
                Siding
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/bins">
                Bin Allocation
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/log">
                Transaction Log
              </a>
            </li>
          </ul>
        </div>


        <ul className="navbar-nav mr-auto pe-5">
          <li className="nav-item dropdown ps-5">
            <button
              className="nav-link dropdown-toggle btn btn-link ms-4 ps-5 "
              type="button"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
            >
              User: {auth.user.firstName}
            </button>
            <ul className={`dropdown-menu  ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
              <li>
                <a className="dropdown-item" href="/" role="button" onClick={auth.logOut}>
                  Log Out
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;