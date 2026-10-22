import { Platform, VideoInfo, QualityOption } from '../types';
import { APP_CONFIG } from '../constants/config';

export interface ParseResult {
  isValid: boolean;
  platform: Platform;
  error?: string;
  suggestion?: string;
  officialUrl?: string;
}

export function analyzeUrl(inputUrl: string): ParseResult {
  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return {
      isValid: false,
      platform: 'unknown',
      error: 'Please enter or paste a video link.',
    };
  }

  let parsed: URL;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch {
    return {
      isValid: false,
      platform: 'unknown',
      error: 'Invalid URL format. Please paste a valid web link.',
    };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  // TikTok Check
  if (hostname.includes('tiktok.com')) {
    return {
      isValid: true,
      platform: 'tiktok',
      officialUrl: 'https://www.tiktok.com',
    };
  }

  // Instagram Check
  if (hostname.includes('instagram.com') || hostname === 'instagr.am') {
    return {
      isValid: true,
      platform: 'instagram',
      officialUrl: 'https://www.instagram.com',
    };
  }

  // YouTube Check
  if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
    return {
      isValid: true,
      platform: 'youtube',
      officialUrl: 'https://www.youtube.com',
    };
  }

  // Facebook Check
  if (hostname.includes('facebook.com') || hostname.includes('fb.watch') || hostname === 'fb.com') {
    return {
      isValid: true,
      platform: 'facebook',
      officialUrl: 'https://www.facebook.com',
    };
  }

  // Direct MP4 / WebM video link
  if (/\.(mp4|webm|m4v|mov|mkv)(\?.*)?$/i.test(parsed.pathname)) {
    return {
      isValid: true,
      platform: 'direct',
    };
  }

  return {
    isValid: false,
    platform: 'unknown',
    error: `Unsupported platform "${hostname}".`,
    suggestion: 'SN Downloader supports TikTok, Instagram, YouTube, Facebook, and direct media URLs.',
  };
}

export function extractMediaDetails(url: string, platform: Platform): VideoInfo {
  // Check if it's one of the built-in sample test URLs
  const sample = APP_CONFIG.sampleUrls.find((s) => s.platform === platform || url.includes(s.platform));

  const cleanSourceAvailable = platform === 'tiktok' || platform === 'direct' || platform === 'instagram';

  const defaultQualityOptions: QualityOption[] = [
    {
      id: '1080p',
      label: '1080p Full HD',
      resolution: '1920x1080',
      format: 'mp4',
      approxSize: '24.8 MB',
      bitrate: '4500 kbps',
      fps: 60,
      hasAudio: true,
      isWatermarkFree: cleanSourceAvailable,
    },
    {
      id: '720p',
      label: '720p HD',
      resolution: '1280x720',
      format: 'mp4',
      approxSize: '14.2 MB',
      bitrate: '2500 kbps',
      fps: 30,
      hasAudio: true,
      isWatermarkFree: cleanSourceAvailable,
    },
    {
      id: '480p',
      label: '480p SD',
      resolution: '854x480',
      format: 'mp4',
      approxSize: '7.6 MB',
      bitrate: '1200 kbps',
      fps: 30,
      hasAudio: true,
      isWatermarkFree: cleanSourceAvailable,
    },
    {
      id: 'mp3',
      label: 'MP3 Audio (High Quality)',
      resolution: 'Audio 320k',
      format: 'mp3',
      approxSize: '3.4 MB',
      bitrate: '320 kbps',
      hasAudio: true,
      isWatermarkFree: true,
    },
  ];

  if (sample && (url === sample.url || url.includes(sample.platform))) {
    return {
      url,
      title: sample.title,
      author: sample.author,
      thumbnail: sample.thumbnail,
      duration: sample.duration,
      durationSeconds: 45,
      platform,
      cleanSourceAvailable,
      qualityOptions: defaultQualityOptions,
      viewCount: '1.4M views',
      likesCount: '142K likes',
    };
  }

  // Derive realistic title from URL or domain
  let cleanTitle = 'Downloaded Media Clip';
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const lastPart = pathParts[pathParts.length - 1];
      cleanTitle = `${platform.toUpperCase()} - ${lastPart.slice(0, 24).replace(/[^a-zA-Z0-9-_]/g, '')}`;
    }
  } catch {
    cleanTitle = `${platform.toUpperCase()} Video`;
  }

  return {
    url,
    title: cleanTitle,
    author: `@user_${Math.floor(1000 + Math.random() * 9000)}`,
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    duration: '0:38',
    durationSeconds: 38,
    platform,
    cleanSourceAvailable,
    qualityOptions: defaultQualityOptions,
    viewCount: '89.2K views',
    likesCount: '12.4K likes',
  };
}
