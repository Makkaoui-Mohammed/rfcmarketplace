import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiRequest from './api';  

function EditAdPage() {
  const { id } = useParams();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [image, setImage] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await apiRequest(`http://127.0.0.1:8000/api/users/ads/${id}/`, 'GET');
        if (response) {
          const ad = response.data;
          setTitre(ad.titre);
          setDescription(ad.description);
          setPrix(ad.prix);
          setLocation(ad.location);
          setArea(ad.area);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce:", error);
        alert("Erreur lors de la récupération de l'annonce");
      }
    };

    fetchAdDetails();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('titre', titre);
      formData.append('description', description);
      formData.append('prix', prix);
      formData.append('location', location);
      formData.append('area', area);
      if (image) {
        formData.append('image', image); 
      }

      const response = await apiRequest(
        `http://127.0.0.1:8000/api/users/ads/${id}/update/`,
        'PATCH',
        formData,
        true 
      );

      if (response && response.status === 200) {
        alert('Annonce mise à jour avec succès !');
        navigate('/my-ads');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'annonce:", error);
      alert("Erreur lors de la mise à jour de l'annonce");
    }
  };

  const handleReturn = () => {
    navigate('/my-ads');
  };

  return (
    <div>
      <h2 style={{ textAlign: 'left', marginLeft: '20px', marginTop: '20px' }}>Modifier l'annonce</h2>
      <form onSubmit={handleUpdate} encType="multipart/form-data" style={formStyle}>
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
        <button type="submit" style={buttonStyle}>Mettre à jour</button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <button
          type="button"
          onClick={handleReturn}
          style={{
            textAlign: 'left',
            marginLeft: '20px',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3d5b87',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Retour à Mes annonces
        </button>
      </div>
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

export default EditAdPage;
