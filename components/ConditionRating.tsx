import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ConditionRating as ConditionType } from '../types/album';

const CONDITIONS: ConditionType[] = ['M', 'NM', 'VG+', 'VG', 'G+', 'G', 'F', 'P'];

interface Props {
  value: ConditionType;
  onChange: (value: ConditionType) => void;
  label: string;
}

export default function ConditionRating({ value, onChange, label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.ratingsContainer}>
        {CONDITIONS.map((condition) => (
          <TouchableOpacity
            key={condition}
            style={[
              styles.ratingButton,
              condition === value && styles.selectedRating,
            ]}
            onPress={() => onChange(condition)}
          >
            <Text style={[
              styles.ratingText,
              condition === value && styles.selectedRatingText,
            ]}>
              {condition}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectedRating: {
    backgroundColor: '#007AFF',
  },
  ratingText: {
    color: '#007AFF',
    fontSize: 14,
  },
  selectedRatingText: {
    color: 'white',
  },
});
