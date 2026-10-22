package com.shaninoumi.sndownloader.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.shaninoumi.sndownloader.ui.theme.WhatsAppGreen
import com.shaninoumi.sndownloader.ui.theme.WhatsAppGreenDark

@Composable
fun WhatsAppFloatingButton(
    phoneNumber: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "wa_pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Box(
        modifier = modifier
            .padding(16.dp)
            .scale(pulseScale),
        contentAlignment = Alignment.Center
    ) {
        // Glowing Ambient Ring
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(CircleShape)
                .background(WhatsAppGreen.copy(alpha = 0.25f))
        )

        // WhatsApp Green Action Button
        FloatingActionButton(
            onClick = onClick,
            shape = CircleShape,
            containerColor = WhatsAppGreen,
            contentColor = Color.White,
            modifier = Modifier
                .size(56.dp)
                .shadow(12.dp, CircleShape, spotColor = WhatsAppGreen)
        ) {
            Icon(
                imageVector = Icons.Default.Chat,
                contentDescription = "WhatsApp Customer Support (+923288501635)",
                modifier = Modifier.size(28.dp),
                tint = Color.White
            )
        }
    }
}
