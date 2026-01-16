"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  FolderOpen,
  Upload,
  Download,
  RefreshCw,
  Settings,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Link,
  Users,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@omnipdf/ui/src/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@omnipdf/ui/src/Card";
import { Input } from "@omnipdf/ui/src/Input";
import { cn } from "@omnipdf/shared/src/utils";

export type CloudProvider = "google-drive" | "dropbox" | "onedrive" | "box";

export interface CloudFile {
  id: string;
  name: string;
  type: string;
  size: number;
  modifiedAt: string;
  path: string;
  thumbnailUrl?: string;
  shared: boolean;
  sharedLink?: string;
}

export interface CloudProviderConfig {
  provider: CloudProvider;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  lastSync?: string;
  fileCount?: number;
}

export interface CloudStorageProps {
  onFileSelect: (file: CloudFile) => void;
  onUploadComplete?: (files: CloudFile[]) => void;
  className?: string;
}

const PROVIDER_CONFIGS: CloudProviderConfig[] = [
  {
    provider: "google-drive",
    name: "Google Drive",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        />
        <path fill="#34A853" d="M12 6v12c3.31 0 6-2.69 6-6s-2.69-6-6-6z" />
      </svg>
    ),
    connected: true,
    lastSync: new Date().toISOString(),
    fileCount: 156,
  },
  {
    provider: "dropbox",
    name: "Dropbox",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#0061FF" d="M6 2l6 3.75L6 9.5 0 5.75 6 2z" />
        <path fill="#0061FF" d="M0 9.5l6 3.75 6-3.75-6-3.75-6 3.75z" />
        <path fill="#0061FF" d="M0 17.25L6 13.5l6 3.75-6 3.75-6-3.75z" />
        <path
          fill="#0061FF"
          d="M12 13.5l6 3.75v-7.5l-6-3.75-6 3.75v7.5l6-3.75z"
        />
      </svg>
    ),
    connected: true,
    lastSync: new Date().toISOString(),
    fileCount: 89,
  },
  {
    provider: "onedrive",
    name: "OneDrive",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#0078D4" d="M12 2L2 8.5v7L12 22l10-6.5v-7L12 2z" />
        <path fill="#0078D4" d="M2 15.5v-7l10 6.5 10-6.5v7l-10 6.5-10-6.5z" />
      </svg>
    ),
    connected: true,
    lastSync: new Date().toISOString(),
    fileCount: 234,
  },
  {
    provider: "box",
    name: "Box",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#0061D5" d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2z" />
      </svg>
    ),
    connected: false,
  },
];

const MOCK_FILES: CloudFile[] = [
  {
    id: "1",
    name: "Quarterly Report.pdf",
    type: "pdf",
    size: 2458624,
    modifiedAt: new Date().toISOString(),
    path: "/Documents/Reports",
    shared: false,
  },
  {
    id: "2",
    name: "Invoice-2024-001.pdf",
    type: "pdf",
    size: 156432,
    modifiedAt: new Date(Date.now() - 86400000).toISOString(),
    path: "/Documents/Invoices",
    shared: true,
    sharedLink: "https://box.com/s/abc123",
  },
  {
    id: "3",
    name: "Contract Draft.docx",
    type: "docx",
    size: 89456,
    modifiedAt: new Date(Date.now() - 172800000).toISOString(),
    path: "/Documents/Contracts",
    shared: false,
  },
  {
    id: "4",
    name: "Presentation.pptx",
    type: "pptx",
    size: 3456789,
    modifiedAt: new Date(Date.now() - 259200000).toISOString(),
    path: "/Presentations",
    shared: false,
  },
];

