// ============================================
// MediaUploader — Drag & drop image/video upload
// Pro-grade upload zone with preview, reorder, delete
// ============================================

"use client";

import { useState, useRef, useCallback } from "react";

export type MediaFile = {
  id: string;
  url: string;
  type: "image" | "video";
  name: string;
  isNew?: boolean;
  file?: File;
};

type MediaUploaderProps = {
  value: MediaFile[];
  onChange: (files: MediaFile[]) => void;
  maxFiles?: number;
};

export default function MediaUploader({
  value,
  onChange,
  maxFiles = 10,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      const remaining = maxFiles - value.length;
      if (remaining <= 0) return;

      const toUpload = files.slice(0, remaining);
      setUploading(true);

      try {
        const formData = new FormData();
        toUpload.forEach((f) => formData.append("files", f));

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await res.json();

        if (json.success && json.data) {
          const newMedia: MediaFile[] = json.data.map(
            (item: { url: string; type: "image" | "video"; name: string }) => ({
              id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              url: item.url,
              type: item.type,
              name: item.name,
              isNew: true,
            })
          );
          onChange([...value, ...newMedia]);
        }
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, maxFiles]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    const idx = value.findIndex((f) => f.id === id);
    if (idx <= 0) return;
    const updated = [...value];
    const [item] = updated.splice(idx, 1);
    updated.unshift(item);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-amber-500 bg-amber-50/50 scale-[1.01]"
            : "border-gray-200 bg-gray-50/50 hover:border-amber-400 hover:bg-amber-50/30"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                Drop files here or <span className="text-amber-600 font-semibold">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Images (JPG, PNG, WebP) & Videos (MP4, WebM) — Max 10MB images, 100MB videos
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Media Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((media, index) => (
            <div
              key={media.id}
              className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
            >
              {media.type === "image" ? (
                <img
                  src={media.url}
                  alt={media.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <video src={media.url} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-md shadow-sm">
                  Main
                </div>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(media.id)}
                    className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white flex items-center justify-center text-gray-700 shadow-sm transition-colors"
                    title="Set as main image"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(media.id)}
                  className="w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-600 flex items-center justify-center text-white shadow-sm transition-colors"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-gray-400 text-right">
        {value.length} / {maxFiles} files
      </p>
    </div>
  );
}
