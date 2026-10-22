package com.shaninoumi.sndownloader.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.shaninoumi.sndownloader.data.model.DownloadItem
import com.shaninoumi.sndownloader.data.model.QualityOption
import com.shaninoumi.sndownloader.data.model.VideoDetails
import com.shaninoumi.sndownloader.ui.components.AnimatedSNLogo
import com.shaninoumi.sndownloader.ui.components.GlassPanel
import com.shaninoumi.sndownloader.ui.components.WhatsAppFloatingButton
import com.shaninoumi.sndownloader.ui.theme.*
import com.shaninoumi.sndownloader.ui.viewmodel.MainViewModel

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onOpenWhatsApp: (String, String) -> Unit,
    onNavigateToDownloads: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val clipboardManager = LocalClipboardManager.current
    var urlText by remember { mutableStateOf("") }

    Scaffold(
        floatingActionButton = {
            WhatsAppFloatingButton(
                phoneNumber = uiState.whatsAppNumber,
                onClick = {
                    onOpenWhatsApp(uiState.whatsAppNumber, uiState.whatsAppMessage)
                }
            )
        },
        containerColor = MidnightNavy
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 3D Animated Logo Header
            AnimatedSNLogo()

            // URL Input Card
            GlassPanel(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "PASTE VIDEO LINK",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = ElectricCyan,
                        letterSpacing = 1.sp
                    )

                    OutlinedTextField(
                        value = urlText,
                        onValueChange = { urlText = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = {
                            Text("Paste TikTok, Instagram, YouTube or Facebook URL", color = MetallicMuted, fontSize = 12.sp)
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = ElectricCyan,
                            unfocusedBorderColor = Color(0xFF1E293B),
                            focusedContainerColor = DarkNavySurface,
                            unfocusedContainerColor = DarkNavySurface,
                            focusedTextColor = MetallicSilver,
                            unfocusedTextColor = MetallicSilver
                        ),
                        shape = RoundedCornerShape(14.dp),
                        trailingIcon = {
                            IconButton(onClick = {
                                clipboardManager.getText()?.text?.let {
                                    urlText = it
                                    viewModel.analyzeUrl(it)
                                }
                            }) {
                                Icon(Icons.Default.ContentPaste, contentDescription = "Paste", tint = ElectricCyan)
                            }
                        },
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = { viewModel.analyzeUrl(urlText) })
                    )

                    Button(
                        onClick = { viewModel.analyzeUrl(urlText) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ElectricCyan),
                        shape = RoundedCornerShape(14.dp),
                        enabled = !uiState.isAnalyzing
                    ) {
                        if (uiState.isAnalyzing) {
                            CircularProgressIndicator(modifier = Modifier.size(20.dp), color = MidnightNavy)
                        } else {
                            Icon(Icons.Default.Search, contentDescription = null, tint = MidnightNavy)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Analyze Video", fontWeight = FontWeight.Bold, color = MidnightNavy)
                        }
                    }

                    uiState.errorMessage?.let { error ->
                        Text(
                            text = error,
                            color = ErrorRose,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            // Platform Cards Strip
            Text(
                text = "SUPPORTED PLATFORMS",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = MetallicMuted,
                letterSpacing = 1.sp
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(
                    "TikTok" to Color(0xFF00F2FE),
                    "Instagram" to Color(0xFFE1306C),
                    "YouTube" to Color(0xFFFF0000),
                    "Facebook" to Color(0xFF1877F2)
                ).forEach { (name, color) ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(14.dp))
                            .background(DarkNavyCard)
                            .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(14.dp))
                            .padding(vertical = 12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(color)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = name, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MetallicSilver)
                        }
                    }
                }
            }

            // Video Preview Section
            uiState.analyzedVideo?.let { video ->
                VideoPreviewComponent(
                    video = video,
                    onDownload = { quality ->
                        viewModel.startDownload(video, quality)
                    }
                )
            }

            // Active Download Progress
            uiState.activeDownload?.let { download ->
                ActiveDownloadProgressCard(
                    download = download,
                    onCancel = { viewModel.cancelDownload(download.id) }
                )
            }
        }
    }
}

@Composable
fun VideoPreviewComponent(
    video: VideoDetails,
    onDownload: (QualityOption) -> Unit
) {
    var selectedQuality by remember { mutableStateOf(video.qualities.firstOrNull()) }

    GlassPanel(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                AsyncImage(
                    model = video.thumbnail,
                    contentDescription = null,
                    modifier = Modifier
                        .size(90.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkNavySurface)
                )

                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(text = video.title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = MetallicSilver)
                    Text(text = video.author, fontSize = 12.sp, color = ElectricCyan)
                    if (video.isCleanSourceAvailable) {
                        Text(
                            text = "Clean Source (No Watermark)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = SuccessEmerald
                        )
                    }
                }
            }

            // Quality Selection Row
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                video.qualities.forEach { quality ->
                    val isSelected = selectedQuality == quality
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (isSelected) ElectricCyan.copy(alpha = 0.2f) else DarkNavySurface)
                            .border(
                                1.dp,
                                if (isSelected) ElectricCyan else Color(0xFF1E293B),
                                RoundedCornerShape(10.dp)
                            )
                            .clickable { selectedQuality = quality }
                            .padding(8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterVertically) {
                            Text(text = quality.resolution, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MetallicSilver)
                            Text(text = quality.approxSize, fontSize = 9.sp, color = MetallicMuted)
                        }
                    }
                }
            }

            // Download Trigger Button
            Button(
                onClick = { selectedQuality?.let { onDownload(it) } },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = NeonPurple),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Download, contentDescription = null, tint = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Download Now", fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

@Composable
fun ActiveDownloadProgressCard(
    download: DownloadItem,
    onCancel: () -> Unit
) {
    GlassPanel(modifier = Modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(text = "Downloading Media...", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = ElectricCyan)
                    Text(text = download.title, fontSize = 11.sp, color = MetallicMuted, maxLines = 1)
                }
                IconButton(onClick = onCancel) {
                    Icon(Icons.Default.Close, contentDescription = "Cancel", tint = MetallicMuted)
                }
            }

            LinearProgressIndicator(
                progress = { download.progress / 100f },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .clip(RoundedCornerShape(4.dp)),
                color = ElectricCyan,
                trackColor = DarkNavySurface
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "${download.progress}% · ${download.speed}", fontSize = 11.sp, color = MetallicMuted)
                Text(text = "ETA: ${download.eta}", fontSize = 11.sp, color = MetallicMuted)
            }
        }
    }
}
