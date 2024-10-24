import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import apiRequest from './api';

function AddAdPage() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [image, setImage] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('location', location);
    formData.append('area', area);
    if (image) {
      formData.append('image', image); 
    }

    try {
      
      const response = await apiRequest('http://127.0.0.1:8000/api/users/ads/', 'POST', formData, true);

      if (response && response.status === 201) {
        alert('Annonce créée avec succès !');
        navigate('/');
      } else {
        alert("Erreur lors de la création de l'annonce");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error);
      if (error.response && error.response.data) {
        alert(`Erreur: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Erreur de connexion au serveur');
      }
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };
  return (
    <div>
      <NavBar />
      <h2 style={{ textAlign: 'left', marginLeft: '20px', marginTop: '20px' }}>Ajouter une annonce</h2>
      <form 
        onSubmit={handleSubmit} 
        encType="multipart/form-data" 
        style={formStyle}
      >
        <input
          type="text"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={textareaStyle}
        />
        <input
          type="number"
          placeholder="Prix"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Localisation"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Surface (m²)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={fileInputStyle}
        />
        <button type="submit" style={buttonStyle}>Créer</button>
      </form>
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

const formStyle = {
  margin: '20px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  maxWidth: '600px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  outline: 'none',
  fontSize: '16px',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '100px',
};

const fileInputStyle = {
  padding: '10px 0',
};

const buttonStyle = {
  padding: '12px 20px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#4a90e2',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default AddAdPage;
