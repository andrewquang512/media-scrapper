import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { setToken } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', {
        email,
        name: username,
        password,
      });

      const { access, refresh } = response.data.tokens;

      setToken(access.token);
      localStorage.setItem('AccessToken', access.token);
      localStorage.setItem('RefreshToken', refresh.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access.token}`;
      navigate('/dashboard');
    } catch (error) {
      console.error('Register failed:', error);
      if (error.response && error.response.data) {
        // Assume the error message is under `error.response.data.message`
        setMessage(
          error.response.data.message ||
            'Authentication failed. Please check your credentials and try again.',
        );
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-lg-12">
          <h2 className="text-center mb-4">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                placeholder="Username"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
          {message && <p className="mt-3 text-danger text-center">{message}</p>}
          <div className="mt-4 text-center">
            <Link to="/login" className="btn btn-info">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
