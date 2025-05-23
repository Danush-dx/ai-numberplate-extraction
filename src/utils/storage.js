import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'LICENSE_PLATE_HISTORY';

/**
 * Get all license plate records from storage
 * @returns {Promise<Array>} Array of license plate objects
 */
export const getLicensePlates = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting license plates:', error);
    return [];
  }
};

/**
 * Save a new license plate record
 * @param {string} plateNumber - The extracted license plate number
 * @param {string} imageUri - URI to the captured image
 * @returns {Promise<Object>} The saved license plate object
 */
export const saveLicensePlate = async (plateNumber, imageUri) => {
  try {
    const licensePlates = await getLicensePlates();
    
    // Create new plate object
    const newPlate = {
      id: Date.now().toString(),
      plateNumber,
      imageUri,
      timestamp: Date.now()
    };
    
    // Add to existing records
    const updatedPlates = [newPlate, ...licensePlates];
    
    // Save to storage
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlates));
    
    return newPlate;
  } catch (error) {
    console.error('Error saving license plate:', error);
    throw error;
  }
};

/**
 * Delete a license plate record
 * @param {string} id - ID of the license plate to delete
 * @returns {Promise<void>}
 */
export const deleteLicensePlate = async (id) => {
  try {
    const licensePlates = await getLicensePlates();
    const updatedPlates = licensePlates.filter(plate => plate.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlates));
  } catch (error) {
    console.error('Error deleting license plate:', error);
    throw error;
  }
};

/**
 * Clear all license plate records
 * @returns {Promise<void>}
 */
export const clearLicensePlates = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing license plates:', error);
    throw error;
  }
}; 