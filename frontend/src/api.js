import axios from 'axios';

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('token', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    return null;
  }
};


const apiRequest = async (url, method = 'GET', data = null, isFormData = false) => {
  let token = localStorage.getItem('token');

  try {
    const headers = {
      'Authorization': `Bearer ${token}`,
    };

    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }


    const response = await axios({
      url,
      method,
      data,
      headers,
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {

      token = await refreshAccessToken();
      if (token) {

        try {
          const headers = {
            'Authorization': `Bearer ${token}`,
          };

          if (!isFormData) {
            headers['Content-Type'] = 'application/json';
          }

          const response = await axios({
            url,
            method,
            data,
            headers,
          });
          return response;
        } catch (err) {
          console.error('Erreur lors de la requête après rafraîchissement:', err);
        }
      } else {
        alert('Session expirée, veuillez vous reconnecter.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';  
      }
    } else {
      throw error;  
    }
  }
};

export default apiRequest;
