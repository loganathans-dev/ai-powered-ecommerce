import React, { useState } from 'react';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop';

/**
 * Renders product images from Atlas (data URLs, https) with fallback for broken/blob URLs.
 */
export default function ProductImage({ src, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false);
  const invalid = !src || src.startsWith('blob:') || failed;
  const displaySrc = invalid ? PLACEHOLDER : src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
