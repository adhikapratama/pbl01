import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  
  useEffect(() => {
    // Ambil data login dari localStorage saat halaman dimuat
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    
    if (storedUsername && storedRole) {
      setIsAuthenticated(true); // Set isAuthenticated jadi true jika ada data di localStorage
      setUser({ username: storedUsername, role: storedRole });
    }
  }, []);

  const login = (username, role) => {
    setIsAuthenticated(true);
    setUser({ username, role });
    // Simpan data login ke localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Hapus data dari localStorage saat logout
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
