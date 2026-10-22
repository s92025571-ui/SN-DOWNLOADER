export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'direct' | 'unknown';

export interface QualityOption {
  id: string;
  label: string;
  resolution: string;
  format: 'mp4' | 'mp3' | 'webm';
  approxSize: string;
  bitrate?: string;
  fps?: number;
  hasAudio: boolean;
  isWatermarkFree: boolean;
}

export interface VideoInfo {
  url: string;
  title: string;
  author: string;
  authorAvatar?: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  platform: Platform;
  cleanSourceAvailable: boolean;
  qualityOptions: QualityOption[];
  viewCount?: string;
  likesCount?: string;
}

export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  platform: Platform;
  quality: QualityOption;
  status: DownloadStatus;
  progress: number; // 0 to 100
  downloadedBytes: number;
  totalBytes: number;
  speed: string; // e.g., "6.4 MB/s"
  eta: string; // e.g., "4s"
  createdAt: number;
  completedAt?: number;
  errorMessage?: string;
  fileBlobUrl?: string;
  fileName: string;
}

export interface AppSettings {
  whatsappNumber: string;
  whatsappMessage: string;
  defaultQuality: string;
  autoAnalyzeClipboard: boolean;
  highSpeedThreads: number;
  theme: 'midnight' | 'cyber';
  savePath: string;
  watermarkFreeByDefault: boolean;
}
