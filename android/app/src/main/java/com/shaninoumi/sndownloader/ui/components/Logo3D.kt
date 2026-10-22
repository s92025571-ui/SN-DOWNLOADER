package com.shaninoumi.sndownloader.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shaninoumi.sndownloader.ui.theme.*

@Composable
fun AnimatedSNLogo(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "logo_anim")
    val glowAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(1800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "glow"
    )

    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 3D Obsidian & Metallic Monogram Badge
        Box(
            modifier = Modifier
                .size(56.dp)
                .shadow(16.dp, RoundedCornerShape(16.dp), spotColor = ElectricCyan)
                .background(
                    brush = Brush.radialGradient(
                        listOf(ElectricCyan.copy(alpha = glowAlpha), Color.Transparent),
                        radius = 80f
                    ),
                    shape = RoundedCornerShape(16.dp)
                )
                .padding(2.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(DarkNavyCard)
                .border(
                    width = 1.5.dp,
                    brush = Brush.linearGradient(listOf(ElectricCyan, NeonPurple)),
                    shape = RoundedCornerShape(14.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "SN",
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 20.sp,
                    color = MetallicSilver,
                    letterSpacing = (-1).sp
                )
                Icon(
                    imageVector = Icons.Default.ArrowDownward,
                    contentDescription = null,
                    tint = ElectricCyan,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        // App Branding Typography
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "SN Downloader",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = MetallicSilver
                )
                Spacer(modifier = Modifier.width(6.dp))
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(4.dp))
                        .background(ElectricCyan.copy(alpha = 0.15f))
                        .border(0.8.dp, ElectricCyan.copy(alpha = 0.4f), RoundedCornerShape(4.dp))
                        .padding(horizontal = 4.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "v2.4",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = ElectricCyan
                    )
                }
            }
            Text(
                text = "By Shani Noumi Downloader",
                fontSize = 12.sp,
                color = MetallicMuted
            )
        }
    }
}
