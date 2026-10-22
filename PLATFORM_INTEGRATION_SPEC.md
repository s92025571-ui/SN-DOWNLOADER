# Platform Integration & Backend Resolution Architecture

This technical specification details the backend resolution strategies, APIs, and legal/DRM compliance rules for **SN Downloader (Shani Noumi Downloader)** across TikTok, Instagram, YouTube, and Facebook.

---

## 1. Architectural Overview

Client devices (both the native Android app and the Web UI) can directly download public media files where progressive URLs are available. However, because modern social platforms continuously update their CDN tokens, bot mitigation mechanisms, and streaming formats (such as DASH and HLS), a production-grade downloader architecture pairs the client with a lightweight microservice parser.

```
+-------------------------------------------------------------+
|              SN Downloader Client (Android / Web)           |
+-------------------------------------------------------------+
                              |
                     POST /api/analyze-link
                              v
+-------------------------------------------------------------+
|                 Backend Extraction Service                  |
|             (Node.js / Python FastApi / Go)                 |
+-------------------------------------------------------------+
        |                  |                   |              |
        v                  v                   v              v
+---------------+  +---------------+  +---------------+ +---------------+
|  TikTok OEM / |  | Instagram     |  | YouTube       | | Facebook      |
|  Clean Feed   |  | Graph / Web   |  | Stream Muxer  | | Public Watch  |
|  Extractor    |  | Parser        |  | Engine        | | Scraper       |
+---------------+  +---------------+  +---------------+ +---------------+
```

---

## 2. Platform Breakdown

### A. TikTok
- **Supported Formats**: 1080p Full HD, 720p HD, Original Audio MP3.
- **Watermark-Free Mechanism**: TikTok stores both a watermarked video (with creator handle bounce) and an un-watermarked clean feed (used in feeds and previews) on their CDN (`v16-webapp.tiktokcdn.com`). The backend resolves the clean video ID and provides the direct stream without watermark overlays.
- **DRM & Access Restrictions**: Private accounts and geoblocked music cannot be extracted. When restricted, the user is redirected to the official TikTok app via `https://www.tiktok.com`.

### B. Instagram (Reels & Feed)
- **Supported Formats**: 1080p HD MP4, 720p MP4, Audio extraction.
- **Resolution Strategy**: Resolves public Reels using Instagram's public JSON-LD metadata or GraphQL queries.
- **Copyright Compliance**: SN Downloader only processes public posts. Content from private accounts, expiring 24h stories requiring authentication, or DRM-protected audio tracks will display a policy notice and prompt opening Instagram.

### C. YouTube
- **Supported Formats**: 1080p FHD (requires video+audio remuxing), 720p HD progressive, 480p SD, and 320kbps MP3 Audio.
- **Backend Resolution Engine**: Standard `yt-dlp` or YouTube Player API response extraction.
- **Policy Compliance**: Strictly prohibits downloading paid content (YouTube Movies, YouTube Red/Premium DRM streams). Obeys robots.txt and Fair Use principles.

### D. Facebook (Watch & Reels)
- **Supported Formats**: HD 1080p, SD 480p, Audio.
- **Resolution Strategy**: Extracts Progressive MP4 streams from `hd_src` and `sd_src` meta attributes on public posts.
- **Limitations**: Closed Facebook groups and friends-only posts cannot be scraped without user cookies. The app informs the user and offers an "Open in Facebook" button.

---

## 3. Recommended Backend Implementation

A sample Express / Python handler for production deployment:

```typescript
// Express proxy endpoint example
app.post('/api/resolve-media', async (req, res) => {
  const { url, platform } = req.body;
  
  if (!url || !platform) {
    return res.status(400).json({ error: 'Missing URL or platform' });
  }

  try {
    // Call trusted extraction library or RapidAPI downloader endpoint
    const resolvedData = await mediaExtractor.resolve(url);
    res.json({
      success: true,
      title: resolvedData.title,
      thumbnail: resolvedData.thumbnail,
      cleanSourceAvailable: resolvedData.hasCleanSource,
      qualities: resolvedData.streams
    });
  } catch (err) {
    res.status(422).json({
      error: 'Platform content is private, DRM-protected, or requires login.',
      officialUrl: url
    });
  }
});
```

---

## 4. WhatsApp Support Integration Specification

- **Owner Number**: `+923288501635`
- **Configurable Location**: Stored in `APP_CONFIG.defaultWhatsAppNumber` (Web) and `strings.xml` / `MainViewModel.kt` (Android).
- **Format**: International E.164 format without spaces or symbols for deep linking: `https://wa.me/923288501635?text=...`.
- **Prefilled Message**: `Assalam-o-Alaikum, mujhe SN Downloader app mein help chahiye.`.