export function CloudStorage({
  onFileSelect,
  onUploadComplete,
  className,
}: CloudStorageProps) {
  const [activeProvider, setActiveProvider] =
    useState<CloudProvider>("google-drive");
  const [files, setFiles] = useState<CloudFile[]>(MOCK_FILES);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareFile, setShareFile] = useState<CloudFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentProvider = PROVIDER_CONFIGS.find(
    (p) => p.provider === activeProvider,
  );

  const handleSync = useCallback(async () => {
    setSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSyncing(false);
  }, []);

  const handleFileSelect = useCallback(
    (file: CloudFile) => {
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleToggleSelect = useCallback((fileId: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  }, []);

  const handleShare = useCallback((file: CloudFile) => {
    setShareFile(file);
    setShowShareDialog(true);
  }, []);

  const handleCreateShareLink = useCallback(
    async (
      file: CloudFile,
      permissions: { read: boolean; write: boolean },
      expiresIn?: number,
    ) => {
      setLoading(true);
      try {
        const response = await fetch("/api/cloud/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: activeProvider,
            fileId: file.id,
            permissions,
            expiresIn,
          }),
        });

        if (!response.ok) throw new Error("Failed to create share link");

        const data = await response.json();
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, shared: true, sharedLink: data.shareUrl }
              : f,
          ),
        );
        setShowShareDialog(false);
      } catch (error) {
        console.error("Share link error:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeProvider],
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
          Cloud Storage
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Upload className="h-4 w-4" />}
          >
            Upload
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {PROVIDER_CONFIGS.map((provider) => (
          <button
            key={provider.provider}
            onClick={() => setActiveProvider(provider.provider)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeProvider === provider.provider
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700",
            )}
          >
            <span className="w-5 h-5">{provider.icon}</span>
            <span className="hidden sm:inline">{provider.name}</span>
            {provider.connected && (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            )}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b border-surface-200 p-3 dark:border-surface-700">
            <FolderOpen className="h-4 w-4 text-surface-500" />
            <span className="text-sm font-medium text-surface-600 dark:text-surface-400">
              {currentProvider?.name}
            </span>
            {currentProvider?.connected && (
              <span className="text-xs text-surface-500">
                ({currentProvider.fileCount} files)
              </span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          <div className="divide-y divide-surface-200 dark:divide-surface-700">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "flex items-center gap-3 p-3 transition-colors",
                  selectedFiles.has(file.id)
                    ? "bg-primary-50 dark:bg-primary-900/20"
                    : "hover:bg-surface-50 dark:hover:bg-surface-800/50",
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => handleToggleSelect(file.id)}
                  className="h-4 w-4 rounded border-surface-300"
                />

                <button
                  onClick={() => handleFileSelect(file)}
                  className="flex flex-1 items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
                    <Cloud className="h-5 w-5 text-surface-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-surface-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {file.path} • {formatFileSize(file.size)} •{" "}
                      {formatDate(file.modifiedAt)}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  {file.shared ? (
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Shared
                    </span>
                  ) : (
                    <button
                      onClick={() => handleShare(file)}
                      className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <Share2 className="h-4 w-4 text-surface-500" />
                    </button>
                  )}
                  <button className="p-1.5 rounded hover:bg-surface-100 dark:hover:bg-surface-700">
                    <MoreVertical className="h-4 w-4 text-surface-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showShareDialog && shareFile && (
          <ShareDialog
            file={shareFile}
            onClose={() => setShowShareDialog(false)}
            onCreateLink={handleCreateShareLink}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ShareDialogProps {
  file: CloudFile;
  onClose: () => void;
  onCreateLink: (
    file: CloudFile,
    permissions: { read: boolean; write: boolean },
    expiresIn?: number,
  ) => void;
  loading: boolean;
}

function ShareDialog({
  file,
  onClose,
  onCreateLink,
  loading,
}: ShareDialogProps) {
  const [permissions, setPermissions] = useState({ read: true, write: false });
  const [expiresIn, setExpiresIn] = useState<number | undefined>(
    7 * 24 * 60 * 60,
  );
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (file.sharedLink) {
      navigator.clipboard.writeText(file.sharedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-surface-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
          Share "{file.name}"
        </h3>

        {file.sharedLink ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                Share link is active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Input value={file.sharedLink} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="secondary">
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Link className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.read}
                  onChange={(e) =>
                    setPermissions({ ...permissions, read: e.target.checked })
                  }
                  className="rounded border-surface-300"
                />
                <span className="text-sm">Allow viewing</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.write}
                  onChange={(e) =>
                    setPermissions({ ...permissions, write: e.target.checked })
                  }
                  className="rounded border-surface-300"
                />
                <span className="text-sm">Allow editing</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Link permissions
              </h4>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.read}
                  onChange={(e) =>
                    setPermissions({ ...permissions, read: e.target.checked })
                  }
                  className="rounded border-surface-300"
                />
                <span className="text-sm">Anyone with the link can view</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={permissions.write}
                  onChange={(e) =>
                    setPermissions({ ...permissions, write: e.target.checked })
                  }
                  className="rounded border-surface-300"
                />
                <span className="text-sm">Anyone with the link can edit</span>
              </label>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Link expiration
              </h4>
              <select
                value={expiresIn || ""}
                onChange={(e) =>
                  setExpiresIn(
                    e.target.value ? parseInt(e.target.value) : undefined,
                  )
                }
                className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm dark:border-surface-600 dark:bg-surface-800"
              >
                <option value="">Never expires</option>
                <option value="3600">1 hour</option>
                <option value="86400">1 day</option>
                <option value="604800">7 days</option>
                <option value="2592000">30 days</option>
                <option value="31536000">1 year</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {!file.sharedLink && (
            <Button
              variant="primary"
              onClick={() => onCreateLink(file, permissions, expiresIn)}
              disabled={loading || !permissions.read}
            >
              {loading ? "Creating..." : "Create Share Link"}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
