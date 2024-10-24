import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiRequest from './api'; 

function AdDetailsPage() {
  const { id } = useParams(); 
  const [ad, setAd] = useState(null); 
  const navigate = useNavigate();
  const [username, setUsername] = useState(null); 

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    console.log("Username from storage:", storedUsername);

    const fetchAdDetails = async () => {
      try {
        const response = await apiRequest(`http://127.0.0.1:8000/api/users/ads/${id}/`);
        setAd(response.data);
        console.log("Ad details fetched:", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'annonce:", error);
      }
    };

    fetchAdDetails();
  }, [id]);

  if (!ad) {
    return <p>Chargement...</p>;
  }

  const handleReturnToList = () => {
    navigate('/');
  };

  const handleReservationClick = () => {
    navigate(`/ads/${id}/reservation`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '20px' }}>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        {ad.image ? (
          <img
            src={ad.image}
            alt={ad.titre}
            style={{ width: '400px', height: '400px', objectFit: 'cover', marginBottom: '10px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400?text=Image+indisponible';
            }}
          />
        ) : (
          <p>Aucune image disponible</p>
        )}
      </div>

      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <h2 style={{ margin: '0', fontSize: '24px' }}>{ad.titre}</h2>
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <p><strong>Description:</strong> {ad.description}</p>
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <p><strong>Prix:</strong> {ad.prix} MAD</p>
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <p><strong>Localisation:</strong> {ad.location}</p>
      </div>
      <div style={{ marginBottom: '10px', textAlign: 'left' }}>
        <p><strong>Surface:</strong> {ad.area} m²</p>
      </div>
      <div style={{ textAlign: 'left' }}>
        <p><strong>Propriétaire:</strong> {ad.owner}</p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'left', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={handleReturnToList}
          style={{
            marginLeft: '0',
            padding: '10px 20px',
            backgroundColor: '#3d5b87',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Retour à Liste des annonces
        </button>

        {username && ad.owner && username !== ad.owner && (
          <button
            type="button"
            onClick={handleReservationClick}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4a90e2',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Réserver
          </button>
        )}
      </div>
    </div>
  );
}

export default AdDetailsPage;
