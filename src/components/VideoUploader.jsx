import React, { useState, useRef } from 'react';
import { Video, Loader2, Upload, Check } from 'lucide-react';
import { uploadImage as uploadFile } from '../firebase.js'; // reusing the same upload function

// Helper to extract a frame from video as a Blob
const generateVideoThumbnail = (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    
    video.autoplay = true;
    video.muted = true;
    video.src = objectUrl;
    
    // Safety timeout for error cases
    const timeout = setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Video loading timed out"));
    }, 5000);

    video.onloadeddata = () => {
      // Seek to 0.1 seconds (instead of 1.0s for short videos)
      video.currentTime = Math.min(video.duration, 0.1); 
    };

    video.onseeked = () => {
      clearTimeout(timeout);
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl);
          resolve(blob);
        }, "image/jpeg", 0.8);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = (e) => {
      clearTimeout(timeout);
      URL.revokeObjectURL(objectUrl);
      reject(e);
    };
  });
};

export default function VideoUploader({ onUpload, label = "Upload Video", folder = "videos" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      try {
        setUploading(true);
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        // 1. Upload Video
        const videoUrl = await uploadFile(file, folder);
        
        // 2. Generate and Upload Thumbnail
        let posterUrl = "";
        try {
          const posterBlob = await generateVideoThumbnail(file);
          const posterFile = new File([posterBlob], file.name.replace(/\.[^/.]+$/, "") + "-thumb.jpg", { type: "image/jpeg" });
          posterUrl = await uploadFile(posterFile, folder);
        } catch (thumbErr) {
          console.error("Failed to generate thumbnail automatically", thumbErr);
        }
        
        // 3. Prepare filename for "mock AI" generation
        const filename = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ').toUpperCase();

        onUpload({ videoUrl, posterUrl, filename });
      } catch (err) {
        console.error("VideoUploader Error:", err);
        alert("Gagal: " + (err.message || err.toString()));
        setPreview("");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">{label}</label>
      
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className="relative aspect-video bg-neutral-100 border-2 border-dashed border-neutral-300 hover:border-black transition-colors cursor-pointer group flex flex-col items-center justify-center overflow-hidden"
      >
        {preview ? (
          <>
            <video 
              src={preview} 
              className="w-full h-full object-cover" 
              muted 
              loop 
              autoPlay 
              playsInline 
              crossOrigin="anonymous"
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10 text-white">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs font-mono uppercase">Uploading...</span>
              </div>
            )}
            {!uploading && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <Check className="w-3 h-3" />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400 group-hover:text-black p-4 text-center">
            <Video className="w-8 h-8" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Select Video File<br/>(MP4, WebM)</span>
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="video/mp4,video/webm,video/ogg" 
        onChange={handleFileChange} 
      />
    </div>
  );
}
