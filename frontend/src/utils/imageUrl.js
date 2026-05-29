/**
 * Resolve product image URLs for local dev and production.
 * Supports absolute URLs, /uploads paths, and legacy blob URLs (shows placeholder).
 */
const PLACEHOLDER =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';

export const resolveImageUrl = (url) => {
  if (!url) return PLACEHOLDER;
  if (url.startsWith('blob:')) return PLACEHOLDER;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/')) {
    const origin = (import.meta.env.VITE_API_ORIGIN || '').replace(/\/$/, '');
    return origin ? `${origin}${url}` : url;
  }
  return url;
};
