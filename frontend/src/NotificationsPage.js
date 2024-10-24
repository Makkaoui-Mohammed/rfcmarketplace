import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from './api';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

 
  const fetchNotifications = async () => {
    try {
      const response = await apiRequest('http://127.0.0.1:8000/api/users/notifications/', 'GET');
      if (response && response.data) {
        setNotifications(response.data);
      } else {
        alert('Erreur lors de la récupération des notifications');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      alert('Erreur lors de la récupération des notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  const handleConfirm = async (reservationId) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/api/users/reservations/${reservationId}/confirm/`,
        'POST'
      );
      if (response && response.data) {
        alert('Réservation confirmée !');
        fetchNotifications(); 
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation de la réservation:', error);
      alert('Erreur lors de la confirmation de la réservation');
    }
  };

 
  const handleRefuse = async (reservationId) => {
    try {
      const response = await apiRequest(
        `http://127.0.0.1:8000/api/users/reservations/${reservationId}/refuse/`,
        'POST'
      );
      if (response && response.data) {
        alert('Réservation refusée !');
        fetchNotifications(); 
      }
    } catch (error) {
      console.error('Erreur lors du refus de la réservation:', error);
      alert('Erreur lors du refus de la réservation');
    }
  };

  const handleBackToAds = () => {
    navigate('/');
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Mes Notifications</h2>
      <div style={notificationsContainer}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} style={notificationCard}>
              <p style={notificationTitle}>
                {notification.message.includes('Votre réservation pour') ? (
                  <span>
                    {notification.message} 
                  </span>
                ) : (
                  <span>
                    Nouvelle réservation pour <strong>{notification.ad_title || 'Titre non disponible'}</strong>
                  </span>
                )}
              </p>
              <p style={notificationText}>
                <strong>Date de réservation :</strong> {notification.reservation_date || 'Non disponible'}
              </p>
              <p style={notificationText}>
                <strong>Heure de réservation :</strong> {notification.reservation_time || 'Non disponible'}
              </p>
              <p style={notificationText}>
                <strong>Date de création :</strong>{' '}
                {notification.created_at ? new Date(notification.created_at).toLocaleString() : 'Non disponible'}
              </p>

             
              {notification.message.includes('confirmée') ? (
                <p style={confirmMessageStyle}>Votre réservation est confirmée.</p>
              ) : notification.message.includes('refusée') ? (
                <p style={refuseMessageStyle}>Votre réservation a été refusée.</p>
              ) : notification.reservation_id ? (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleConfirm(notification.reservation_id)}
                    style={confirmButtonStyle}
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => handleRefuse(notification.reservation_id)}
                    style={refuseButtonStyle}
                  >
                    Refuser
                  </button>
                </div>
              ) : (
                <p style={{ color: 'red' }}>Détails de la réservation indisponibles</p>
              )}
            </div>
          ))
        ) : (
          <p>Aucune notification trouvée.</p>
        )}
      </div>

      <button onClick={handleBackToAds} style={backButtonStyle}>
        Retour à la liste des annonces
      </button>
    </div>
  );
}

// Styles CSS pour les messages de confirmation et de refus
const confirmMessageStyle = {
  color: 'green',
  fontWeight: 'bold',
  marginTop: '10px',
};

const refuseMessageStyle = {
  color: 'red',
  fontWeight: 'bold',
  marginTop: '10px',
};

// Autres styles CSS
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#f4f4f4',
  minHeight: '100vh',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const notificationsContainer = {
  width: '80%',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const notificationCard = {
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  border: '1px solid #ccc',
  marginBottom: '10px',
};

const notificationTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const notificationText = {
  fontSize: '16px',
  margin: '5px 0',
};

const confirmButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const refuseButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#f44336',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const backButtonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#4a90e2',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default NotificationsPage;
