import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar'; 
import apiRequest from './api'; 

function HomePage() {
  const [ads, setAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState(''); 
  const [filteredAds, setFilteredAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

 
  const fetchAds = async () => {
    try {
      const response = await apiRequest('http://127.0.0.1:8000/api/users/ads/list/', 'GET');
      if (response && response.data) {
        setAds(response.data);
        setFilteredAds(response.data);
      } else {
        alert('Erreur lors de la récupération des annonces');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      alert('Erreur lors de la récupération des annonces');
    }
  };


  const handleSearch = () => {
    if (searchType === '') {
      alert('Veuillez sélectionner un type de recherche.');
      return;
    }

    const filtered = ads.filter((ad) => {
      if (searchType === 'titre') {
        return ad.titre.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === 'prix') {
        return ad.prix.toString().includes(searchTerm);
      } else if (searchType === 'location') {
        return ad.location.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
    setFilteredAds(filtered);
  };

 
  const handleRefresh = () => {
    setSearchTerm('');
    setSearchType('');
    fetchAds(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <NavBar />


      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: '20px',
        padding: '0 20px',
      }}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={selectStyle}
        >
          <option value="" disabled>Choisir le type de recherche</option>
          <option value="titre">Titre</option>
          <option value="prix">Prix</option>
          <option value="location">Localisation</option>
        </select>
        <input
          type="text"
          placeholder={`Rechercher par ${searchType || '...'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle}
          disabled={searchType === ''}
        />
        <button onClick={handleSearch} style={buttonStyle}>Rechercher</button>
        <button onClick={handleRefresh} style={refreshButtonStyle}>Rafraîchir</button>
      </div>

      <h2 style={{ textAlign: 'left', marginLeft: '20px', marginTop: '20px' }}>Liste des annonces</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginTop: '20px',
        padding: '0 20px',
      }}>
        {filteredAds.length > 0 ? (
          filteredAds.map((ad) => (
            <div
              key={ad.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '5px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => navigate(`/ads/${ad.id}`)}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {ad.image ? (
                <img
                  src={ad.image}
                  alt={ad.titre}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover' 
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400?text=Image+indisponible';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <p>Aucune image disponible</p>
                </div>
              )}
              <div style={{ padding: '10px', textAlign: 'left' }}>
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
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>Aucune annonce trouvée.</p>
        )}
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


const inputStyle = {
  padding: '10px',
  marginRight: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  outline: 'none',
  fontSize: '16px',
  width: '200px',
};

const selectStyle = {
  padding: '10px',
  marginRight: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  outline: 'none',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4a90e2',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const refreshButtonStyle = {
  padding: '10px 20px',
  marginLeft: '10px',
  backgroundColor: '#f0ad4e',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default HomePage;
