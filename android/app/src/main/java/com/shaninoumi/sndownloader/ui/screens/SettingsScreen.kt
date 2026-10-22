package com.shaninoumi.sndownloader.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shaninoumi.sndownloader.ui.components.GlassPanel
import com.shaninoumi.sndownloader.ui.theme.*
import com.shaninoumi.sndownloader.ui.viewmodel.MainViewModel

@Composable
fun SettingsScreen(
    viewModel: MainViewModel
) {
    val uiState by viewModel.uiState.collectAsState()
    var numberText by remember { mutableStateOf(uiState.whatsAppNumber) }
    var messageText by remember { mutableStateOf(uiState.whatsAppMessage) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MidnightNavy)
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Settings & Support",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = MetallicSilver
        )

        // WhatsApp Support Settings
        GlassPanel(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "WHATSAPP CUSTOMER SUPPORT",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = WhatsAppGreen,
                    letterSpacing = 1.sp
                )

                OutlinedTextField(
                    value = numberText,
                    onValueChange = { numberText = it },
                    label = { Text("Owner WhatsApp Number") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = messageText,
                    onValueChange = { messageText = it },
                    label = { Text("Prefilled Support Message") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                Button(
                    onClick = { viewModel.updateWhatsAppDetails(numberText, messageText) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = WhatsAppGreen),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Save WhatsApp Details", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }
        }

        // About & Legal Compliance
        GlassPanel(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "ABOUT & LEGAL TERMS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = MetallicMuted,
                    letterSpacing = 1.sp
                )

                Text(
                    text = "SN Downloader (Shani Noumi Downloader) v2.4.0",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = MetallicSilver
                )

                Text(
                    text = "SN Downloader strictly enforces platform copyright policies and DRM protection. Only public content with clean feed distribution is permitted for download. Do not download copyrighted media without creator authorization.",
                    fontSize = 11.sp,
                    color = MetallicMuted,
                    lineHeight = 16.sp
                )
            }
        }
    }
}
