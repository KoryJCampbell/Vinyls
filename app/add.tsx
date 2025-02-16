import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, FlatList, Image } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import { searchByBarcode, getReleaseDetails, transformDiscogsRelease } from "../utils/discogs";
import ReleaseSearchModal from "../components/ReleaseSearchModal";
import { saveAlbum } from '../utils/storage';
import { vinylEvents } from '../utils/events';
import { searchAlbum, SpotifyAlbum } from '../utils/spotify';

export default function AddVinyl() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBarcodeScan = async (barcode: string) => {
    setShowScanner(false);
    try {
      const results = await searchByBarcode(barcode);
      if (results.length > 0) {
        // Show release selection modal if we found matches
        setShowResults(true);
      } else {
        // No matches found, user needs to enter manually
        alert('No matching releases found for this barcode');
      }
    } catch (error) {
      console.error('Error searching by barcode:', error);
      alert('Failed to search by barcode');
    }
  };

  const handleReleaseSelect = async (releaseId: number) => {
    setShowResults(false);
    try {
      const releaseDetails = await getReleaseDetails(releaseId);
      const album = transformDiscogsRelease(releaseDetails);
      await saveAlbum(album);
      vinylEvents.notify(); // Notify listeners that a new album was added
      router.back(); // Return to the main screen after saving
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Failed to save album');
    }
  };

  const handleManualSubmit = async () => {
    if (!title || !artist) {
      alert('Please enter at least title and artist');
      return;
    }

    const parsedYear = year ? parseInt(year.trim(), 10) : null;
    if (year && (parsedYear === null || isNaN(parsedYear))) {
      alert('Please enter a valid year');
      return;
    }

    const album = {
      id: Date.now(), // Use timestamp as ID for manual entries
      title,
      artist,
      year: parsedYear || 0,
      genres: genre ? [genre] : [],
      dateAdded: new Date().toISOString(),
    };

    try {
      await saveAlbum(album);
      vinylEvents.notify(); // Notify listeners that a new album was added
      router.back();
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Failed to save album');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchAlbum(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    }
    setLoading(false);
  };

  const handleSelectAlbum = async (album: any) => {
    try {
      const newAlbum = {
        id: Date.now(),
        title: album.name,
        artist: album.artists[0].name,
        year: new Date(album.release_date).getFullYear(),
        coverImage: album.images[0]?.url,
        genres: album.genres || [],
        label: album.label,
        spotifyUrl: album.external_urls.spotify,
        releaseDate: album.release_date,
        dateAdded: new Date().toISOString(),
      };
      await saveAlbum(newAlbum);
      vinylEvents.notify();
      router.back();
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Failed to save album');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search on Spotify..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.resultItem}
            onPress={() => handleSelectAlbum(item)}
          >
            <Image 
              source={{ uri: item.images[0]?.url }} 
              style={styles.thumbnail}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>{item.name}</Text>
              <Text style={styles.resultArtist}>
                {item.artists.map(a => a.name).join(', ')}
              </Text>
              <Text style={styles.resultYear}>
                {new Date(item.release_date).getFullYear()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity 
        style={styles.scanButton} 
        onPress={() => setShowScanner(true)}
      >
        <Text style={styles.scanButtonText}>Scan Barcode</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>- or add manually -</Text>

      <TextInput
        style={styles.input}
        placeholder="Album Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        keyboardType="number-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={genre}
        onChangeText={setGenre}
      />
      <TouchableOpacity style={styles.button} onPress={handleManualSubmit}>
        <Text style={styles.buttonText}>Save Album</Text>
      </TouchableOpacity>

      <Modal visible={showScanner} animationType="slide">
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      </Modal>

      <ReleaseSearchModal
        visible={showResults}
        onClose={() => setShowResults(false)}
        onSelect={handleReleaseSelect}
        title={title}
        artist={artist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultArtist: {
    fontSize: 14,
    color: '#666',
  },
  resultYear: {
    fontSize: 12,
    color: '#999',
  },
});
