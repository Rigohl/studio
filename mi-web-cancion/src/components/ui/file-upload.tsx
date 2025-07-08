"use client";

import { useState, useRef, forwardRef } from "react";
import { Upload, X, FileAudio, FileImage, FileText, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Label } from "./label";

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ 
    onFilesChange, 
    accept = "*/*", 
    multiple = false, 
    maxSize = 10, 
    className, 
    disabled = false,
    placeholder = "Arrastra archivos aquí o haz clic para seleccionar"
  }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('audio/')) return FileAudio;
      if (file.type.startsWith('image/')) return FileImage;
      if (file.type.startsWith('text/')) return FileText;
      return File;
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return `El archivo "${file.name}" es demasiado grande. Máximo ${maxSize}MB.`;
      }
      return null;
    };

    const handleFiles = (newFiles: FileList | null) => {
      if (!newFiles) return;

      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];
      let errorMessage = "";

      fileArray.forEach(file => {
        const validation = validateFile(file);
        if (validation) {
          errorMessage = validation;
        } else {
          validFiles.push(file);
        }
      });

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      setError("");
      let updatedFiles: File[];
      
      if (multiple) {
        updatedFiles = [...files, ...validFiles];
      } else {
        updatedFiles = validFiles.slice(0, 1);
      }

      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    };

    const removeFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    };

    const openFileDialog = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.click();
      }
    };

    return (
      <div className={cn("w-full", className)}>
        <input
          ref={ref || inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging && !disabled
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed bg-gray-100"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-500" />
          <p className="text-sm text-gray-600 mb-2">{placeholder}</p>
          {accept !== "*/*" && (
            <p className="text-xs text-gray-500">
              Archivos permitidos: {accept}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-gray-500">
              Tamaño máximo: {maxSize}MB
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}

        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium">Archivos seleccionados:</Label>
            {files.map((file, index) => {
              const Icon = getFileIcon(file);
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
export type { FileUploadProps };