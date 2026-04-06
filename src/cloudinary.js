// Cloudinary Upload Utility for Evocative Space
// This seamlessly replaces Firebase Storage uploads with Cloudinary free tier

const CLOUD_NAME = "f20jbter"; // Fallback to f20jbter if needed, but using UUID
const UPLOAD_PRESET = "f20jbter"; 

// The user provided two things: f20jbter and b87bc810-500e-477d-abd5-1afa13436b2c
// Usually Cloud Names are short like f20jbter. We'll use the UUID as Cloud Name, and f20jbter as preset,
// but we'll allow easy switching if we guessed wrong.

export const uploadToCloudinary = async (file, cloudName = "dmi66s3us", uploadPreset = "ml_default") => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  
  try {
    const response = await fetch(url, { method: "POST", body: formData });
    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      const errMsg = data.error?.message || "Upload to Cloudinary failed";
      console.error("Cloudinary Error Detail:", data);
      throw new Error(errMsg);
    }
  } catch (error) {
    console.error("Cloudinary Network Error:", error);
    throw error;
  }
};
// GLOBAL OPTIMIZER: Ensures every Cloudinary asset is compressed and formatted for max performance.
// Specifically targets "f_auto" (WebP/AVIF) and "q_auto" (Smart Compression).
export const optimizeCloudinaryUrl = (url, options = "") => {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  
  // Example: upload/v12345/image.jpg -> upload/f_auto,q_auto,options/v12345/image.jpg
  const parts = url.split("/upload/");
  if (parts.length === 2) {
    const transformation = options ? `f_auto,q_auto,${options}` : "f_auto,q_auto";
    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
  }
  return url;
};
