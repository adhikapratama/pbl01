import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const [posts, setPosts] = useState([]);
  const [searchPost, setSearchPost] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/admin");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        alert("Failed to fetch posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.text.toLowerCase().includes(searchPost.toLowerCase()) ||
      post.username.toLowerCase().includes(searchPost.toLowerCase())
  );

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handlePostClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>Hello Worlds</h1>
      <p style={{ fontSize: "20px", marginBottom: "20px" }}>Anggota tim:</p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <p
        style={{ fontSize: "18px", fontStyle: "italic", marginBottom: "30px" }}
      >
        Niko Dwi Novana
      </p>
      <div style={{ marginBottom: "50px" }}>
        <Link to="/register">
          <button
            style={{
              marginRight: "15px",
              padding: "12px 25px",
              fontSize: "18px",
              borderRadius: "8px",
            }}
          >
            Register
          </button>
        </Link>
        <Link to="/login">
          <button
            style={{
              padding: "12px 25px",
              fontSize: "18px",
              borderRadius: "8px",
            }}
          >
            Login
          </button>
        </Link>
      </div>

      <div className="section" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h3 style={{ fontSize: "32px", marginBottom: "30px" }}>Posts</h3>
        <div className="search-wrapper" style={{ marginBottom: "40px" }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchPost}
            onChange={(e) => setSearchPost(e.target.value)}
            className="search-input"
            style={{
              padding: "15px",
              width: "80%",
              maxWidth: "700px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "18px",
            }}
          />
        </div>
        <div
          className="posts-wrapper"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "40px",
            justifyContent: "center",
          }}
        >
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="post-card"
              style={{
                border: "1px solid #ddd",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#fff",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              onClick={() => handlePostClick(post.username)}
            >
              <div
                className="post-header"
                style={{
                  padding: "20px",
                  fontWeight: "bold",
                  fontSize: "20px",
                  borderBottom: "1px solid #ddd",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {post.username}
              </div>
              <div className="post-image">
                {post.image ? (
                  <img
                    src={`http://localhost:3001/uploads/${post.image}`}
                    alt="Post"
                    style={{
                      width: "100%",
                      display: "block",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      color: "#aaa",
                      fontStyle: "italic",
                      padding: "50px",
                      textAlign: "center",
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>
              <div
                className="post-text"
                style={{
                  padding: "20px",
                  color: "#333",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                {post.text}
              </div>
              <div
                className="post-date"
                style={{
                  padding: "15px",
                  fontSize: "16px",
                  color: "#777",
                  borderTop: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                {new Date(post.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
