import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import HomePage from './HomePage';
import MyAdsPage from './MyAdsPage';
import AddAdPage from './AddAdPage';
import AdDetailsPage from './AdDetailsPage'; 
import EditAdPage from './EditAdPage';
import ReservationPage from './ReservationPage';
import NotificationsPage from './NotificationsPage';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={loggedIn ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-ads" element={loggedIn ? <MyAdsPage /> : <Navigate to="/login" />} />
        <Route path="/add-ad" element={loggedIn ? <AddAdPage /> : <Navigate to="/login" />} />
        <Route path="/ads/:id" element={<AdDetailsPage />} />  
        <Route path="/ads/:id/edit" element={loggedIn ? <EditAdPage /> : <Navigate to="/login" />} />  
        <Route path="/ads/:id/reservation" element={loggedIn ? <ReservationPage /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={loggedIn ? <NotificationsPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
