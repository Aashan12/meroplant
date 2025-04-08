import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons'; // For the back button icon
import axios from 'axios';
import { BASE_URL } from './BackendUrl';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function ExpertView() {
  const [experts, setExperts] = useState([]); // State to store expert data
  const [loading, setLoading] = useState(true); // Loading state
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [filteredExperts, setFilteredExperts] = useState([]); // Filtered expert data

  const { width } = Dimensions.get('window');
  const isLaptop = width >= 768; // Check if the screen width is laptop size
  const router = useRouter(); // Initialize useRouter

  // Fetch expert data on component mount
  useEffect(() => {
    fetchExpertData();
  }, []);

  // Fetch expert data from the backend
  const fetchExpertData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/experts`);
      if (response.data.success) {
        setExperts(response.data.data);
        setFilteredExperts(response.data.data); // Initialize filtered data
      }
    } catch (error) {
      console.error('Error fetching expert data:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to load expert data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = experts.filter(
        (expert) =>
          expert.firstName.toLowerCase().includes(query.toLowerCase()) ||
          expert.lastName.toLowerCase().includes(query.toLowerCase()) ||
          expert.mobile.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExperts(filtered);
    } else {
      setFilteredExperts(experts); // Reset to all experts if search query is empty
    }
  };

  // Render each expert card
  const renderExpertCard = ({ item }) => (
    <View style={[styles.expertCard, isLaptop && styles.expertCardLaptop]}>
      <Text style={styles.expertName}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={styles.expertText}>Mobile: {item.mobile}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#f5f7f6', '#e6f3e9']} style={styles.container}>
      {/* Back Button */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()} // Navigate back using useRouter
      >
        <MaterialIcons name="arrow-back" size={24} color="#1f441e" />
      </Pressable>

      <Text style={[styles.title, isLaptop && styles.titleLaptop]}>Expert List</Text>

      {/* Search Bar */}
      <TextInput
        style={[styles.searchInput, isLaptop && styles.searchInputLaptop]}
        placeholder="Search by name or mobile..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loading} />
      ) : (
        <FlatList
          data={filteredExperts}
          renderItem={renderExpertCard}
          keyExtractor={(item) => item._id} // Use _id as the key
          contentContainerStyle={[styles.scrollContainer, isLaptop && styles.scrollContainerLaptop]}
          ListEmptyComponent={<Text style={styles.emptyText}>No experts found.</Text>}
        />
      )}
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginHorizontal: '15%',
  },
  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f441e',
    marginBottom: 10,
  },
  expertText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
  scrollContainer: {
    paddingBottom: 20,
  },
  scrollContainerLaptop: {
    paddingHorizontal: '15%',
  },
});