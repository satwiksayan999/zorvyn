import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

function normalizeUser(userData) {
  if (!userData) return null;
  const id = userData._id || userData.id;
  return { ...userData, id, _id: id };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zorvyn_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get('/users/me')
      .then((response) => setUser(normalizeUser(response.data)))
      .catch(() => localStorage.removeItem('zorvyn_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('zorvyn_token', token);
    setUser(normalizeUser(userData));
  };

  const logout = () => {
    localStorage.removeItem('zorvyn_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
