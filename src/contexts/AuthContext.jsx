import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, logout as logoutApi, getStoredToken } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Rehydrate a lightweight user identity from a stored token.
    if (token && !user) {
      setUser({ name: 'Car Japan Admin', email: 'admin@carjapan.pk' });
    }
  }, [token, user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginApi(credentials);
      setToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, isAuthenticated: Boolean(token), login, logout }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
