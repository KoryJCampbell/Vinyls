import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SearchResult, searchSpecificRelease } from '../utils/discogs';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (releaseId: number) => void;
  title?: string;
  artist?: string;
}

export default function ReleaseSearchModal({ visible, onClose, onSelect, title, artist }: Props) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && (title || artist)) {
      searchReleases();
    }
  }, [visible, title, artist]);

  const searchReleases = async () => {
    if (!title && !artist) return;
    
    setLoading(true);
    try {
      const searchResults = await searchSpecificRelease(artist || '', title || '');
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity 
      style={styles.resultItem} 
      onPress={() => onSelect(item.id)}
    >
      <Text style={styles.resultTitle}>{item.title}</Text>
      <Text style={styles.resultDetails}>
        {item.year} • {item.country} • {item.format.join(', ')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Release</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loading} />
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No releases found</Text>
            }
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultDetails: {
    fontSize: 14,
    color: '#666',
  },
  loading: {
    flex: 1,
    alignSelf: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
    color: '#666',
  },
});
