// Dashboard.js
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
    category: 'Skincare'
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

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
        alert(editingPost ? 'Product updated!' : 'Product created!');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving product');
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
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchPosts();
        alert('Product deleted!');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting product');
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
      category: 'Skincare'
    });
    setImagePreview('');
    setEditingPost(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-pink-400 to-purple-500">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
                ✨ Welcome, {admin?.username}! ✨
              </h1>
              <p className="text-gray-600 text-lg">Manage your CN Cosmetics collection</p>
            </div>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
            >
              <span className="relative flex items-center gap-2">
                {showForm ? '✕ Cancel' : '+ Add New Product'}
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Product Form */}
        {showForm && (
          <div className="mb-12 bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 px-8 py-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                {editingPost ? '✏️ Edit Product' : '🌸 Add New Product'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Rose Gold Highlighter"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Describe your beautiful product..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all duration-200 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                    <input
                      type="text"
                      placeholder="$29.99"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Info</label>
                    <input
                      type="text"
                      placeholder="WhatsApp, Email, etc."
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      required
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all duration-200"
                    >
                      <option value="Skincare">💧 Skincare</option>
                      <option value="Makeup">💄 Makeup</option>
                      <option value="Fragrance">🌸 Fragrance</option>
                      <option value="Hair Care">💇‍♀️ Hair Care</option>
                      <option value="Tools & Accessories">🔧 Tools & Accessories</option>
                      <option value="Sets & Bundles">🎁 Sets & Bundles</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:ring focus:ring-purple-200 transition-all duration-200"
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">✨ Image Preview</label>
                      <div className="relative overflow-hidden rounded-xl shadow-lg">
                        <ImageComponent 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-pink-100">
                <button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {editingPost ? '✏️ Update Product' : '🌸 Create Product'}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 px-8 py-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              💄 Your Products ({posts.length})
            </h2>
          </div>
          
          <div className="p-8">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-4">🌸</div>
                <p className="text-2xl text-gray-500 mb-2">No products yet!</p>
                <p className="text-gray-400">Create your first cosmetic masterpiece!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                  <div key={post._id} className={`group relative bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 ${!post.isActive ? 'border-gray-200 opacity-75' : 'border-pink-200'} overflow-hidden`}>
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${post.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                      {post.isActive ? '✅ Active' : '💤 Inactive'}
                    </div>
                    
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      {post.image ? (
                        <ImageComponent 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                          <span className="text-6xl">💄</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    
                    {/* Product Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 line-clamp-3">{post.description.substring(0, 100)}...</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          ${post.price}
                        </span>
                        <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {post.category}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-pink-100">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(post._id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                        >
                          🗑️ Delete
                        </button>
                        <button 
                          onClick={() => toggleStatus(post._id)}
                          className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm ${
                            post.isActive 
                              ? 'bg-orange-100 hover:bg-orange-200 text-orange-700' 
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                        >
                          {post.isActive ? '💤 Hide' : '✅ Show'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;