package com.shaninoumi.sndownloader.data.repository

import com.shaninoumi.sndownloader.data.model.PlatformType
import com.shaninoumi.sndownloader.data.model.QualityOption
import com.shaninoumi.sndownloader.data.model.VideoDetails
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.URI

class DownloadRepository {

    suspend fun analyzeUrl(inputUrl: String): Result<VideoDetails> = withContext(Dispatchers.IO) {
        val trimmed = inputUrl.trim()
        if (trimmed.isEmpty()) {
            return@withContext Result.failure(IllegalArgumentException("Please enter a video URL"))
        }

        val platform = detectPlatform(trimmed)
        if (platform == PlatformType.UNKNOWN) {
            return@withContext Result.failure(
                IllegalArgumentException("Unsupported platform. SN Downloader supports TikTok, Instagram, YouTube, Facebook, and direct media URLs.")
            )
        }

        val cleanSourceAvailable = platform == PlatformType.TIKTOK || platform == PlatformType.DIRECT || platform == PlatformType.INSTAGRAM

        val sampleQualities = listOf(
            QualityOption("1080p", "1080p Full HD", "1920x1080", "mp4", "24.8 MB", cleanSourceAvailable),
            QualityOption("720p", "720p HD", "1280x720", "mp4", "14.2 MB", cleanSourceAvailable),
            QualityOption("480p", "480p SD", "854x480", "mp4", "7.6 MB", cleanSourceAvailable),
            QualityOption("mp3", "MP3 Audio (320kbps)", "Audio", "mp3", "3.4 MB", true)
        )

        val title = when (platform) {
            PlatformType.TIKTOK -> "Viral Trending TikTok Video"
            PlatformType.INSTAGRAM -> "Instagram HD Reel"
            PlatformType.YOUTUBE -> "YouTube High Definition Stream"
            PlatformType.FACEBOOK -> "Facebook Public Watch Video"
            PlatformType.DIRECT -> "Direct Media Video Stream"
            else -> "Media Stream"
        }

        val details = VideoDetails(
            url = trimmed,
            title = title,
            author = "@creator_${platform.name.lowercase()}",
            thumbnail = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            duration = "0:35",
            platform = platform,
            isCleanSourceAvailable = cleanSourceAvailable,
            qualities = sampleQualities
        )

        Result.success(details)
    }

    private fun detectPlatform(url: String): PlatformType {
        val lower = url.lowercase()
        return when {
            lower.contains("tiktok.com") -> PlatformType.TIKTOK
            lower.contains("instagram.com") || lower.contains("instagr.am") -> PlatformType.INSTAGRAM
            lower.contains("youtube.com") || lower.contains("youtu.be") -> PlatformType.YOUTUBE
            lower.contains("facebook.com") || lower.contains("fb.watch") || lower.contains("fb.com") -> PlatformType.FACEBOOK
            lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.contains(".mp4?") -> PlatformType.DIRECT
            else -> PlatformType.UNKNOWN
        }
    }
}
