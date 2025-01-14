import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditPostProfile() {
    const { id } = useParams(); 
    const [text, setText] = useState(''); 
    const [image, setImage] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = sessionStorage.getItem('username');
        if (!loggedUser) {
            navigate('/login'); // Redirect ke halaman login jika belum login
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/post/${id}`);
                if (response.data) {
                    setText(response.data.text || '');
                    setImage(response.data.image || '');
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };
        fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('text', text);
        if (image instanceof File) {
            formData.append('image', image); 
        }

        try {
            await axios.put(`http://localhost:3001/post/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Post updated successfully');
            navigate(`/profile/${sessionStorage.getItem('username')}`); // Redirect ke profil user biasa
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        }
    };

    return (
        <div className="edit-post-container">
            <h2 className="edit-post-title">Edit Post Profile</h2>
            <textarea
                className="edit-post-textarea"
                placeholder="Edit your post"
                value={text} 
                onChange={(e) => setText(e.target.value)}
            />
            <input
                className="edit-post-file-input"
                type="file"
                onChange={(e) => setImage(e.target.files[0])} 
            />
            {image && typeof image === 'string' && (
                <div className="edit-post-current-image">
                    <p>Current Image:</p>
                    <img src={`http://localhost:3001/uploads/${image}`} alt="Post image" />
                </div>
            )}
            <button className="edit-post-button" onClick={handleUpdate}>Update</button>
        </div>
    );
}

export default EditPostProfile;
