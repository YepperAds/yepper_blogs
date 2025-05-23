// ImageComponent.js - New reusable image component
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
      <div className={`image-placeholder ${className || ''}`}>
        <span>No Image</span>
      </div>
    );
  }

  return (
    <div className={`image-container ${className || ''}`}>
      {imageState.loading && (
        <div className="image-loading">
          <span>Loading...</span>
        </div>
      )}
      
      {imageState.error ? (
        <div className="image-error">
          <span>Failed to load image</span>
        </div>
      ) : (
        <img
          src={imageState.currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageState.loading ? 'none' : 'block' }}
          className="post-image"
        />
      )}
    </div>
  );
};

export default ImageComponent;
