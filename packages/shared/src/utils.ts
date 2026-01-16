import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const value = bytes / Math.pow(k, i);
  let formatted: string;
  if (dm === 0) {
    formatted = String(Math.floor(value));
  } else {
    formatted = value.toFixed(dm);
    if (decimals === 2) {
      formatted = formatted.replace(/\.?0+$/, '');
    }
  }
  
  return formatted + ' ' + sizes[i];
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(d);
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const createId = generateId;

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  const ellipsis = '...';
  const availableLength = length - ellipsis.length;
  return str.slice(0, Math.max(0, availableLength)) + ellipsis;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

export function getFilenameWithoutExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

export function isValidFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
}

export function getMimeType(filename: string): string {
  const ext = getFileExtension(filename);
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    html: 'text/html',
    htm: 'text/html',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    tif: 'image/tiff',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    epub: 'application/epub+zip',
    mobi: 'application/x-mobipocket-ebook',
    azw3: 'application/x-mobipocket-ebook',
    csv: 'text/csv',
    json: 'application/json',
    xml: 'application/xml',
    md: 'text/markdown',
    markdown: 'text/markdown',
    rtf: 'application/rtf',
    odt: 'application/vnd.oasis.opendocument.text',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odp: 'application/vnd.oasis.opendocument.presentation',
    zip: 'application/zip',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
  backoff: number = 2
): Promise<T> {
  return fn().catch((err) => {
    if (retries <= 0) throw err;
    return sleep(delay).then(() => retry(fn, retries - 1, delay * backoff, backoff));
  });
}

export const CONVERSION_PAIRS: Record<string, string[]> = {
  pdf: ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'txt', 'html', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg', 'epub', 'mobi', 'azw3', 'csv', 'json', 'xml', 'markdown', 'rtf', 'odt', 'ods', 'odp'],
  docx: ['pdf', 'doc', 'txt', 'html', 'rtf', 'odt'],
  doc: ['pdf', 'docx', 'txt', 'rtf'],
  xlsx: ['pdf', 'xls', 'csv', 'json', 'ods'],
  xls: ['pdf', 'xlsx', 'csv', 'ods'],
  pptx: ['pdf', 'ppt', 'odp'],
  ppt: ['pdf', 'pptx', 'odp'],
  txt: ['pdf', 'docx', 'doc', 'html', 'markdown', 'rtf'],
  html: ['pdf', 'docx', 'txt'],
  jpg: ['pdf', 'png', 'gif', 'bmp', 'tiff', 'webp'],
  jpeg: ['pdf', 'png', 'gif', 'bmp', 'tiff', 'webp'],
  png: ['pdf', 'jpg', 'gif', 'bmp', 'tiff', 'webp'],
  gif: ['pdf', 'jpg', 'png', 'bmp', 'tiff', 'webp'],
  bmp: ['pdf', 'jpg', 'png', 'gif', 'tiff', 'webp'],
  tiff: ['pdf', 'jpg', 'png', 'gif', 'bmp', 'webp'],
  webp: ['pdf', 'jpg', 'png', 'gif', 'bmp', 'tiff'],
  svg: ['pdf', 'jpg', 'png'],
  epub: ['pdf', 'mobi', 'azw3'],
  mobi: ['pdf', 'epub', 'azw3'],
  azw3: ['pdf', 'epub', 'mobi'],
  csv: ['pdf', 'xlsx', 'xls', 'json', 'ods'],
  json: ['pdf', 'csv', 'xlsx', 'ods'],
  xml: ['pdf', 'json', 'txt', 'html'],
  markdown: ['pdf', 'docx', 'txt', 'html'],
  rtf: ['pdf', 'docx', 'doc', 'txt', 'odt'],
  odt: ['pdf', 'docx', 'doc', 'txt', 'rtf'],
  ods: ['pdf', 'xlsx', 'xls', 'csv', 'json'],
  odp: ['pdf', 'pptx', 'ppt'],
};

export function canConvert(from: string, to: string): boolean {
  return CONVERSION_PAIRS[from]?.includes(to) ?? false;
}

export function getConvertibleFormats(from: string): string[] {
  return CONVERSION_PAIRS[from] ?? [];
}

export const SUPPORTED_FORMATS = [
  'pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt',
  'txt', 'html', 'jpg', 'jpeg', 'png', 'gif', 'bmp',
  'tiff', 'webp', 'svg', 'epub', 'mobi', 'azw3',
  'csv', 'json', 'xml', 'markdown', 'rtf', 'odt',
  'ods', 'odp'
];
