import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getAlbums, Album } from '../utils/storage';

const colors = {
  primary: '#007AFF',
  error: '#FF3B30'
};

export default function Stats() {
  const [stats, setStats] = useState({
    totalAlbums: 0,
    byDecade: {} as Record<string, number>,
    topArtists: [] as { artist: string, count: number }[],
    totalValue: 0,
    averageValue: 0,
    topValuedAlbums: [] as { title: string; artist: string; value: number }[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const albums = await getAlbums();
      
      // Calculate statistics
      const byDecade: Record<string, number> = {};
      const artistCounts: Record<string, number> = {};
      
      albums.forEach(album => {
        // Count by decade
        if (album.year) {
          const decade = `${Math.floor(album.year / 10) * 10}s`;
          byDecade[decade] = (byDecade[decade] || 0) + 1;
        }
        
        // Count by artist
        artistCounts[album.artist] = (artistCounts[album.artist] || 0) + 1;
      });

      const topArtists = Object.entries(artistCounts)
        .map(([artist, count]) => ({ artist, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate value statistics
      const albumsWithValue = albums.filter(album => album.purchaseInfo?.marketValue);
      const totalValue = albumsWithValue.reduce((sum, album) => 
        sum + (album.purchaseInfo?.marketValue || 0), 0);
      
      const topValuedAlbums = albums
        .filter(album => album.purchaseInfo?.marketValue)
        .sort((a, b) => (b.purchaseInfo?.marketValue || 0) - (a.purchaseInfo?.marketValue || 0))
        .slice(0, 5)
        .map(album => ({
          title: album.title,
          artist: album.artist,
          value: album.purchaseInfo?.marketValue || 0,
        }));

      setStats({
        totalAlbums: albums.length,
        byDecade,
        topArtists,
        totalValue,
        averageValue: albumsWithValue.length ? totalValue / albumsWithValue.length : 0,
        topValuedAlbums,
      });
    } catch (err) {
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Collection Statistics</Text>
      
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Total Albums</Text>
        <Text style={styles.statValue}>{stats.totalAlbums}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Albums by Decade</Text>
        {Object.entries(stats.byDecade).map(([decade, count]) => (
          <View key={decade} style={styles.statRow}>
            <Text style={styles.statLabel}>{decade}</Text>
            <Text style={styles.statValue}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Top Artists</Text>
        {stats.topArtists.map(({ artist, count }) => (
          <View key={artist} style={styles.statRow}>
            <Text style={styles.statLabel}>{artist}</Text>
            <Text style={styles.statValue}>{count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Collection Value</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Value</Text>
          <Text style={styles.statValue}>${stats.totalValue.toFixed(2)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Average Value</Text>
          <Text style={styles.statValue}>${stats.averageValue.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Most Valuable Albums</Text>
        {stats.topValuedAlbums.map((album, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={styles.statLabel}>{album.title} - {album.artist}</Text>
            <Text style={styles.statValue}>${album.value.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
