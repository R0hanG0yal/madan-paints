import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if user is authenticated via httpOnly cookie
  // The cookie is sent automatically by the browser with credentials
  useEffect(() => {
    API.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    // Server sets httpOnly cookie — nothing to store in JS
    setUser(res.data.user);
    return res.data;
  }, []);

  const signup = useCallback(async (name, email, password, phone) => {
    const res = await API.post('/auth/signup', { name, email, password, phone });
    // Server sets httpOnly cookie — nothing to store in JS
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // Server clears the cookie even if the request fails
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
