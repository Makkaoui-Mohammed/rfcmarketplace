import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './assets/logo.png'; 

function NavBar() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/users/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <nav style={navStyle}>
      <div style={titleContainerStyle}>
        <img src={logo} alt="Logo" style={logoStyle} />
        <h1 style={titleStyle}>RFC Immobilier</h1>
      </div>
      <div style={linksStyle}>
        <Link to="/" style={buttonStyle}>Liste des annonces</Link>
        <Link to="/add-ad" style={buttonStyle}>Ajouter une annonce</Link>
        <Link to="/my-ads" style={buttonStyle}>Mes annonces</Link>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={handleNotificationClick} style={buttonStyle}>
            Notifications ({notifications.length})
          </button>
          {notifications.length > 0 && (
            <div style={badgeStyle}>
              {notifications.length}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 30px',
  backgroundColor: '#4a90e2',
  borderBottom: '2px solid #3a78c3',
};

const titleContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const logoStyle = {
  width: '120px',
  height: '60px',
  marginRight: '10px',
};

const titleStyle = {
  fontFamily: '"Lucida Console", Courier, monospace',
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#fff',
  margin: 0,
};

const linksStyle = {
  display: 'flex',
  gap: '20px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#fff',
  color: '#4a90e2',
  border: '2px solid #4a90e2',
  borderRadius: '5px',
  textDecoration: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  position: 'relative',
};

const badgeStyle = {
  position: 'absolute',
  top: '-10px',
  right: '-10px',
  backgroundColor: '#d9534f',
  color: '#fff',
  borderRadius: '50%',
  padding: '5px 10px',
  fontSize: '12px',
  fontWeight: 'bold',
};

export default NavBar;
