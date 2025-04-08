import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Image,
  Pressable,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from './BackendUrl';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

export default function VerifiedExpertView() {
  const [verifiedExperts, setVerifiedExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleting, setDeleting] = useState(null); // Track which expert is being deleted

  const { width } = Dimensions.get('window');
  const isLaptop = width >= 768;
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    fetchVerifiedExperts();
  }, []);

  const fetchVerifiedExperts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/verified-experts`);
      if (response.data.success) {
        setVerifiedExperts(response.data.data);
        setFilteredExperts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching verified experts:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load verified experts.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = verifiedExperts.filter(
        (expert) =>
          expert.name.toLowerCase().includes(query.toLowerCase()) ||
          expert.email.toLowerCase().includes(query.toLowerCase()) ||
          expert.contact.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExperts(filtered);
    } else {
      setFilteredExperts(verifiedExperts);
    }
  };

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleDeleteExpert = async (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this verified expert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(id);
            try {
              const response = await axios.delete(`${BASE_URL}/verified-expert/${id}`);
              if (response.data.success) {
                Alert.alert('Success', 'Expert deleted successfully!');
                setVerifiedExperts((prev) => prev.filter((expert) => expert._id !== id));
                setFilteredExperts((prev) => prev.filter((expert) => expert._id !== id));
              }
            } catch (error) {
              console.error('Error deleting expert:', error.response?.data || error.message);
              Alert.alert('Error', 'Failed to delete expert.');
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const renderExpertCard = ({ item }) => (
    <View style={[styles.expertCard, isLaptop && styles.expertCardLaptop]}>
      <View style={styles.cardHeader}>
        <Text style={styles.expertName}>{item.name}</Text>
        <Pressable
          onPress={() => handleDeleteExpert(item._id)}
          disabled={deleting === item._id}
          style={styles.deleteButton}
        >
          {deleting === item._id ? (
            <ActivityIndicator size="small" color="#F44336" />
          ) : (
            <MaterialIcons name="delete" size={20} color="#F44336" />
          )}
        </Pressable>
      </View>
      <Text style={styles.expertText}>Contact: {item.contact}</Text>
      <Text style={styles.expertText}>Email: {item.email}</Text>
      <Text style={styles.expertText}>Address: {item.address}</Text>
      <Text style={styles.expertText}>Specialization: {item.specialization}</Text>

      <Text style={styles.imageLabel}>National ID:</Text>
      <Pressable onPress={() => openImage(item.nationalId)}>
        <Image source={{ uri: item.nationalId }} style={[styles.kycImage, isLaptop && styles.kycImageLaptop]} resizeMode="contain" />
      </Pressable>

      <Text style={styles.imageLabel}>Degree Certificate:</Text>
      <Pressable onPress={() => openImage(item.degreeCertificate)}>
        <Image source={{ uri: item.degreeCertificate }} style={[styles.kycImage, isLaptop && styles.kycImageLaptop]} resizeMode="contain" />
      </Pressable>

      <Text style={styles.expertText}>Created At: {new Date(item.createdAt * 1000).toLocaleString()}</Text>
      <Text style={styles.expertText}>Updated At: {new Date(item.updatedAt * 1000).toLocaleString()}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#f5f7f6', '#e6f3e9']} style={styles.container}>
      {/* Back Button */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()} // Use router.back() to navigate back
      >
        <MaterialIcons name="arrow-back" size={24} color="#1f441e" />
      </Pressable>

      <Text style={[styles.title, isLaptop && styles.titleLaptop]}>Verified Expert List</Text>

      <TextInput
        style={[styles.searchInput, isLaptop && styles.searchInputLaptop]}
        placeholder="Search by name, email, or contact..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loading} />
      ) : (
        <FlatList
          data={filteredExperts}
          renderItem={renderExpertCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={[styles.scrollContainer, isLaptop && styles.scrollContainerLaptop]}
          ListEmptyComponent={<Text style={styles.emptyText}>No verified experts found.</Text>}
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    color: '#1f441e',
    textAlign: 'center',
  },
  titleLaptop: {
    fontSize: 32,
    marginTop: 50,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInputLaptop: {
    padding: 15,
    marginHorizontal: '15%',
    fontSize: 18,
  },
  scrollContainer: {
    padding: 20,
  },
  scrollContainerLaptop: {
    paddingHorizontal: '15%',
  },
  expertCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  expertCardLaptop: {
    padding: 25,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f441e',
  },
  expertText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
    marginBottom: 5,
  },
  kycImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  kycImageLaptop: {
    height: 250,
  },
  deleteButton: {
    padding: 5,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
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