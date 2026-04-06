/**
 * Appends Cloudinary optimization parameters (q_auto, f_auto) to images.
 */
export const optimizeImage = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // If already has transformations, skip or append
  if (url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/q_auto:good,f_auto/');
  }
  
  return url;
};
