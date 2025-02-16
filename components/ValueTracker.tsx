import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { PurchaseInfo } from '../types/album';

interface Props {
  value: PurchaseInfo;
  onChange: (value: PurchaseInfo) => void;
}

export default function ValueTracker({ value, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange({
      ...tempValue,
      lastUpdated: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <TouchableOpacity 
        style={styles.container} 
        onPress={() => setIsEditing(true)}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Purchase Price:</Text>
          <Text style={styles.value}>${value.price.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Current Value:</Text>
          <Text style={styles.value}>${value.marketValue?.toFixed(2) || 'N/A'}</Text>
        </View>
        <Text style={styles.date}>
          Last updated: {new Date(value.lastUpdated || value.date).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Purchase Price:</Text>
        <TextInput
          style={styles.input}
          value={tempValue.price.toString()}
          onChangeText={(text) => setTempValue({...tempValue, price: parseFloat(text) || 0})}
          keyboardType="decimal-pad"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Current Value:</Text>
        <TextInput
          style={styles.input}
          value={tempValue.marketValue?.toString() || ''}
          onChangeText={(text) => setTempValue({...tempValue, marketValue: parseFloat(text) || 0})}
          keyboardType="decimal-pad"
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 4,
    width: 100,
    textAlign: 'right',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
