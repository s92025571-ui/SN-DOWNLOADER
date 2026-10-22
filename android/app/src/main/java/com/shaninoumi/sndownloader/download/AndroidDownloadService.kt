package com.shaninoumi.sndownloader.download

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import com.shaninoumi.sndownloader.data.model.QualityOption
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

/**
 * Native Android Download Service using Android's DownloadManager
 * Saves verified authorized files into Environment.DIRECTORY_DOWNLOADS
 */
class AndroidDownloadService(private val context: Context) {

    private val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager

    fun enqueueDownload(
        mediaUrl: String,
        title: String,
        platformName: String,
        quality: QualityOption
    ): Long {
        val sanitizedTitle = title.replace("[^a-zA-Z0-9_.-]".toRegex(), "_").take(32)
        val ext = if (quality.format == "mp3") "mp3" else "mp4"
        val fileName = "SN_${platformName}_${sanitizedTitle}_${quality.resolution}.$ext"

        val request = DownloadManager.Request(Uri.parse(mediaUrl))
            .setTitle(title)
            .setDescription("Downloading via SN Downloader (Shani Noumi Downloader)")
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
            .setAllowedOverMetered(true)
            .setAllowedOverRoaming(false)

        return downloadManager.enqueue(request)
    }

    fun observeDownloadProgress(downloadId: Long): Flow<DownloadProgress> = flow {
        var isRunning = true
        while (isRunning) {
            val query = DownloadManager.Query().setFilterById(downloadId)
            val cursor = downloadManager.query(query)
            if (cursor != null && cursor.moveToFirst()) {
                val bytesDownloaded = cursor.getLong(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR))
                val bytesTotal = cursor.getLong(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES))
                val status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS))

                when (status) {
                    DownloadManager.STATUS_SUCCESSFUL -> {
                        emit(DownloadProgress(100, bytesDownloaded, bytesTotal, isComplete = true))
                        isRunning = false
                    }
                    DownloadManager.STATUS_FAILED -> {
                        val reason = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_REASON))
                        emit(DownloadProgress(0, bytesDownloaded, bytesTotal, isFailed = true, errorMessage = "Download failed (code: $reason)"))
                        isRunning = false
                    }
                    else -> {
                        val percentage = if (bytesTotal > 0) ((bytesDownloaded * 100) / bytesTotal).toInt() else 0
                        emit(DownloadProgress(percentage, bytesDownloaded, bytesTotal))
                    }
                }
            }
            cursor?.close()
            delay(350)
        }
    }
}

data class DownloadProgress(
    val percentage: Int,
    val bytesDownloaded: Long,
    val totalBytes: Long,
    val isComplete: Boolean = false,
    val isFailed: Boolean = false,
    val errorMessage: String? = null
)
