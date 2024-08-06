import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(null);
    axios.defaults.headers.common['Authorization'] = ``;
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    navigate('/login');
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      Logging out...
    </div>
  );
};

export default Logout;
