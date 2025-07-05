import React, { useState, useRef, useCallback } from "react";
import { FiUpload, FiX, FiImage, FiFile } from "react-icons/fi";

const FileUpload = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ["image/*"],
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 1,
  multiple = false,
  dragDrop = true,
  preview = true,
  className = "",
  disabled = false,
  placeholder = "Drop files here or click to browse",
  showProgress = false,
  uploadProgress = 0,
  error = null,
  value = null,
  fieldName = "file",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = useCallback(
    (file) => {
      // Check file size
      if (file.size > maxSize) {
        return `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(
          1
        )}MB`;
      }

      // Check file type
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(
          ", "
        )}`;
      }

      return null;
    },
    [maxSize, acceptedTypes]
  );

  const handleFileSelect = useCallback(
    (files) => {
      const fileArray = Array.from(files);
      setLocalError(null);

      if (fileArray.length === 0) return;

      // Validate number of files
      if (!multiple && fileArray.length > 1) {
        setLocalError("Only one file is allowed");
        return;
      }

      if (multiple && fileArray.length > maxFiles) {
        setLocalError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate each file
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setLocalError(validationError);
          return;
        }
      }

      // Call parent handler
      if (multiple) {
        onFileSelect(fileArray);
      } else {
        onFileSelect(fileArray[0]);
      }
    },
    [multiple, maxFiles, validateFile, onFileSelect]
  );

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      handleFileSelect(files);
    },
    [disabled, handleFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e) => {
      const files = e.target.files;
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(
    (index) => {
      if (onFileRemove) {
        onFileRemove(index);
      }
    },
    [onFileRemove]
  );

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) {
      return <FiImage className="w-6 h-6 text-blue-500" />;
    }
    return <FiFile className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderPreview = () => {
    if (!preview || !value) return null;

    const files = Array.isArray(value) ? value : [value];

    return (
      <div className="mt-4 space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(file)}
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderProgress = () => {
    if (!showProgress || uploadProgress === 0) return null;

    return (
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Uploading... {uploadProgress}%
        </p>
      </div>
    );
  };

  const errorMessage = error || localError;

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${
            isDragOver && !disabled
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-400"
          }
          ${errorMessage ? "border-red-500 bg-red-50" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          name={fieldName}
        />

        <div className="space-y-2">
          <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">{placeholder}</p>
            <p className="text-xs text-gray-500 mt-1">
              {acceptedTypes.join(", ")} • Max {formatFileSize(maxSize)}
              {multiple && maxFiles > 1 && ` • Up to ${maxFiles} files`}
            </p>
          </div>
        </div>

        {dragDrop && !disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 rounded-lg">
            <p className="text-blue-600 font-medium opacity-0 hover:opacity-100">
              Drop files here
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}

      {renderProgress()}
      {renderPreview()}
    </div>
  );
};

// Specialized upload components
export const ImageUpload = (props) => (
  <FileUpload
    acceptedTypes={["image/*"]}
    maxSize={10 * 1024 * 1024} // 10MB
    placeholder="Drop images here or click to browse"
    {...props}
  />
);

export const DocumentUpload = (props) => (
  <FileUpload
    acceptedTypes={["image/*", "application/pdf"]}
    maxSize={50 * 1024 * 1024} // 50MB
    placeholder="Drop documents here or click to browse"
    {...props}
  />
);

export const GalleryUpload = (props) => (
  <FileUpload
    acceptedTypes={["image/*"]}
    maxSize={20 * 1024 * 1024} // 20MB
    multiple={true}
    maxFiles={10}
    placeholder="Drop images here or click to browse"
    {...props}
  />
);

export default FileUpload;
