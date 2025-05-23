import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PlateResult from '../components/PlateResult';
import { saveLicensePlate } from '../utils/storage';

const ResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isSaving, setIsSaving] = useState(false);
  
  const { plateNumber, imageUri } = route.params || {};
  
  // Handle save to history
  const handleSave = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      // Validate that we have a plate number
      if (!plateNumber || plateNumber.trim() === '') {
        Alert.alert(
          'No License Plate',
          'No valid license plate was detected. Try again with a clearer image.',
          [{ text: 'OK' }]
        );
        setIsSaving(false);
        return;
      }
      
      // Save to storage
      await saveLicensePlate(plateNumber, imageUri);
      
      // Navigate to history
      navigation.navigate('History');
    } catch (error) {
      console.error('Error saving license plate:', error);
      Alert.alert('Error', 'Failed to save license plate. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle rescan
  const handleRescan = () => {
    navigation.navigate('Home');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PlateResult 
          plateNumber={plateNumber} 
          imageUri={imageUri} 
        />
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSave}
            disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save to History</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.rescanButton]} 
            onPress={handleRescan}>
            <Text style={styles.buttonText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#4a90e2',
  },
  rescanButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultScreen; 