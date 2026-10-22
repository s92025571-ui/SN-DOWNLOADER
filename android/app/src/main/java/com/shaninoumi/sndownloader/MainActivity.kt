package com.shaninoumi.sndownloader

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
 * Premium Native Android App with Jetpack Compose & Material 3
 */
class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Handle shared link from other apps if shared via Intent.ACTION_SEND
        handleIncomingShareIntent(intent)

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

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleIncomingShareIntent(it) }
    }

    private fun handleIncomingShareIntent(intent: Intent) {
        if (intent.action == Intent.ACTION_SEND && intent.type == "text/plain") {
            val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
            if (!sharedText.isNullOrBlank()) {
                viewModel.analyzeUrl(sharedText)
            }
        }
    }

    /**
     * Opens official WhatsApp chat using wa.me link with configurable phone number and prefilled message
     */
    private fun launchWhatsAppChat(phoneNumber: String, message: String) {
        val cleanNumber = phoneNumber.replace("+", "").replace(" ", "").trim()
        val encodedMessage = Uri.encode(message)
        val uri = Uri.parse("https://wa.me/$cleanNumber?text=$encodedMessage")

        val whatsappIntent = Intent(Intent.ACTION_VIEW, uri).apply {
            setPackage("com.whatsapp")
        }

        try {
            startActivity(whatsappIntent)
        } catch (e: Exception) {
            // Fallback to general browser or WhatsApp Business
            try {
                val browserIntent = Intent(Intent.ACTION_VIEW, uri)
                startActivity(browserIntent)
            } catch (err: Exception) {
                Toast.makeText(this, "Could not open WhatsApp support: ${err.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
