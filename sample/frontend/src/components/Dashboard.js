// Dashboard.js - Enhanced with better image handling
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ImageComponent from './ImageComponent';

const Dashboard = () => {
  const { admin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
    contact: '',
    category: 'General'
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  // Validate and preview image URL
  const handleImageUrlChange = (url) => {
    setFormData({...formData, image: url});
    setImagePreview(url);
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/posts/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const url = editingPost ? `http://localhost:5000/api/posts/${editingPost._id}` : 'http://localhost:5000/api/posts';
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPosts();
        resetForm();
        alert(editingPost ? 'Post updated!' : 'Post created!');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description,
      price: post.price,
      image: post.image,
      contact: post.contact,
      category: post.category
    });
    setImagePreview(post.image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchPosts();
        alert('Post deleted!');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const toggleStatus = async (id) => {
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error toggling post status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      image: '',
      contact: '',
      category: 'General'
    });
    setImagePreview('');
    setEditingPost(null);
    setShowForm(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {admin?.username}!</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="add-post-btn"
        >
          {showForm ? 'Cancel' : 'Add New Post'}
        </button>
      </div>

      {showForm && (
        <div className="post-form">
          <h2>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={formData.image}
              onChange={(e) => handleImageUrlChange(e.target.value)}
            />
            
            {/* Image preview */}
            {imagePreview && (
              <div className="image-preview">
                <label>Image Preview:</label>
                <ImageComponent 
                  src={imagePreview} 
                  alt="Preview" 
                  className="preview-image"
                />
              </div>
            )}
            
            <input
              type="text"
              placeholder="Contact Info"
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              required
            />
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="General">General</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Books">Books</option>
            </select>
            
            <div className="form-buttons">
              <button type="submit">
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="posts-list">
        <h2>Your Posts ({posts.length})</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Create your first post!</p>
        ) : (
          <div className="admin-posts-grid">
            {posts.map(post => (
              <div key={post._id} className={`admin-post-card ${!post.isActive ? 'inactive' : ''}`}>
                {post.image && (
                  <ImageComponent 
                    src={post.image} 
                    alt={post.title}
                    className="admin-post-image"
                  />
                )}
                
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.description.substring(0, 100)}...</p>
                  <div className="post-meta">
                    <span>Price: ${post.price}</span>
                    <span>Category: {post.category}</span>
                    <span className={`status ${post.isActive ? 'active' : 'inactive'}`}>
                      {post.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="post-actions">
                    <button onClick={() => handleEdit(post)}>Edit</button>
                    <button onClick={() => handleDelete(post._id)}>Delete</button>
                    <button onClick={() => toggleStatus(post._id)}>
                      {post.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;