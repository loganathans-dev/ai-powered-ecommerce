/**
 * Compress a local image and return a data URL suitable for storing in MongoDB Atlas.
 * Works in any browser after deploy (unlike blob: URLs).
 */
export const fileToStoredImageDataUrl = (
  file,
  { maxWidth = 1200, quality = 0.82 } = {}
) =>
  new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('Please choose a valid image file (JPEG, PNG, WebP).'));
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      reject(new Error('Image file is too large. Please use a file under 8 MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const usePng = file.type === 'image/png';
        const mime = usePng ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, usePng ? undefined : quality));
      };
      img.onerror = () => reject(new Error('Could not process image'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Could not read image file'));
    reader.readAsDataURL(file);
  });

/** True if URL is safe to persist (not a temporary blob link). */
export const isPersistableImageUrl = (url) =>
  typeof url === 'string' &&
  url.length > 0 &&
  !url.startsWith('blob:') &&
  (url.startsWith('data:image/') ||
    url.startsWith('https://') ||
    url.startsWith('http://') ||
    url.startsWith('/'));
