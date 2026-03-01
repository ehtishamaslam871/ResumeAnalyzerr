import { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

export default function FileUpload({ onFileSelect, isLoading }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const removeFile = () => {
    setSelectedFile(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 scale-[1.02]'
              : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-900'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              dragActive ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-800'
            }`}>
              <Upload className={`w-8 h-8 ${dragActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Drop your resume here or <span className="text-indigo-600 dark:text-indigo-400">browse</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Supports PDF, Word (.docx), and Text files
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatSize(selectedFile.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isLoading && (
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
