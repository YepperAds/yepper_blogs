// Homepage.js - Enhanced with better image handling
import React, { useState, useEffect } from 'react';
import ImageComponent from './ImageComponent';

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'General', 'Electronics', 'Clothing', 'Home', 'Books'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="homepage">
      <header className="hero">
        <h1>Welcome to Our Shop</h1>
        <p>Discover amazing products and services</p>
      </header>
      
      {/* Category filter */}
      <div className="category-filter">
        <h3>Filter by Category:</h3>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="posts-grid">
        {filteredPosts.length === 0 ? (
          <p className="no-posts">
            {selectedCategory === 'All' 
              ? 'No products available yet.' 
              : `No products in ${selectedCategory} category.`}
          </p>
        ) : (
          filteredPosts.map(post => (
            <div key={post._id} className="post-card">
              <ImageComponent 
                src={post.image} 
                alt={post.title}
                className="post-image-container"
              />
              
              <div className="post-content">
                <h3>{post.title}</h3>
                <p className="post-description">{post.description}</p>
                <div className="post-details">
                  <span className="price">${post.price}</span>
                  <span className="category">{post.category}</span>
                </div>
                <div className="contact-info">
                  Contact: {post.contact}
                </div>
                <div className="post-date">
                  Posted: {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Homepage;