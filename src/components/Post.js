import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Post() {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = sessionStorage.getItem('username');
    if (loggedUser) {
      setUsername(loggedUser);
    } else {
      navigate('/login'); // Redirect ke login jika belum login
    }
  }, [navigate]);

  const handlePost = () => {
    if (!text && !image) {
      alert('Please enter text or upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    formData.append('image', image);
    formData.append('username', username); // Kirim username yang login

    axios.post('http://localhost:3001/post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        alert(response.data.message);
        navigate(`/profile/${username}`); // Redirect ke halaman profil setelah berhasil posting
      })
      .catch(error => alert('Error posting text and image'));
  };

  const handleLogout = () => {
    sessionStorage.clear(); // Menghapus data dari sessionStorage
    navigate('/'); // Redirect ke halaman landing
  };

  return (
    <div className="post">
      <h2>Post Text and Image</h2>
      {username ? (
        <>
          <p>Hello, <strong>{username}</strong></p>
          <input
            type="text"
            placeholder="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button onClick={handlePost} className="btn">Post</button>

          {/* Tombol untuk menuju halaman profil */}
          <button 
            onClick={() => navigate(`/profile/${username}`)} 
            className="btn">
            Go to Profile
          </button>

          {/* Tombol logout */}
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
}

export default Post;
