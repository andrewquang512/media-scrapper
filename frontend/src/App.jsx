// src/App.jsx
import 'bootswatch/dist/journal/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './components/AuthContext';
import axios from 'axios';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
