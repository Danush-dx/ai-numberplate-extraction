import { Platform, Alert, Linking } from 'react-native';
import { request, PERMISSIONS, RESULTS, check, openSettings } from 'react-native-permissions';
import { Camera } from 'react-native-vision-camera';

/**
 * Request camera permission using VisionCamera's direct method
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestCameraPermissionViaCameraLib = async () => {
  try {
    console.log('Requesting camera permission via Camera library');
    const cameraPermission = await Camera.requestCameraPermission();
    console.log('Camera permission result:', cameraPermission);
    return cameraPermission === 'granted';
  } catch (error) {
    console.error('Error requesting camera permission via Camera lib:', error);
    return false;
  }
};

/**
 * Request camera permission
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestCameraPermission = async () => {
  try {
    // First try using the Camera library's built-in permission request
    const cameraPermissionViaLib = await requestCameraPermissionViaCameraLib();
    if (cameraPermissionViaLib) {
      return true;
    }
    
    // Fall back to react-native-permissions if needed
    let permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.CAMERA 
      : PERMISSIONS.ANDROID.CAMERA;
    
    console.log('Requesting camera permission via react-native-permissions');
    const result = await request(permission);
    console.log('Permission result from react-native-permissions:', result);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Check camera permission status
 * @returns {Promise<boolean>} Whether permission is granted
 */
export const checkCameraPermission = async () => {
  try {
    // Try to check via Camera library first
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      console.log('Camera permission status from Camera lib:', cameraPermission);
      if (cameraPermission === 'granted') {
        return true;
      }
    } catch (error) {
      console.error('Error checking camera permission via Camera lib:', error);
    }
    
    // Fall back to react-native-permissions
    let permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.CAMERA 
      : PERMISSIONS.ANDROID.CAMERA;
    
    const result = await check(permission);
    console.log('Camera permission status from react-native-permissions:', result);
    return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
  } catch (error) {
    console.error('Error checking camera permission:', error);
    return false;
  }
};

/**
 * Request storage permission (for Android)
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') {
    return true; // iOS doesn't need explicit storage permission
  }
  
  try {
    let permission;
    
    if (Platform.Version >= 33) { // Android 13+
      permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    } else {
      permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    }
    
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  } catch (error) {
    console.error('Error requesting storage permission:', error);
    return false;
  }
};

/**
 * Request all required permissions
 * @returns {Promise<{camera: boolean, storage: boolean}>} Object with permission results
 */
export const requestAllPermissions = async () => {
  const camera = await requestCameraPermission();
  const storage = await requestStoragePermission();
  
  return { camera, storage };
};

/**
 * Open device settings
 * This can be used when permissions are denied and need to be changed in settings
 */
export const openAppSettings = async () => {
  try {
    await Linking.openSettings();
  } catch (error) {
    console.error('Error opening settings:', error);
    Alert.alert('Error', 'Could not open settings. Please open settings manually.');
  }
}; 