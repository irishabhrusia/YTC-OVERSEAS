'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageToCloudinary, deleteCloudinaryImage } from '../../lib/adminApi';

export default function ImageUploadWidget({
  value,
  onChange,
  label = 'Upload Image',
  helpText = 'PNG, JPG, WEBP, or SVG up to 2MB (Cloudinary Hosted)',
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Client-side quick size validation
    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds 2MB limit.');
      return;
    }

    setUploading(true);
    setError(null);

    const res = await uploadImageToCloudinary(file);
    setUploading(false);

    if (res.success && res.data) {
      onChange(res.data.url, res.data.publicId);
    } else {
      setError(res.message || 'Image upload failed. Please try again.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = async (e) => {
    e.stopPropagation();
    onChange('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>

      {value ? (
        <div className="relative group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2 flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0 pr-8">
            <p className="text-xs font-medium text-slate-800 truncate">{value}</p>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Hosted on Cloudinary
            </span>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            title="Remove image"
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            uploading
              ? 'border-blue-400 bg-blue-50/50'
              : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center py-2 text-blue-600">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-xs font-semibold">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-1">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-700">
                <span className="text-blue-600 font-semibold hover:underline">Click to upload</span>{' '}
                or drag and drop
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{helpText}</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>}
    </div>
  );
}

