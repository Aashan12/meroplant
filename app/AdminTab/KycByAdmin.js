import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { BASE_URL } from './BackendUrl';
import { useRouter } from 'expo-router'; // Import useRouter

export default function AdminKYCPanel() {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { width } = Dimensions.get('window');
  const isLaptop = width >= 768;
  const router = useRouter(); // Use useRouter instead of useNavigation

  useEffect(() => {
    fetchKYCData();
  }, []);

  const fetchKYCData = async () => {
    console.log('Fetching KYC data from:', BASE_URL);
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/kyc-verifications`);
      if (response.data.success) {
        setKycData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load KYC data.');
    } finally {
      setLoading(false);
    }
  };

  const handleKYCAction = async (id, action) => {
    console.log('Handling KYC action:', action, 'for ID:', id);
    setUpdating(id);
    try {
      const response = await axios.patch(
        `${BASE_URL}/kyc-verification/${id}`,
        { status: action },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('API Response:', response.data);
      if (response.data.success) {
        Alert.alert('Success', `KYC ${action} successfully!`);
        setKycData((prev) => prev.filter((kyc) => kyc._id !== id));
      }
    } catch (error) {
      console.error(`Error ${action} KYC:`, error.response?.data || error.message);
      Alert.alert('Error', `Failed to ${action} KYC.`);
    } finally {
      console.log('Resetting updating state for ID:', id, 'to null');
      setUpdating(null);
    }
  };

  const openImage = (uri) => {
    console.log('Opening image:', uri);
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const renderKYCCard = ({ item }) => (
    <Animatable.View animation="fadeInUp" style={[styles.card, isLaptop && styles.cardLaptop]}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.status, { color: item.status === 'Accepted' ? '#4CAF50' : item.status === 'Rejected' ? '#F44336' : '#888' }]}>
          {item.status || 'Pending'}
        </Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.detailText}><MaterialIcons name="phone" size={16} color="#4CAF50" /> {item.contact}</Text>
        <Text style={styles.detailText}><MaterialIcons name="email" size={16} color="#4CAF50" /> {item.email}</Text>
        <Text style={styles.detailText}><MaterialIcons name="location-on" size={16} color="#4CAF50" /> {item.address}</Text>
        <Text style={styles.detailText}><MaterialIcons name="school" size={16} color="#4CAF50" /> {item.specialization}</Text>
      </View>
      <View style={styles.imageSection}>
        <Text style={styles.imageLabel}>National ID:</Text>
        <Pressable onPress={() => openImage(`${BASE_URL}/${item.nationalId}`)}>
          <Image source={{ uri: `${BASE_URL}/${item.nationalId}` }} style={[styles.image, isLaptop && styles.imageLaptop]} resizeMode="contain" />
        </Pressable>
        <Text style={styles.imageLabel}>Degree Certificate:</Text>
        <Pressable onPress={() => openImage(`${BASE_URL}/${item.degreeCertificate}`)}>
          <Image source={{ uri: `${BASE_URL}/${item.degreeCertificate}` }} style={[styles.image, isLaptop && styles.imageLaptop]} resizeMode="contain" />
        </Pressable>
      </View>
      {item.status !== 'Accepted' && item.status !== 'Rejected' && (
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.acceptButton, updating === item._id && styles.disabledButton]}
            onPress={() => {
              console.log('Accept button pressed for ID:', item._id, 'Updating state:', updating);
              handleKYCAction(item._id, 'Accepted');
            }}
            disabled={updating === item._id}
          >
            {updating === item._id ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Accept</Text>}
          </Pressable>
          <Pressable
            style={[styles.button, styles.rejectButton, updating === item._id && styles.disabledButton]}
            onPress={() => {
              console.log('Reject button pressed for ID:', item._id, 'Updating state:', updating);
              handleKYCAction(item._id, 'Rejected');
            }}
            disabled={updating === item._id}
          >
            {updating === item._id ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reject</Text>}
          </Pressable>
        </View>
      )}
    </Animatable.View>
  );

  return (
    <LinearGradient colors={['#f0f4f8', '#d9e7ff']} style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            console.log('Back button pressed, navigating to Home');
            router.push('./Home'); // Use router.push instead of navigation.navigate
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1f2a44" />
        </Pressable>
        <Text style={[styles.title, isLaptop && styles.titleLaptop]}>Admin KYC Dashboard</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loading} />
      ) : (
        <FlatList
          data={kycData}
          renderItem={renderKYCCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[styles.listContainer, isLaptop && styles.listContainerLaptop]}
          ListEmptyComponent={<Text style={styles.emptyText}>No KYC submissions available.</Text>}
        />
      )}
      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <MaterialIcons name="close" size={30} color="#fff" />
          </Pressable>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />}
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
    zIndex: 150, // Ensure back button is clickable
  },
  listContainer: {
    padding: 15,
  },
  listContainerLaptop: {
    paddingHorizontal: '15%',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2a44',
    textAlign: 'center',
    flex: 1,
  },
  titleLaptop: {
    fontSize: 34,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardLaptop: {
    padding: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2a44',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
  },
  details: {
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageLaptop: {
    height: 250,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
    pointerEvents: 'auto',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 200,
  },
});