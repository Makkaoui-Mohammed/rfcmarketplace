import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/users/register/',
        { email, username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.message) {
        alert('Inscription réussie !');
        navigate('/login'); 
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      if (error.response && error.response.data) {
        console.log('Détails de l\'erreur:', error.response.data);
        alert(`Erreur d'inscription: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Erreur de connexion au serveur');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>
          Inscription <span role="img" aria-label="pencil" style={emojiStyle}>✍️</span>
        </h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <label style={labelStyle}>Nom d'utilisateur</label>
          <input
            type="text"
            placeholder="Entrez votre nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <label style={labelStyle}>Mot de passe</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>S'inscrire</button>
        </form>

        <p style={registerTextStyle}>
          Déjà un compte ?{' '}
          <Link to="/login" style={linkStyle}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}


const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #d6a16f, #48c6ef)',
};

const formContainerStyle = {
  width: '400px',
  padding: '30px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const emojiStyle = {
  marginLeft: '10px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const labelStyle = {
  textAlign: 'left',
  fontWeight: 'bold',
  marginBottom: '5px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '12px 0',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const registerTextStyle = {
  marginTop: '20px',
};

const linkStyle = {
  color: '#007bff',
  fontWeight: 'bold',
  textDecoration: 'none',
};

export default RegisterPage;
