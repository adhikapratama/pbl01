import React, { useState, useEffect } from 'react'; // Impor useEffect di sini
import { useNavigate } from 'react-router-dom'; // Impor useNavigate untuk navigasi
import axios from 'axios';

const RegisterAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // Gunakan useNavigate untuk navigasi

    useEffect(() => {
        const role = sessionStorage.getItem('role');
        if (!role || role !== 'admin') {
            alert('Access denied! Only admins can register another admin.');
            navigate('/login'); // Arahkan ke login jika bukan admin
        }
    }, [navigate]); // Tambahkan navigate sebagai dependency useEffect

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:3001/register', {
                username,
                password,
                email,
                role: 'admin' // Peran admin disetel secara otomatis
            });
            alert(response.data.message);
        } catch (error) {
            alert('Error registering admin');
        }
    };

    return (
        <div>
            <h2>Register Admin</h2>
            <input 
                type="text" 
                placeholder="Username" 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default RegisterAdmin;
