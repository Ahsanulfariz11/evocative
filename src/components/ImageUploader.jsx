import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, X, Check, Loader2, Upload } from 'lucide-react';
import { uploadImage } from '../firebase';
import { getCroppedImgBlob } from '../utils/cropImage';

/**
 * ImageUploader Component
 * Handles local file selection, cropping, and Firebase Storage upload.
 */
export default function ImageUploader({ 
  onUpload, 
  aspect = 4 / 3, 
  label = "Upload Image", 
  folder = "uploads",
  circular = false,
  previewUrl = ""
}) {
  const [image, setImage] = useState(null); // original image URL
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const fileInputRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImage(reader.result);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      setUploading(true);
      const blob = await getCroppedImgBlob(image, croppedAreaPixels);
      const url = await uploadImage(blob, folder);
      
      setPreview(url);
      onUpload(url);
      setIsCropping(false);
      setImage(null);
    } catch (e) {
      console.error(e);
      alert("Gagal upload: " + (e.message || "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setIsCropping(false);
    setImage(null);
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">{label}</label>
      
      {/* Trigger / Preview Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative transition-all cursor-pointer group flex flex-col items-center justify-center overflow-hidden 
          ${circular ? 'w-32 h-32 rounded-full mx-auto' : 'w-full aspect-video'}
          ${(preview || previewUrl) ? 'border-none bg-transparent' : 'bg-neutral-50 border border-dashed border-neutral-200 hover:border-black'}`}
      >
        {(preview || previewUrl) ? (
          <>
            <img src={preview || previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className={`text-white ${circular ? 'w-5 h-5' : 'w-6 h-6'}`} />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-300 group-hover:text-black">
            <Camera className={circular ? 'w-6 h-6' : 'w-8 h-8'} />
            {!circular && <span className="text-[10px] font-mono uppercase tracking-widest">Select & Crop</span>}
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-5 h-5 animate-spin text-black" />
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />

      {/* Cropping Modal Overlay */}
      {isCropping && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-white/10">
            <h3 className="text-white font-mono text-xs uppercase tracking-widest">Adjust Image</h3>
            <div className="flex gap-4">
              <button onClick={handleCancel} className="text-white/60 hover:text-white flex items-center gap-2">
                <X className="w-4 h-4" /> <span className="text-[10px] font-mono uppercase">Cancel</span>
              </button>
              <button 
                onClick={handleCropSave} 
                disabled={uploading}
                className="bg-white text-black px-4 py-1.5 flex items-center gap-2 hover:bg-neutral-200 transition-colors"
              >
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                <span className="text-[10px] font-mono uppercase font-bold text-black">Crop & Save</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-neutral-900">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="p-6 bg-black border-t border-white/10">
            <div className="max-w-xs mx-auto">
              <label className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest mb-2 text-center">Zoom Level</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(e.target.value)}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
