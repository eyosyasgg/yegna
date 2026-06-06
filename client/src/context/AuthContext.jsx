import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('yegna_dark') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('yegna_dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const savedToken = localStorage.getItem('yegna_token');
    const savedUser = localStorage.getItem('yegna_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${savedToken}` } })
        .then(r => {
          if (!r.ok) throw new Error('Invalid token');
          return r.json();
        })
        .then(json => {
          if (json.success) {
            setUser(json.data);
            localStorage.setItem('yegna_user', JSON.stringify(json.data));
          }
        })
        .catch(() => {
          localStorage.removeItem('yegna_token');
          localStorage.removeItem('yegna_user');
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('yegna_token', newToken);
    localStorage.setItem('yegna_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('yegna_token');
    localStorage.removeItem('yegna_user');
    setToken(null);
    setUser(null);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token && !!user, loading, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
}
