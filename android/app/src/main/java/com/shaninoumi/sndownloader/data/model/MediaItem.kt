package com.shaninoumi.sndownloader.data.model

enum class PlatformType(val displayName: String, val colorHex: Long) {
    TIKTOK("TikTok", 0xFF00F2FE),
    INSTAGRAM("Instagram", 0xFFE1306C),
    YOUTUBE("YouTube", 0xFFFF0000),
    FACEBOOK("Facebook", 0xFF1877F2),
    DIRECT("Direct Media", 0xFF00E5FF),
    UNKNOWN("Unknown", 0xFF94A3B8)
}

enum class DownloadStatus {
    QUEUED,
    DOWNLOADING,
    PAUSED,
    COMPLETED,
    FAILED,
    CANCELLED
}

data class QualityOption(
    val id: String,
    val label: String,
    val resolution: String,
    val format: String, // "mp4", "mp3"
    val approxSize: String,
    val isWatermarkFree: Boolean = true
)

data class VideoDetails(
    val url: String,
    val title: String,
    val author: String,
    val thumbnail: String,
    val duration: String,
    val platform: PlatformType,
    val isCleanSourceAvailable: Boolean,
    val qualities: List<QualityOption>,
    val directDownloadUrl: String? = null
)

data class DownloadItem(
    val id: String,
    val url: String,
    val title: String,
    val thumbnail: String,
    val platform: PlatformType,
    val quality: QualityOption,
    val status: DownloadStatus,
    val progress: Int, // 0 - 100
    val speed: String,
    val eta: String,
    val downloadedBytes: Long,
    val totalBytes: Long,
    val filePath: String? = null,
    val errorMessage: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
