import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  

function LoginPage({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
        email,
        password,
      });

      if (response.status === 200) {
      
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('userId', response.data.user_id); 
        localStorage.setItem('username', response.data.username);

        
        alert('Connexion réussie !');
        setLoggedIn(true); 
        navigate('/'); 
      } else {
        alert('Identifiants incorrects');
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      alert("Erreur lors de la connexion");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>
          Connexion <span role="img" aria-label="key" style={emojiStyle}>🔑</span>
        </h2>
        <form onSubmit={handleLogin} style={formStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" style={buttonStyle}>Se connecter</button>
        </form>

        <p style={registerTextStyle}>
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" style={linkStyle}>
            Créez un compte ici
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
  background: 'linear-gradient(135deg, #48c6ef , #d6a16f)',
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

export default LoginPage;