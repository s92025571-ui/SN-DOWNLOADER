package com.shaninoumi.sndownloader.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.shaninoumi.sndownloader.ui.screens.DownloadsScreen
import com.shaninoumi.sndownloader.ui.screens.HomeScreen
import com.shaninoumi.sndownloader.ui.screens.SettingsScreen
import com.shaninoumi.sndownloader.ui.viewmodel.MainViewModel

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Downloads : Screen("downloads")
    object Settings : Screen("settings")
}

@Composable
fun NavGraph(
    navController: NavHostController,
    viewModel: MainViewModel,
    onOpenWhatsApp: (String, String) -> Unit
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                viewModel = viewModel,
                onOpenWhatsApp = onOpenWhatsApp,
                onNavigateToDownloads = { navController.navigate(Screen.Downloads.route) }
            )
        }
        composable(Screen.Downloads.route) {
            DownloadsScreen(
                viewModel = viewModel,
                onBack = { navController.popBackStack() }
            )
        }
        composable(Screen.Settings.route) {
            SettingsScreen(
                viewModel = viewModel
            )
        }
    }
}
