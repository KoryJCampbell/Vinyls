import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from "react-native";
import { Link } from "expo-router";
import { getAlbums } from '../utils/storage';
import { vinylEvents } from '../utils/events';

export type Album = {
  id: number;
  title: string;
  artist: string;
  year: number;
  coverImage?: string;
};

export default function Index() {
  const [vinyls, setVinyls] = useState<Album[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'year'>('title');

  useEffect(() => {
    loadVinyls();
    
    // Subscribe to vinyl events
    const unsubscribe = vinylEvents.subscribe(loadVinyls);
    
    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const loadVinyls = async () => {
    try {
      const albums = await getAlbums();
      setVinyls(albums);
    } catch (error) {
      console.error('Error loading albums:', error);
    }
  };

  const filteredAndSortedVinyls = vinyls
    .filter(vinyl => 
      vinyl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vinyl.artist.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'year':
          return (b.year || 0) - (a.year || 0);
      }
    });

  const renderVinylItem = ({ item }: { item: Album }) => (
    <Link 
      href={{ 
        pathname: "/details", 
        params: { 
          id: item.id,
          title: item.title,
          artist: item.artist
        } 
      }} 
      asChild
    >
      <TouchableOpacity style={styles.vinylItem}>
        <View style={styles.vinylInfo}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.artist}>{item.artist}</Text>
          {item.year > 0 && <Text style={styles.year}>{item.year}</Text>}
        </View>
        {item.coverImage && (
          <Image source={{ uri: item.coverImage }} style={styles.albumCover} />
        )}
      </TouchableOpacity>
    </Link>
  );

  const SortButton = ({ sort, label }: { sort: typeof sortBy, label: string }) => (
    <TouchableOpacity 
      style={[styles.sortButton, sortBy === sort && styles.sortButtonActive]}
      onPress={() => setSortBy(sort)}
    >
      <Text style={[styles.sortButtonText, sortBy === sort && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search albums..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.sortContainer}>
        <SortButton sort="title" label="Title" />
        <SortButton sort="artist" label="Artist" />
        <SortButton sort="year" label="Year" />
      </View>
      <FlatList
        data={filteredAndSortedVinyls}
        renderItem={renderVinylItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <View style={styles.buttonContainer}>
        <Link href="/stats" asChild>
          <TouchableOpacity style={styles.statsButton}>
            <Text style={styles.buttonText}>Statistics</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>Add New Vinyl</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  vinylItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16, // Add space between text and image
  },
  vinylInfo: {
    flex: 1,
    marginRight: 8, // Add some spacing before the image
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 16,
    color: '#666',
  },
  year: {
    fontSize: 14,
    color: '#888',
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#f0f0f0', // Add a background color for loading state
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  sortButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    color: '#007AFF',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    margin: 16,
  },
  statsButton: {
    flex: 1,
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
