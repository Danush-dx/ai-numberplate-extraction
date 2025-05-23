import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const PlateHistoryItem = ({ item, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          {/* Image */}
          <View style={styles.imageContainer}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
          </View>
          
          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.plateNumber}>{item.plateNumber}</Text>
            <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
          </View>
          
          {/* Delete Button */}
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete && onDelete(item.id);
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" />
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          
          <View style={styles.modalContent}>
            {item.imageUri ? (
              <Image source={{ uri: item.imageUri }} style={styles.fullImage} resizeMode="contain" />
            ) : (
              <View style={styles.noImageFull}>
                <Text style={styles.noImageText}>No Image Available</Text>
              </View>
            )}
            
            <View style={styles.detailsContainer}>
              <Text style={styles.detailTitle}>License Plate</Text>
              <Text style={styles.detailPlateNumber}>{item.plateNumber}</Text>
              <Text style={styles.detailTimestamp}>Scanned on {formatDate(item.timestamp)}</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

PlateHistoryItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    plateNumber: PropTypes.string.isRequired,
    imageUri: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardContent: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth * 0.6, // Aspect ratio
    backgroundColor: '#f1f1f1',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImageText: {
    color: '#777',
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 16,
  },
  plateNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 16,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  fullImage: {
    width: '100%',
    height: '70%',
    borderRadius: 12,
  },
  noImageFull: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
  },
  detailsContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  detailPlateNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailTimestamp: {
    fontSize: 14,
    color: '#666',
  },
});

export default PlateHistoryItem; 