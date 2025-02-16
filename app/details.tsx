import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getAlbumById } from '../utils/storage';
import { colors, sharedStyles } from '../utils/styles';
import type { Album } from '../types';

export default function Details() {
  const { id } = useLocalSearchParams();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    loadAlbum();
  }, [id]);

  const loadAlbum = async () => {
    if (id) {
      const albumData = await getAlbumById(Number(id));
      setAlbum(albumData);
    }
  };

  const openSpotify = async () => {
    if (album?.spotifyUrl) {
      await Linking.openURL(album.spotifyUrl);
    }
  };

  if (!album) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {album.coverImage && (
        <Image 
          source={{ uri: album.coverImage }} 
          style={styles.coverImage}
        />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{album.title}</Text>
        <Text style={styles.artist}>{album.artist}</Text>
        
        {album.year > 0 && (
          <Text style={styles.year}>{album.year}</Text>
        )}

        {album.genres && album.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.genreContainer}>
              {album.genres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {album.label && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Label</Text>
            <Text style={styles.sectionContent}>{album.label}</Text>
          </View>
        )}

        {album.releaseDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Release Date</Text>
            <Text style={styles.sectionContent}>
              {new Date(album.releaseDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {album.tracklist && album.tracklist.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tracklist</Text>
            {album.tracklist.map((track, index) => (
              <View key={index} style={styles.trackItem}>
                <Text style={styles.trackPosition}>{track.position}.</Text>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackDuration}>{track.duration}</Text>
              </View>
            ))}
          </View>
        )}

        {album.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{album.notes}</Text>
          </View>
        )}

        {album.spotifyUrl && (
          <TouchableOpacity 
            style={styles.spotifyButton}
            onPress={openSpotify}
          >
            <Text style={styles.spotifyButtonText}>
              Open in Spotify
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.metaSection}>
          <Text style={styles.metaText}>
            Added on {new Date(album.dateAdded).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  coverImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artist: {
    fontSize: 20,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  year: {
    fontSize: 18,
    color: colors.text.tertiary,
    marginBottom: 16,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: colors.text.primary,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  trackPosition: {
    width: 30,
    fontSize: 14,
    color: colors.text.secondary,
  },
  trackTitle: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
  },
  trackDuration: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  notes: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  spotifyButton: {
    backgroundColor: colors.spotify,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  spotifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  metaSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

