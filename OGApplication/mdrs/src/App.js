import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

// Page Imports
import Home from './pages/Home';
import Loco from './pages/Loco';
import Harvester from './pages/Harvester';
import Siding from './pages/Siding';
import BinAllocation from './pages/BinAllocation';
import TransactionLog from './pages/TransactionLog';

// Component Imports
import Header from './components/Header';
import { LoginForm } from './components/Login';

// Login Functionality
import useToken from './useToken';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}


export default function App() {
  const { token, setToken } = useToken();

  //check for token to see if logged in
  if (!token) {
    return (
      <div className="App">
        <LoginForm setToken={setToken} />
      </div>
    )
  }

  const handleLogout = () => {
    sessionStorage.clear();
  }

  return (
    <Router>
      <div className="App">
        <Header onLogout={handleLogout} />
        {/*content */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/loco' element={<Loco />} />
          <Route path='/harvester' element={<Harvester />} />
          <Route path='/siding' element={<Siding />} />
          <Route path='/bins' element={<BinAllocation />} />
          <Route path='/log' element={<TransactionLog />} />
        </Routes>
      </div>
    </Router>
  );
}