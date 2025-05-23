// Homepage.js
import React, { useState, useEffect } from 'react';
import ImageComponent from './ImageComponent';

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: '✨', gradient: 'from-pink-400 to-purple-500' },
    { name: 'Skincare', icon: '💧', gradient: 'from-blue-400 to-cyan-500' },
    { name: 'Makeup', icon: '💄', gradient: 'from-pink-500 to-red-500' },
    { name: 'Fragrance', icon: '🌸', gradient: 'from-purple-400 to-pink-500' },
    { name: 'Hair Care', icon: '💇‍♀️', gradient: 'from-amber-400 to-orange-500' },
    { name: 'Tools & Accessories', icon: '🔧', gradient: 'from-gray-400 to-gray-600' },
    { name: 'Sets & Bundles', icon: '🎁', gradient: 'from-green-400 to-emerald-500' }
  ];

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">✨</div>
          <p className="text-2xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Loading beauty products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              CN Cosmetics Shop
            </h1>
            <p className="text-xl md:text-2xl text-pink-100 max-w-3xl mx-auto leading-relaxed">
              Discover your inner glow with our premium collection of beauty essentials. 
              From skincare to makeup, we've got everything to make you shine! 💫
            </p>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 animate-bounce delay-100">
            <div className="text-4xl">💄</div>
          </div>
          <div className="absolute bottom-10 right-10 animate-bounce delay-700">
            <div className="text-4xl">💎</div>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-pink-50">
            <path d="M0,0V120L1200,0Z"></path>
          </svg>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Shop by Category 💅
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.name}
                className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg scale-105`
                    : 'bg-white text-gray-700 shadow-md hover:shadow-lg border-2 border-pink-200'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </span>
                {selectedCategory !== category.name && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="space-y-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🛍️</div>
              <h3 className="text-3xl font-bold text-gray-600 mb-4">
                {selectedCategory === 'All' 
                  ? 'No products available yet' 
                  : `No products in ${selectedCategory} category`}
              </h3>
              <p className="text-gray-500 text-lg">
                Check back soon for amazing beauty products! ✨
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-700">
                  {selectedCategory === 'All' 
                    ? `All Products (${filteredPosts.length})` 
                    : `${selectedCategory} (${filteredPosts.length})`}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPosts.map(post => (
                  <div 
                    key={post._id} 
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden border-2 border-pink-100 hover:border-pink-300"
                  >
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden">
                      <ImageComponent 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          {categories.find(cat => cat.name === post.category)?.icon} {post.category}
                        </span>
                      </div>
                      
                      {/* Price badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                          ${post.price}
                        </span>
                      </div>
                    </div>
                    
                    {/* Product Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                      
                      {/* Contact Info */}
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-200">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-pink-500 font-semibold">📞 Contact:</span>
                          <span className="text-gray-700 font-medium">{post.contact}</span>
                        </div>
                      </div>
                      
                      {/* Post Date */}
                      <div className="text-xs text-gray-500 text-center pt-2 border-t border-pink-100">
                        ✨ Added: {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      
                      {/* Call to Action */}
                      <div className="pt-4">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                          💌 Get in Touch
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Footer CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-3xl p-12 text-white shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Glow?
            </h2>
            <p className="text-xl mb-8 text-pink-100">
              Join thousands of beauty enthusiasts who trust CN Cosmetics for their daily glow-up routine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;