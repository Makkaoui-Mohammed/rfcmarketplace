import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiRequest from './api';

function ReservationPage() {
  const { id } = useParams(); 
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); 

    
    if (!/^\d{10,15}$/.test(phoneNumber)) {
      alert("Le numéro de téléphone doit contenir entre 10 et 15 chiffres.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await apiRequest(
        `http://127.0.0.1:8000/api/users/ads/${id}/reservation/`,
        'POST',
        {
          ad: id,  
          user: userId,  
          phone_number: phoneNumber,
          reservation_date: reservationDate,
          reservation_time: reservationTime,
        },
        false,
        token
      );

      if (response.status === 201) {
        alert('Réservation envoyée avec succès!');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      
  
      if (error.response && error.response.data) {
        console.log('Détails de l\'erreur:', error.response.data);
        alert(`Erreur: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("Erreur lors de la réservation");
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Réserver l'annonce</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Numéro de téléphone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="date"
          placeholder="Date de réservation"
          value={reservationDate}
          onChange={(e) => setReservationDate(e.target.value)}
          required
          style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="time"
          placeholder="Heure de réservation"
          value={reservationTime}
          onChange={(e) => setReservationTime(e.target.value)}
          required
          style={{ padding: '10px', marginBottom: '10px', width: '100%' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4a90e2', color: '#fff' }}>
          Envoyer la réservation
        </button>
      </form>
    </div>
  );
}

export default ReservationPage;
