import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Periksa pengguna yang sedang login
        const loggedUser = sessionStorage.getItem('username');
        setLoggedInUser(loggedUser);

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/posts/${username}`);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [username]);

    const closeModal = () => {
        setSelectedImage(null);
    };

    const goBack = () => {
        navigate('/post');
    };

    const handleEdit = (postId) => {
        navigate(`/editpost/${postId}`); // Arahkan ke halaman edit post
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:3001/post/${postId}`);
                setPosts(posts.filter(post => post.id !== postId)); // Perbarui state setelah penghapusan
                alert('Post deleted successfully');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post');
            }
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Profile of {username}</h1>
            <button onClick={goBack} style={{ marginBottom: '30px', padding: '10px 20px', fontSize: '16px', borderRadius: '8px' }}>Back</button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', justifyContent: 'center', padding: '20px' }}>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ padding: '15px', fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #ddd' }}>{post.text}</div>
                        {post.image && (
                            <img
                                src={`http://localhost:3001/uploads/${post.image}`}
                                alt="Post"
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                onClick={() => setSelectedImage(post.image)}
                            />
                        )}
                        <div style={{ padding: '15px', fontSize: '14px', color: '#777' }}>{new Date(post.date).toLocaleString()}</div>

                        {loggedInUser === username && (
                            <div style={{ padding: '15px', borderTop: '1px solid #ddd', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleEdit(post.id)}
                                    style={{ marginRight: '10px', padding: '8px 15px', fontSize: '14px', borderRadius: '5px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '5px', backgroundColor: '#dc3545', color: '#fff', border: 'none' }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onClick={closeModal}
                >
                    <img
                        src={`http://localhost:3001/uploads/${selectedImage}`}
                        alt="Modal Content"
                        style={{ maxWidth: '90%', maxHeight: '90%' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Profile;
