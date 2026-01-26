import React, { useCallback, useState } from 'react';
import { Upload, FileImage, X } from 'lucide-react';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  currentFile: File | null;
  onClear: () => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileAccepted, currentFile, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files: File[] = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileAccepted(files[0]);
    }
  }, [onFileAccepted]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileAccepted(e.target.files[0]);
    }
  }, [onFileAccepted]);

  if (currentFile) {
    const imageUrl = URL.createObjectURL(currentFile);
    return (
      <div className="relative group w-full h-64 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm border border-gray-200 dark:border-[#2C2C2E] overflow-hidden flex items-center justify-center">
         <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain p-4" />
         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={onClear}
              className="bg-white text-red-500 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" /> Remove Image
            </button>
         </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer
        ${isDragging 
          ? 'border-primary bg-primary/5 scale-[1.02]' 
          : 'border-gray-300 dark:border-[#3A3A3C] bg-white dark:bg-[#1C1C1E] hover:border-gray-400 dark:hover:border-[#505052] hover:bg-gray-50 dark:hover:bg-[#2C2C2E]'
        }
      `}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-[#2C2C2E] text-gray-500 dark:text-gray-400'} mb-4 transition-colors`}>
        {isDragging ? <FileImage className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
      </div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        {isDragging ? 'Drop it here!' : 'Drag & drop your image'}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        or click to browse (PNG, JPG)
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        Recommended: 1024x1024 px or larger
      </p>
    </div>
  );
};

export default Dropzone;