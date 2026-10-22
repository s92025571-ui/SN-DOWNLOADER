import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileCode,
  FolderTree,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  BookOpen,
  Download
} from 'lucide-react';

interface AndroidFileItem {
  name: string;
  path: string;
  language: string;
  category: 'ui' | 'logic' | 'gradle' | 'config' | 'doc';
  description: string;
  code: string;
}

const ANDROID_PROJECT_FILES: AndroidFileItem[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/shaninoumi/sndownloader/MainActivity.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Main Jetpack Compose entry point with 3D Midnight Navy theme, Navigation & WhatsApp intent launcher',
    code: `package com.shaninoumi.sndownloader

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.shaninoumi.sndownloader.ui.navigation.NavGraph
import com.shaninoumi.sndownloader.ui.theme.SNDownloaderTheme
import com.shaninoumi.sndownloader.ui.viewmodel.MainViewModel

/**
 * SN Downloader - Shani Noumi Downloader
 * Official Native Android Application
 */
class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            SNDownloaderTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    NavGraph(
                        navController = navController,
                        viewModel = viewModel,
                        onOpenWhatsApp = { phoneNumber, message ->
                            launchWhatsAppChat(phoneNumber, message)
                        }
                    )
                }
            }
        }
    }

    private fun launchWhatsAppChat(phone: String, message: String) {
        val cleanNumber = phone.replace("+", "").replace(" ", "")
        val uri = Uri.parse("https://wa.me/\$cleanNumber?text=\${Uri.encode(message)}")
        val intent = Intent(Intent.ACTION_VIEW, uri)
        try {
            startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(this, "WhatsApp is not installed. Opening browser...", Toast.LENGTH_SHORT).show()
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        }
    }
}`,
  },
  {
    name: 'AndroidDownloadService.kt',
    path: 'app/src/main/java/com/shaninoumi/sndownloader/download/AndroidDownloadService.kt',
    language: 'kotlin',
    category: 'logic',
    description: 'Native Android DownloadManager integration with Environment.DIRECTORY_DOWNLOADS and notification handling',
    code: `package com.shaninoumi.sndownloader.download

import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import com.shaninoumi.sndownloader.data.model.DownloadItem
import com.shaninoumi.sndownloader.data.model.QualityOption
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import java.io.File

/**
 * Android Native Download Service
 * Saves verified authorized media directly into user's public Downloads directory
 */
class AndroidDownloadService(private val context: Context) {

    private val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager

    fun enqueueDownload(
        mediaUrl: String,
        title: String,
        platform: String,
        quality: QualityOption
    ): Long {
        val sanitizedTitle = title.replace("[^a-zA-Z0-9_.-]".toRegex(), "_").take(32)
        val ext = if (quality.format == "mp3") "mp3" else "mp4"
        val fileName = "SN_\${platform}_\${sanitizedTitle}_\${quality.resolution}.\$ext"

        val request = DownloadManager.Request(Uri.parse(mediaUrl))
            .setTitle(title)
            .setDescription("Downloading via SN Downloader (Shani Noumi Downloader)")
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
            .setAllowedOverMetered(true)
            .setAllowedOverRoaming(false)

        return downloadManager.enqueue(request)
    }

    fun getDownloadProgress(downloadId: Long): Flow<Int> = flow {
        var downloading = true
        while (downloading) {
            val query = DownloadManager.Query().setFilterById(downloadId)
            val cursor = downloadManager.query(query)
            if (cursor.moveToFirst()) {
                val bytesDownloaded = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR))
                val bytesTotal = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES))
                val status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS))

                if (status == DownloadManager.STATUS_SUCCESSFUL) {
                    emit(100)
                    downloading = false
                } else if (status == DownloadManager.STATUS_FAILED) {
                    downloading = false
                    error("Download failed or interrupted")
                } else if (bytesTotal > 0) {
                    val progress = ((bytesDownloaded * 100L) / bytesTotal).toInt()
                    emit(progress)
                }
            }
            cursor.close()
            kotlinx.coroutines.delay(400)
        }
    }
}`,
  },
  {
    name: 'HomeScreen.kt',
    path: 'app/src/main/java/com/shaninoumi/sndownloader/ui/screens/HomeScreen.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Jetpack Compose Home Screen with 3D logo, URL input, platform chips, video preview & WhatsApp button',
    code: `package com.shaninoumi.sndownloader.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.unit.dp
import com.shaninoumi.sndownloader.ui.components.*
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
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(MaterialTheme.colorScheme.background)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 3D Animated Logo
            AnimatedSNLogo()

            // URL Input Field + Paste + Analyze
            UrlInputField(
                url = urlText,
                onUrlChange = { urlText = it },
                onPasteClick = {
                    clipboardManager.getText()?.text?.let { urlText = it }
                },
                onAnalyzeClick = {
                    viewModel.analyzeUrl(urlText)
                },
                isLoading = uiState.isAnalyzing
            )

            // Supported Platform Cards
            PlatformCardsRow(
                onPlatformSelected = { sampleUrl ->
                    urlText = sampleUrl
                    viewModel.analyzeUrl(sampleUrl)
                }
            )

            // Video Preview Area
            uiState.analyzedVideo?.let { video ->
                VideoPreviewCard(
                    video = video,
                    onStartDownload = { quality ->
                        viewModel.startDownload(video, quality)
                    }
                )
            }

            // Real-time Active Download Progress
            uiState.activeDownload?.let { download ->
                DownloadProgressBar(
                    item = download,
                    onCancel = { viewModel.cancelDownload(download.id) }
                )
            }
        }
    }
}`,
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/shaninoumi/sndownloader/ui/theme/Theme.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Material 3 Dark Midnight Navy Theme with Electric Cyan & Neon Purple accents',
    code: `package com.shaninoumi.sndownloader.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val MidnightNavy = Color(0xFF050811)
val SlateGlass = Color(0xFF0B1120)
val ElectricCyan = Color(0xFF00E5FF)
val NeonPurple = Color(0xFF9333EA)
val MetallicSilver = Color(0xFFE2E8F0)
val WhatsAppGreen = Color(0xFF25D366)

private val DarkColorScheme = darkColorScheme(
    primary = ElectricCyan,
    secondary = NeonPurple,
    tertiary = WhatsAppGreen,
    background = MidnightNavy,
    surface = SlateGlass,
    onPrimary = Color.Black,
    onSecondary = Color.White,
    onBackground = MetallicSilver,
    onSurface = MetallicSilver
)

@Composable
fun SNDownloaderTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}`,
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    category: 'config',
    description: 'Android manifest with permissions for internet, storage, download notifications and queries',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Network permissions for downloading media and analyzing URLs -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Storage permissions for saving media to public Downloads folder -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    
    <!-- Notifications for download progress and completion -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <queries>
        <!-- WhatsApp Package query for customer support chat intent -->
        <package android:name="com.whatsapp" />
        <package android:name="com.whatsapp.w4b" />
    </queries>

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="SN Downloader"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SNDownloader">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="SN Downloader"
            android:theme="@style/Theme.SNDownloader">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Handle shared URLs from TikTok, Instagram, YouTube, Facebook -->
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/plain" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  },
  {
    name: 'build.gradle.kts (App)',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    category: 'gradle',
    description: 'Gradle App Module configuration with Jetpack Compose Material 3 & Coroutines',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.shaninoumi.sndownloader"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.shaninoumi.sndownloader"
        minSdk = 26
        targetSdk = 34
        versionCode = 24
        versionName = "2.4.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("io.coil-kt:coil-compose:2.5.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
}`,
  },
];

export const AndroidCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidFileItem>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'build_guide' | 'backend_spec'>('files');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <span>Native Android Project & APK Suite</span>
          </h2>
          <p className="text-xs text-slate-400">
            Complete production-grade Kotlin, Jetpack Compose & Material 3 architecture.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'files'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Source Code ({ANDROID_PROJECT_FILES.length})
          </button>
          <button
            onClick={() => setActiveTab('build_guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'build_guide'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Build & Export APK
          </button>
          <button
            onClick={() => setActiveTab('backend_spec')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'backend_spec'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            API & Backend Spec
          </button>
        </div>
      </div>

      {activeTab === 'files' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* File Tree Left Column */}
          <div className="md:col-span-4 space-y-1.5 glass-panel rounded-2xl p-3 border border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
              Android Project Files
            </span>

            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-400/40 text-white'
                      : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate leading-tight">{file.name}</p>
                    <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">{file.path}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Right Column */}
          <div className="md:col-span-8 glass-panel rounded-2xl p-4 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedFile.description}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[480px]">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'build_guide' && (
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 space-y-5 text-slate-300 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Terminal className="w-5 h-5" />
            <span>How to Build, Export and Install the SN Downloader APK</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs">Step 1: Open in Android Studio</h4>
              <p>
                Download or clone the repository and open the <code className="text-cyan-300 font-mono">android/</code> directory in <strong>Android Studio Hedgehog (2023.1.1) or Ladybug (2024.2+)</strong>.
                Gradle will automatically sync all Jetpack Compose dependencies.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs">Step 2: Generate Signed Release APK</h4>
              <p>In terminal or Android Studio terminal, run the following Gradle task:</p>
              <div className="p-3 rounded-xl bg-black border border-slate-800 font-mono text-cyan-400 select-all">
                ./gradlew assembleRelease
              </div>
              <p className="text-[11px] text-slate-400">
                The APK will be generated at: <code className="text-slate-300">android/app/build/outputs/apk/release/app-release-unsigned.apk</code>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs">Step 3: Sign the APK using Keytool & Apksigner</h4>
              <div className="p-3 rounded-xl bg-black border border-slate-800 font-mono text-emerald-400 text-[11px] space-y-1 select-all">
                <p>keytool -genkey -v -keystore sndownloader.keystore -alias sndownloader -keyalg RSA -keysize 2048 -validity 10000</p>
                <p>apksigner sign --ks sndownloader.keystore --out SNDownloader_v2.4.apk app-release-unsigned.apk</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs">Step 4: Install on Real Android Device</h4>
              <p>Connect phone via USB and enable USB Debugging, or transfer <code className="text-slate-300">SNDownloader_v2.4.apk</code> via WhatsApp/Drive:</p>
              <div className="p-3 rounded-xl bg-black border border-slate-800 font-mono text-cyan-400 select-all">
                adb install -r SNDownloader_v2.4.apk
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backend_spec' && (
        <div className="glass-panel rounded-3xl p-6 border border-purple-500/30 space-y-5 text-slate-300 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <BookOpen className="w-5 h-5" />
            <span>Platform Integration & Backend Resolution Architecture</span>
          </div>

          <p>
            Because modern social platforms (TikTok, Instagram, YouTube, Facebook) employ dynamic tokens, signature handshakes,
            and bot protection, production downloader apps use a lightweight backend extractor microservice.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-300">TikTok Resolution</span>
              <p className="text-[11px] text-slate-400">
                Uses official OEM embed API or clean CDN stream parsing. Clean MP4 stream is extracted without the moving watermark box.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-pink-400">Instagram Reels</span>
              <p className="text-[11px] text-slate-400">
                Parses the public JSON-LD or GraphQL query endpoint. Encrypted session cookies are supported for private creator reels.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-red-400">YouTube Streams</span>
              <p className="text-[11px] text-slate-400">
                Resolves adaptive DASH/HLS audio and video muxing using standard yt-dlp or rapid video extractor engines.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-blue-400">Facebook Public Watch</span>
              <p className="text-[11px] text-slate-400">
                Extracts SD and HD Progressive MP4 URLs from OpenGraph meta tags on public watch videos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
