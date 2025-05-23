import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, Image, Alert } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import PropTypes from 'prop-types';

const CameraView = ({ onCapture, onError }) => {
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const handleTakePicture = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      console.log('Opening camera...');
      
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 1200,
        maxWidth: 1200,
        quality: 0.8,
        saveToPhotos: false,
      };
      
      launchCamera(options, (response) => {
        setLoading(false);
        
        console.log('Camera response:', response);
        
        if (response.didCancel) {
          console.log('User cancelled camera');
          return;
        }
        
        if (response.errorCode) {
          console.error('Camera error:', response.errorMessage);
          onError && onError(response.errorMessage || 'Camera error');
          
          if (response.errorCode === 'camera_unavailable') {
            Alert.alert('Camera Error', 'Camera is not available on this device');
          } else if (response.errorCode === 'permission') {
            setHasPermission(false);
          }
          return;
        }
        
        if (response.assets && response.assets[0] && response.assets[0].uri) {
          const imageUri = response.assets[0].uri;
          console.log('Image captured:', imageUri);
          setPreviewImage(imageUri);
          onCapture && onCapture(imageUri);
        } else {
          onError && onError('Failed to capture image');
        }
      });
    } catch (error) {
      setLoading(false);
      console.error('Error taking picture:', error);
      onError && onError('Failed to open camera. Please try again.');
    }
  };
  
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission denied.</Text>
        <Text style={styles.subText}>Please enable camera permissions in your device settings.</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {previewImage ? (
        <Image source={{ uri: previewImage }} style={styles.preview} />
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.text}>Tap the button below to take a photo</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleTakePicture}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={styles.captureButtonInner} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

CameraView.propTypes = {
  onCapture: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  preview: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    padding: 10,
  },
  subText: {
    color: '#999',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default CameraView; 