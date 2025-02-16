# Vinyls - Your Digital Vinyl Collection Manager

Vinyls is a mobile application built with React Native and Expo that helps you manage and track your vinyl record collection. With integrations to both Spotify and Discogs, it provides a comprehensive solution for vinyl enthusiasts.

## Features

- **Multiple Input Methods**
  - Barcode scanning for quick album lookups
  - Spotify integration for accurate metadata
  - Manual entry with customizable fields
  - Discogs database integration

- **Rich Album Information**
  - Cover artwork
  - Track listings
  - Release information
  - Genre tags
  - Record label details
  - Direct Spotify links

- **Collection Management**
  - Search and filter your collection
  - Sort by title, artist, or year
  - View detailed album statistics
  - Track your collection's growth

- **Statistics Dashboard**
  - Total albums count
  - Distribution by decade
  - Top artists in your collection
  - Collection timeline

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vinyls.git
cd vinyls
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
DISCOGS_API_KEY=your_discogs_api_key
```

4. Start the development server:
```bash
npx expo start
```

### Running the App

- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your device

## Project Structure

```
/app                 # Expo Router pages
  ├── index.tsx      # Home screen
  ├── add.tsx        # Add vinyl screen
  ├── details.tsx    # Album details screen
  └── stats.tsx      # Statistics screen
/components          # Reusable React components
/utils               # Utility functions and API clients
/types              # TypeScript type definitions
```

## Tech Stack

- React Native
- Expo
- TypeScript
- AsyncStorage (local data persistence)
- Spotify Web API
- Discogs API
- Expo Router (navigation)
- Expo Camera (barcode scanning)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spotify Web API for music metadata
- Discogs API for vinyl database
- Expo team for the amazing development tools
