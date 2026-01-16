'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  File,
  FileImage,
  FileSpreadsheet,
  Presentation,
} from 'lucide-react';
import { Button } from '@omnipdf/ui/src/Button';
import { Card, CardContent } from '@omnipdf/ui/src/Card';
import { Input } from '@omnipdf/ui/src/Input';
import { Progress } from '@omnipdf/ui/src/BadgeProgress';
import { FileDropZone } from '@/components/convert/FileDropZone';
import {
  SUPPORTED_FORMATS,
  formatBytes,
  getFileExtension,
  cn,
} from '@omnipdf/shared/src/utils';
import { ConversionFormat } from '@omnipdf/shared/src/types';

const conversionSteps = [
  { id: 'upload', title: 'Upload Files' },
  { id: 'configure', title: 'Configure' },
  { id: 'convert', title: 'Convert' },
  { id: 'complete', title: 'Complete' },
];

const formatIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  docx: FileText,
  doc: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
      pptx: Presentation,
      ppt: Presentation,
  jpg: FileImage,
  jpeg: FileImage,
  png: FileImage,
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
};

interface ConvertedFile {
  id: string;
  name: string;
  format: string;
  size: number;
  url: string;
}

export default function ConvertPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);

  const currentStepData = conversionSteps[currentStep];

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const handleNext = () => {
    if (currentStep < conversionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConvert = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('outputFormat', outputFormat);
      formData.append('conversionType', 'convert');

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: JSON.stringify({
          type: 'convert',
          documentIds: files.map((_, i) => `temp-${i}`),
          outputFormat,
        }),
      });

      if (!response.ok) {
        throw new Error('Conversion failed');
      }

      const data = await response.json();

      // Simulate converted files for demo
      setConvertedFiles(
        files.map((file, index) => ({
          id: `converted-${index}`,
          name: `${file.name.replace(/\.[^/.]+$/, '')}.${outputFormat}`,
          format: outputFormat,
          size: Math.floor(file.size * 0.8), // Simulated size
          url: '#',
        }))
      );

      handleNext();
    } catch (err) {
      setError('Conversion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file: ConvertedFile) => {
    // In production, this would trigger the actual download
    alert(`Downloading ${file.name}`);
  };

  const handleDownloadAll = () => {
    // In production, this would download all files as a zip
    alert('Downloading all files as ZIP');
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-white">
              Convert PDF
            </h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            {conversionSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-surface-200 text-surface-500 dark:bg-surface-700 dark:text-surface-400'
                  )}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm font-medium hidden sm:inline',
                    index === currentStep
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-600 dark:text-surface-400'
                  )}
                >
                  {step.title}
                </span>
                {index < conversionSteps.length - 1 && (
                  <div className="mx-4 h-0.5 w-12 bg-surface-200 dark:bg-surface-700 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Upload */}
          {currentStep === 0 && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card padding="lg">
                <CardContent>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                    Upload your files
                  </h2>
                  <FileDropZone
                    onFilesSelected={handleFilesSelected}
                    maxFiles={20}
                    maxSize={500 * 1024 * 1024} // 500MB
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Configure */}
          {currentStep === 1 && (
            <motion.div
              key="configure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card padding="lg">
                <CardContent className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                      Configure conversion
                    </h2>
                    <p className="text-surface-600 dark:text-surface-400 mb-4">
                      Selected {files.length} file{files.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Files List */}
                  <div className="space-y-2">
                    {files.map((file, index) => {
                      const ext = getFileExtension(file.name);
                      const IconComponent = formatIcons[ext] || File;
                      const colorClass = formatColors[ext] || 'text-surface-500 bg-surface-100';

                      return (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-800"
                        >
                          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorClass)}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-surface-900 dark:text-white">
                              {file.name}
                            </p>
                            <p className="text-sm text-surface-500">
                              {formatBytes(file.size)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Output Format */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Output format
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {SUPPORTED_FORMATS.map((format) => (
                        <button
                          key={format}
                          onClick={() => setOutputFormat(format as ConversionFormat)}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                            outputFormat === format
                              ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                              : 'border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-400'
                          )}
                        >
                          .{format}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button variant="secondary" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      disabled={files.length === 0}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Convert */}
          {currentStep === 2 && (
            <motion.div
              key="convert"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card padding="lg">
                <CardContent className="text-center py-12">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                    Converting your files...
                  </h2>
                  <p className="text-surface-600 dark:text-surface-400 mb-6">
                    This may take a few moments depending on file size
                  </p>
                  <Progress value={65} showLabel className="max-w-xs mx-auto" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 3 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card padding="lg">
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
                      Conversion complete!
                    </h2>
                    <p className="text-surface-600 dark:text-surface-400 mt-2">
                      Your {convertedFiles.length} file{convertedFiles.length !== 1 ? 's are' : ' is'} ready
                    </p>
                  </div>

                  {/* Converted Files */}
                  <div className="space-y-2">
                    {convertedFiles.map((file, index) => {
                      const ext = getFileExtension(file.name);
                      const IconComponent = formatIcons[ext] || File;
                      const colorClass = formatColors[ext] || 'text-surface-500 bg-surface-100';

                      return (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 rounded-lg border border-surface-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-800"
                        >
                          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorClass)}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-surface-900 dark:text-white">
                              {file.name}
                            </p>
                            <p className="text-sm text-surface-500">
                              {formatBytes(file.size)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(file)}
                            leftIcon={<Download className="h-4 w-4" />}
                          >
                            Download
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      variant="secondary"
                      onClick={handleDownloadAll}
                      className="flex-1"
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Download All as ZIP
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setFiles([]);
                        setConvertedFiles([]);
                        setCurrentStep(0);
                      }}
                      className="flex-1"
                      leftIcon={<Upload className="h-4 w-4" />}
                    >
                      Convert More Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
