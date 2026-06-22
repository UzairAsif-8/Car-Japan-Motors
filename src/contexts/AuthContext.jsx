import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, logout as logoutApi, getStoredToken } from '../services/authService';
import { getProfile } from '../services/accountService';
import { tokenStore } from '../services/api';
import { userFromToken } from '../lib/jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(Boolean(getStoredToken()));

  const updateSession = useCallback(({ token: nextToken, user: nextUser }) => {
    if (nextToken) {
      tokenStore.set(nextToken);
      setToken(nextToken);
    }
    if (nextUser) {
      setUser({ name: 'Car Japan Admin', ...nextUser });
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setBootstrapping(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const profile = await getProfile();
        if (!cancelled) {
          setUser({ id: profile.id, email: profile.email, name: 'Car Japan Admin' });
        }
      } catch (err) {
        if (cancelled) return;

        // Only clear the session when the token is actually invalid.
        if (err.status === 401) {
          logoutApi();
          setToken(null);
          setUser(null);
          return;
        }

        // Backend may not have /me deployed yet — keep the session and fall back
        // to identity embedded in the JWT from login.
        setUser((prev) => prev || userFromToken(token));
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginApi(credentials);
      setToken(data.token);
      setUser({ name: 'Car Japan Admin', ...data.user });
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
    () => ({
      token,
      user,
      loading,
      bootstrapping,
      isAuthenticated: Boolean(token),
      login,
      logout,
      updateSession,
    }),
    [token, user, loading, bootstrapping, updateSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
