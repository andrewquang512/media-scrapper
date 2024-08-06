import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState(null); // State for handling error messages
  const { setToken } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('AccessToken');
    if (storedAccessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`
      navigate('/dashboard');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const { access, refresh } = response.data.tokens;

      setToken(access.token);
      localStorage.setItem('AccessToken', access.token);
      localStorage.setItem('RefreshToken', refresh.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access.token}`
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
      setToken(null);
      localStorage.removeItem('AccessToken');
      localStorage.removeItem('RefreshToken');

      if (error.response && error.response.data) {
        // Assume the error message is under `error.response.data.message`
        setErrorMessage(error.response.data.message || 'Authentication failed. Please check your credentials and try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-lg-12">
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4 text-center">Login</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="d-flex justify-content-center m-2">
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;