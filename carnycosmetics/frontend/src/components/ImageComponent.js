// ImageComponent.js
import React, { useState } from 'react';

const ImageComponent = ({ src, alt, className, fallbackSrc = null }) => {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    currentSrc: src
  });

  const handleImageLoad = () => {
    setImageState(prev => ({ ...prev, loading: false, error: false }));
  };

  const handleImageError = () => {
    if (fallbackSrc && imageState.currentSrc !== fallbackSrc) {
      setImageState(prev => ({ 
        ...prev, 
        currentSrc: fallbackSrc,
        loading: true,
        error: false 
      }));
    } else {
      setImageState(prev => ({ ...prev, loading: false, error: true }));
    }
  };

  if (!src && !fallbackSrc) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 ${className || ''}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">💄</div>
          <span className="text-pink-500 font-semibold text-sm">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      {imageState.loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 z-10">
          <div className="text-center">
            <div className="animate-spin text-3xl mb-2">✨</div>
            <span className="text-pink-500 font-semibold text-sm">Loading...</span>
          </div>
        </div>
      )}
      
      {imageState.error ? (
        <div className="flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 h-full">
          <div className="text-center">
            <div className="text-4xl mb-2">🚫</div>
            <span className="text-pink-500 font-semibold text-sm">Image not found</span>
          </div>
        </div>
      ) : (
        <img
          src={imageState.currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageState.loading ? 'none' : 'block' }}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default ImageComponent;