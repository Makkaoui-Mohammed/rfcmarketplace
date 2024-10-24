import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; 
import apiRequest from './api'; 

function MyAdsPage() {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
       
        const response = await apiRequest('http://127.0.0.1:8000/api/users/my-ads/', 'GET');
        if (response) {
          setAds(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de vos annonces:', error);
        alert('Erreur lors de la récupération de vos annonces');
      }
    };

    fetchMyAds();
  }, []);

  const handleDelete = async (adId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette annonce ?')) {
      try {
       
        const response = await apiRequest(`http://127.0.0.1:8000/api/users/ads/${adId}/delete/`, 'DELETE');
        if (response && response.status === 204) {
          alert('Annonce supprimée avec succès !');
          setAds(ads.filter((ad) => ad.id !== adId));  
        } else {
          alert("Erreur lors de la suppression de l'annonce");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression de l'annonce:", error);
        alert("Erreur lors de la suppression de l'annonce");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <NavBar /> 
      <h2 style={{ textAlign: 'left', marginLeft: '20px', marginTop: '20px' }}>Mes annonces</h2>


      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: '20px' 
      }}>
  
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px', 
        }}>
          {ads.length > 0 ? (
            ads.map((ad) => (
              <div
                key={ad.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
   
                {ad.image ? (
                  <img
                    src={ad.image}
                    alt={ad.titre}
                    style={{ 
                      width: '400px', 
                      height: '400px', 
                      objectFit: 'cover', 
                      marginBottom: '10px' 
                    }}
                    onClick={() => navigate(`/ads/${ad.id}`)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400?text=Image+indisponible';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '400px',
                      height: '400px',
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <p>Aucune image disponible</p>
                  </div>
                )}

        
                <div onClick={() => navigate(`/ads/${ad.id}`)} style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    margin: '0', 
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    color: '#4a90e2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {ad.titre}
                  </h3>
                  <p style={{ 
                    margin: '5px 0 0', 
                    color: '#25c63f', 
                    fontWeight: 'bold', 
                    fontSize: '18px',
                  }}>
                    {ad.prix} MAD
                  </p>
                </div>

            
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => navigate(`/ads/${ad.id}/edit`)}
                    style={{
                      marginRight: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(ad.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#d9534f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune annonce trouvée.</p>
          )}
        </div>
      </div>


      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#d9534f',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}

export default MyAdsPage;
