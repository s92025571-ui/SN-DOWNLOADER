package com.shaninoumi.sndownloader.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.shaninoumi.sndownloader.data.model.*
import com.shaninoumi.sndownloader.data.repository.DownloadRepository
import com.shaninoumi.sndownloader.download.AndroidDownloadService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class UiState(
    val isAnalyzing: Boolean = false,
    val analyzedVideo: VideoDetails? = null,
    val errorMessage: String? = null,
    val activeDownload: DownloadItem? = null,
    val downloadHistory: List<DownloadItem> = emptyList(),
    // Configurable WhatsApp support details (Owner: Shani Noumi +923288501635)
    val whatsAppNumber: String = "+923288501635",
    val whatsAppMessage: String = "Assalam-o-Alaikum, mujhe SN Downloader app mein help chahiye."
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = DownloadRepository()
    private val downloadService = AndroidDownloadService(application)

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun analyzeUrl(url: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isAnalyzing = true, errorMessage = null, analyzedVideo = null) }
            val result = repository.analyzeUrl(url)
            result.onSuccess { details ->
                _uiState.update { it.copy(isAnalyzing = false, analyzedVideo = details) }
            }.onFailure { err ->
                _uiState.update { it.copy(isAnalyzing = false, errorMessage = err.message ?: "Failed to analyze URL") }
            }
        }
    }

    fun startDownload(video: VideoDetails, quality: QualityOption) {
        viewModelScope.launch {
            val downloadItem = DownloadItem(
                id = "dl_${System.currentTimeMillis()}",
                url = video.url,
                title = video.title,
                thumbnail = video.thumbnail,
                platform = video.platform,
                quality = quality,
                status = DownloadStatus.DOWNLOADING,
                progress = 0,
                speed = "8.4 MB/s",
                eta = "3s",
                downloadedBytes = 0,
                totalBytes = 25 * 1024 * 1024
            )

            _uiState.update {
                it.copy(
                    activeDownload = downloadItem,
                    downloadHistory = listOf(downloadItem) + it.downloadHistory
                )
            }
        }
    }

    fun cancelDownload(id: String) {
        _uiState.update { it.copy(activeDownload = null) }
    }

    fun clearHistory() {
        _uiState.update { it.copy(downloadHistory = emptyList()) }
    }

    fun updateWhatsAppDetails(number: String, message: String) {
        _uiState.update {
            it.copy(whatsAppNumber = number, whatsAppMessage = message)
        }
    }
}
