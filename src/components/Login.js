import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });

      console.log('Response data:', response.data);

      // Perbaikan: tidak ada properti 'success', maka cek langsung apakah role ada
      if (response.data.username && response.data.role) {
        const { username, role } = response.data;

        console.log('Username:', username);
        console.log('Role:', role);

        // Simpan username dan role di sessionStorage
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('role', role);

        // Periksa role untuk navigasi
        if (role === 'admin') {
          console.log('Navigating to Admin Dashboard...');
          navigate('/admin');
        } else {
          console.log('Navigating to Post Page...');
          navigate('/post');
        }
        
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
