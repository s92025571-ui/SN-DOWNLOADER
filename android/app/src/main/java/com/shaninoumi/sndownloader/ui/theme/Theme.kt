package com.shaninoumi.sndownloader.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = ElectricCyan,
    onPrimary = MidnightNavy,
    primaryContainer = DarkNavyCard,
    onPrimaryContainer = ElectricCyan,
    secondary = NeonPurple,
    onSecondary = MetallicSilver,
    tertiary = WhatsAppGreen,
    background = MidnightNavy,
    surface = DarkNavySurface,
    onBackground = MetallicSilver,
    onSurface = MetallicSilver,
    error = ErrorRose
)

@Composable
fun SNDownloaderTheme(
    darkTheme: Boolean = true, // Default to premium dark 3D midnight navy
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = MidnightNavy.toArgb()
            window.navigationBarColor = MidnightNavy.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
