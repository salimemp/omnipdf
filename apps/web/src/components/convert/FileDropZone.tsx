'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  File, 
  Image, 
  Table, 
  Presentation, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { Progress } from '@omnipdf/ui/src/BadgeProgress';
import { cn, formatBytes, SUPPORTED_FORMATS, getFileExtension } from '@omnipdf/shared/src/utils';
import { ConversionFormat, ConversionType } from '@omnipdf/shared/src/types';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  onClose?: () => void;
  selectedFormat?: ConversionFormat;
  conversionType?: ConversionType;
}

const formatIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  docx: FileText,
  doc: FileText,
  xlsx: Table,
  xls: Table,
  pptx: Presentation,
  ppt: Presentation,
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
};

const formatColors: Record<string, string> = {
  pdf: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  docx: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  doc: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  xlsx: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  xls: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  pptx: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  ppt: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
  jpg: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  jpeg: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  png: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
  gif: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
};

interface FileWithPreview extends File {
  preview?: string;
  uploading?: boolean;
  progress?: number;
  error?: string;
  success?: boolean;
}

export function FileDropZone({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 500 * 1024 * 1024, // 500MB default
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'],
    'text/*': ['.txt', '.csv'],
  },
  multiple = true,
  onClose,
  selectedFormat,
  conversionType,
}: FileDropZoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        ...file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    maxFiles: maxFiles - files.length,
    maxSize,
    accept,
    multiple,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const getFileIcon = (file: File) => {
    const ext = getFileExtension(file.name);
    const IconComponent = formatIcons[ext] || File;
    const colorClass = formatColors[ext] || 'text-surface-500 bg-surface-100 dark:bg-surface-700';
    
    return (
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorClass)}>
        <IconComponent className="h-5 w-5" />
      </div>
    );
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'drop-zone relative transition-all duration-200',
          isDragActive && 'active',
          isDragReject && 'border-red-500 bg-red-50 dark:bg-red-900/20',
          files.length > 0 && 'hidden'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Upload className="h-8 w-8" />
          </div>
          <p className="text-lg font-medium text-surface-900 dark:text-white">
            Drag & drop your files here
          </p>
          <p className="mt-1 text-sm text-surface-500">
            or click to browse from your computer
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUPPORTED_FORMATS.slice(0, 8).map((format) => (
              <span
                key={format}
                className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-400"
              >
                .{format}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-surface-400">
            Max file size: {formatBytes(maxSize)} • Max {maxFiles} files
          </p>
        </div>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-surface-900 dark:text-white">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
              Clear all
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-800"
                >
                  {getFileIcon(file)}

                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-surface-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-surface-500">
                      {formatBytes(file.size)}
                    </p>
                  </div>

                  {file.uploading && (
                    <div className="w-20">
                      <Progress value={file.progress || 0} size="sm" />
                    </div>
                  )}

                  {file.success && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}

                  {file.error && (
                    <div className="flex items-center gap-1 text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">{file.error}</span>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={file.uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between rounded-lg bg-surface-100 px-4 py-3 dark:bg-surface-800">
            <span className="text-sm text-surface-600 dark:text-surface-400">
              Total: {files.length} file{files.length > 1 ? 's' : ''}
            </span>
            <span className="text-sm font-medium text-surface-900 dark:text-white">
              {formatBytes(totalSize)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => setFiles([])}
              disabled={files.length === 0}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleContinue}
              disabled={files.length === 0}
              leftIcon={<Loader2 className="h-4 w-4" />}
            >
              Continue to Convert
            </Button>
          </div>
        </div>
      )}

      {/* Close Button */}
      {onClose && files.length === 0 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
