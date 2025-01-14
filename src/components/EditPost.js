import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


function EditPost() {
    const { id } = useParams(); // Mendapatkan ID dari URL
    const [text, setText] = useState(''); // State untuk teks postingan
    const [image, setImage] = useState(''); // State untuk gambar postingan, default string kosong
    const navigate = useNavigate();

    useEffect(() => {
        const loggedUser = sessionStorage.getItem('username');
        if (!loggedUser) {
            navigate('/login'); // Redirect ke halaman login jika belum login
        }
    }, [navigate]);
    

    // Ambil data post berdasarkan ID saat halaman dimuat
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

    // Fungsi untuk mengirim data yang telah diperbarui
    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('text', text);
        if (image instanceof File) {
            formData.append('image', image); // Tambahkan gambar baru jika diubah
        }

        try {
            await axios.put(`http://localhost:3001/post/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Post updated successfully');
            navigate('/admin'); // Redirect ke halaman admin setelah update
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        }
    };

    return (
        <div className="edit-post-container">
            <h2 className="edit-post-title">Edit Post</h2>
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

export default EditPost;
