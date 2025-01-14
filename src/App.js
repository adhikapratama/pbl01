import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Register from './components/Register';
import Login from './components/Login';
import Post from './components/Post';
import Profile from './components/Profile';
import EditUser from './components/EditUser';
import EditPost from './components/EditPost';
import EditPostProfile from './components/EditPostProfile'; // Import EditPostProfile
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import RegisterAdmin from './components/RegisterAdmin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/edituser/:id" element={<EditUser />} />
          <Route path="/editpost/:id" element={<EditPost />} />
          <Route path="/editpostprofile/:id" element={<EditPostProfile />} /> {/* Rute untuk EditPostProfile */}
          <Route path="/post" element={<Post />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
