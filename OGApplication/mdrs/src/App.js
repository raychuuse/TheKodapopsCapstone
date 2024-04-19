import './App.css';

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import AuthProvider from "./AuthProvider";

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
import AlertPopup from './utiljs/AlertPopup';
import AuthRoute from "./pages/AuthRoute";
import UserList from "./pages/User";
import UserPage from "./pages/User";
import UserView from "./pages/UserView";


function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken?.token
}


export default function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
            <Header />
            {/*content */}
            <AlertPopup/>
            <Routes>
              <Route path='/login' element={<LoginForm />} />
              <Route element={<AuthRoute />}>
                <Route path='/' element={<Home />} />
                <Route path='/loco' element={<Loco />} />
                <Route path='/harvester' element={<Harvester />} />
                <Route path='/siding' element={<Siding />} />
                <Route path='/bins' element={<BinAllocation />} />
                <Route path='/log' element={<TransactionLog />} />
                <Route path='/users' element={<UserPage />} />
                <Route path='/users/:id' element={<UserView />} />
                <Route path='/users/create' element={<UserView />} />
              </Route>
            </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}