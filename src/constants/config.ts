// Application & Brand Constants
export const APP_CONFIG = {
  appName: 'SN Downloader',
  brandName: 'Shani Noumi Downloader',
  version: '2.4.0-Release',
  packageId: 'com.shaninoumi.sndownloader',
  developer: 'Shani Noumi',
  developerEmail: 'shaninomi228@gmail.com',

  // Configurable WhatsApp customer support contact
  // Supplied by owner: +923288501635
  defaultWhatsAppNumber: '+923288501635',
  defaultWhatsAppMessage: 'Assalam-o-Alaikum, mujhe SN Downloader app mein help chahiye.',

  // Generated High-Fidelity 3D Assets
  iconAsset: '/src/assets/images/sn_app_icon_1792667004201.jpg',
  logoAsset: '/src/assets/images/sn_3d_logo_badge_1792667004726.jpg',
  bannerAsset: '/src/assets/images/sn_feature_banner_1792667005689.jpg',

  // Supported Platforms
  platforms: [
    {
      id: 'tiktok',
      name: 'TikTok',
      color: '#00F2FE',
      accentColor: '#FE2C55',
      iconName: 'TikTok',
      domains: ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'],
      features: ['Watermark-Free HD', 'Original Audio MP3', 'Fast Parse'],
      supportedFormats: ['1080p Full HD', '720p HD', 'MP3 Audio'],
      legalNotice: 'Public posts only. Watermark-free available for clean authorized streams.',
      officialUrl: 'https://www.tiktok.com',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: '#E1306C',
      accentColor: '#833AB4',
      iconName: 'Instagram',
      domains: ['instagram.com', 'instagr.am'],
      features: ['Reels HD', 'Feed Videos', 'Audio Extract'],
      supportedFormats: ['1080p HD', '720p', 'Audio Only'],
      legalNotice: 'Respects creator rights. Private account content requires browser authorization.',
      officialUrl: 'https://www.instagram.com',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      color: '#FF0000',
      accentColor: '#CC0000',
      iconName: 'YouTube',
      domains: ['youtube.com', 'youtu.be', 'm.youtube.com'],
      features: ['Shorts', 'Up to 1080p', '320kbps Audio'],
      supportedFormats: ['1080p FHD', '720p HD', '480p SD', 'MP3 Audio'],
      legalNotice: 'DRM-protected & copyrighted music strictly governed by Terms of Service.',
      officialUrl: 'https://www.youtube.com',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      color: '#1877F2',
      accentColor: '#0C5DC7',
      iconName: 'Facebook',
      domains: ['facebook.com', 'fb.watch', 'fb.com', 'm.facebook.com'],
      features: ['Reels', 'Public Watch', 'HD Videos'],
      supportedFormats: ['HD 1080p', 'SD 480p', 'MP3'],
      legalNotice: 'Public videos supported. Private group content requires authentication.',
      officialUrl: 'https://www.facebook.com',
    },
  ],

  // Sample quick-test links for instant one-click demonstration
  sampleUrls: [
    {
      platform: 'tiktok',
      title: 'Trending Creative Animation Video',
      author: '@creative_motion',
      url: 'https://www.tiktok.com/@creative_motion/video/73829104819238491',
      directMediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      duration: '0:15',
    },
    {
      platform: 'instagram',
      title: 'Neon Cyberpunk City Drone Reel',
      author: '@night_cinematics',
      url: 'https://www.instagram.com/reel/C8jKlM2xP9q/',
      directMediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80',
      duration: '0:30',
    },
    {
      platform: 'youtube',
      title: '4K Ultra High Speed Drone Tech Demo',
      author: 'SpeedDrone Official',
      url: 'https://youtu.be/dQw4w9WgXcQ',
      directMediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
      duration: '1:45',
    },
    {
      platform: 'facebook',
      title: 'Viral Automotive Engineering Highlights',
      author: 'TurboMotors Global',
      url: 'https://fb.watch/tX89zQ21aB/',
      directMediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      duration: '0:48',
    },
  ],
};
