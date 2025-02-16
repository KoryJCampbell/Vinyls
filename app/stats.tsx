import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAlbums, Album } from '../utils/storage';

export default function Stats() {
  const [stats, setStats] = useState({
    totalAlbums: 0,
    byDecade: {} as Record<string, number>,
    topArtists: [] as { artist: string, count: number }[],
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
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

    setStats({
      totalAlbums: albums.length,
      byDecade,
      topArtists,
    });
  };

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
});
