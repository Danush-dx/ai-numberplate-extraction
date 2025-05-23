import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PlateHistoryItem from '../components/PlateHistoryItem';
import { getLicensePlates, deleteLicensePlate, clearLicensePlates } from '../utils/storage';

const HistoryScreen = () => {
  const [licensePlates, setLicensePlates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load license plates from storage
  const loadLicensePlates = async () => {
    try {
      setIsLoading(true);
      const plates = await getLicensePlates();
      setLicensePlates(plates);
    } catch (error) {
      console.error('Error loading license plates:', error);
      Alert.alert('Error', 'Failed to load license plate history.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadLicensePlates();
    }, [])
  );
  
  // Handle deleting a plate
  const handleDeletePlate = async (id) => {
    try {
      await deleteLicensePlate(id);
      // Refresh list
      setLicensePlates(prevPlates => prevPlates.filter(plate => plate.id !== id));
    } catch (error) {
      console.error('Error deleting license plate:', error);
      Alert.alert('Error', 'Failed to delete license plate.');
    }
  };
  
  // Handle clear all history
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all license plate history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearLicensePlates();
              setLicensePlates([]);
            } catch (error) {
              console.error('Error clearing license plates:', error);
              Alert.alert('Error', 'Failed to clear license plate history.');
            }
          },
        },
      ]
    );
  };
  
  // Render empty state
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No license plates saved yet.</Text>
      <Text style={styles.emptySubText}>
        Scanned plates will appear here.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan History</Text>
        {licensePlates.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClearHistory}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={licensePlates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlateHistoryItem 
            item={item} 
            onDelete={handleDeletePlate} 
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          licensePlates.length === 0 && styles.emptyListContent
        ]}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  emptyListContent: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HistoryScreen; 