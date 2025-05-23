import React, { useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, SafeAreaView, Platform, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CameraView from '../components/CameraView';
import { extractLicensePlate } from '../api/geminiApi';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCapture = async (imageUri) => {
    if (isProcessing) return;
    
    try {
      console.log('Image captured:', imageUri);
      setIsProcessing(true);
      
      // Convert image to base64
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            console.log('Image converted to base64');
            // Get base64 data
            const base64data = reader.result.split(',')[1];
            
            // Process with Gemini API
            console.log('Sending to Gemini API');
            const plateNumber = await extractLicensePlate(base64data);
            console.log('Plate number detected:', plateNumber);
            
            // Navigate to result screen
            navigation.navigate('Result', {
              plateNumber,
              imageUri,
            });
            
            resolve();
          } catch (error) {
            console.error('Error processing image:', error);
            Alert.alert('Error', 'Failed to process image: ' + error.message);
            reject(error);
          } finally {
            setIsProcessing(false);
          }
        };
        
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          setIsProcessing(false);
          reject(error);
        };
        
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Error handling image capture:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const handleCameraError = (errorMessage) => {
    console.error('Camera error:', errorMessage);
    Alert.alert('Camera Error', errorMessage);
  };

  const navigateToHistory = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView 
        onCapture={handleImageCapture}
        onError={handleCameraError}
      />
      
      <TouchableOpacity 
        style={styles.historyButton} 
        onPress={navigateToHistory}
      >
        <Text style={styles.historyButtonText}>View History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  historyButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen; 