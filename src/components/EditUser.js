import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
    const { id } = useParams(); 
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [role, setRole] = useState('user'); 
    const navigate = useNavigate();

    // Pengecekan autentikasi
    useEffect(() => {
        const loggedUser = sessionStorage.getItem('username');
        if (!loggedUser) {
            navigate('/login'); // Redirect ke halaman login jika belum login
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user/${id}`);
                setUsername(response.data.username);
                setEmail(response.data.email);
                setRole(response.data.role);
                setPassword(response.data.password);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3001/user/${id}`, {
                username,
                email,
                password,
                role
            });
            alert('User updated successfully');
            navigate('/admin'); 
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        }
    };

    return (
        <div>
            <h2>Edit User</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
}

export default EditUser;
