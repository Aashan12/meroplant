import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const plants = [
  'Potato', 'Tomato', 'Pepper', 'Cucumber', 'Pumpkin', 'Carrot', 'Lettuce', 'Spinach',
  'Broccoli', 'Cauliflower', 'Eggplant', 'Zucchini', 'Radish', 'Beetroot', 'Onion',
  'Garlic', 'Cabbage', 'Kale', 'Celery', 'Parsley',
];

const PostModal = ({ isVisible }) => {
  const router = useRouter();
  const { mobile: paramMobile } = useLocalSearchParams();
  const [mobile, setMobile] = useState(null);

  useEffect(() => {
    const getMobile = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('mobile');
        if (storedMobile) {
          setMobile(storedMobile);
        } else if (paramMobile) {
          setMobile(paramMobile);
        }
      } catch (error) {
        console.error('Error retrieving mobile from AsyncStorage:', error);
      }
    };

    getMobile();
  }, [paramMobile]);

  const [images, setImages] = useState([]);
  const [healthStatus, setHealthStatus] = useState('healthy');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');
  const [showPlantList, setShowPlantList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pickImages = async (sourceType) => {
    try {
      let result;
      if (sourceType === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
      console.error('ImagePicker error:', error);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!mobile) {
      Alert.alert('Error', 'Phone number is not available. Please log in again.');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
      return;
    }

    if (!selectedPlant) {
      Alert.alert('Error', 'Please select a plant');
      return;
    }

    const formData = new FormData();
    formData.append('phone_number', mobile);
    formData.append('plant_name', selectedPlant);
    formData.append('health_status', healthStatus);
    formData.append('description', description);
    if (healthStatus === 'infected') {
      formData.append('solution', solution);
    }

    images.forEach((uri, index) => {
      formData.append('images', {
        uri,
        name: `image_${index}.jpg`,
        type: 'image/jpeg',
      });
    });

    try {
      console.log('Sending request to:', `${BASE_URL}/save-post`);
      const response = await fetch(`${BASE_URL}/save-post`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response body:', result);

      if (response.ok && result.success) {
        Alert.alert('Success', 'Post saved successfully!');
        handleReset();
      } else {
        Alert.alert('Error', result.detail || 'Failed to save post.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to save post. Please check your network or server.');
    }
  };

  const handleReset = () => {
    setImages([]);
    setHealthStatus('healthy');
    setDescription('');
    setSolution('');
    setSelectedPlant('');
    router.push('/ExpertTab/Index'); // Navigate back after resetting
  };

  const handleBackPress = () => {
    router.push('/ExpertTab/Index'); // Always navigate back
  };

  const filteredPlants = plants.filter((plant) =>
    plant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#4CAF50" />
          </Pressable>
          <Text style={styles.title}>Create Post</Text>
        </View>

        <Pressable style={styles.plantSelector} onPress={() => setShowPlantList(true)}>
          <Text style={selectedPlant ? styles.plantSelectedText : styles.plantPlaceholderText}>
            {selectedPlant || 'Select a plant'}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#4CAF50" />
        </Pressable>

        <Modal visible={showPlantList} animationType="slide" transparent={false}>
          <View style={styles.plantListContainer}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search plants..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Pressable onPress={() => setShowPlantList(false)}>
                <MaterialIcons name="close" size={24} color="#4CAF50" />
              </Pressable>
            </View>
            <ScrollView>
              {filteredPlants.map((plant, index) => (
                <Pressable
                  key={index}
                  style={styles.plantItem}
                  onPress={() => {
                    setSelectedPlant(plant);
                    setShowPlantList(false);
                  }}
                >
                  <Text style={styles.plantText}>{plant}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Modal>

        <View style={styles.imageSection}>
          {images.length > 0 ? (
            <ScrollView horizontal style={styles.imageScroll}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.selectedImage} />
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <MaterialIcons name="close" size={20} color="white" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>No images selected</Text>
            </View>
          )}

          <View style={styles.imageButtons}>
            <Pressable style={styles.button} onPress={() => pickImages('camera')}>
              <MaterialIcons name="camera-alt" size={24} color="white" />
              <Text style={styles.buttonText}>Camera</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => pickImages('gallery')}>
              <MaterialIcons name="photo-library" size={24} color="white" />
              <Text style={styles.buttonText}>Gallery</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Plant Health Status</Text>
          <View style={styles.statusButtons}>
            <Pressable
              style={[
                styles.statusButton,
                healthStatus === 'healthy' && styles.statusButtonActive,
              ]}
              onPress={() => setHealthStatus('healthy')}
            >
              <Text style={styles.statusButtonText}>Healthy</Text>
            </Pressable>
            <Pressable
              style={[
                styles.statusButton,
                healthStatus === 'infected' && styles.statusButtonActive,
              ]}
              onPress={() => setHealthStatus('infected')}
            >
              <Text style={styles.statusButtonText}>Infected</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholder={
              healthStatus === 'healthy'
                ? 'Describe your healthy plant...'
                : 'Describe the infection/issue...'
            }
          />

          {healthStatus === 'infected' && (
            <>
              <Text style={styles.sectionTitle}>Suggested Solution</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={solution}
                onChangeText={setSolution}
                placeholder="Suggest a solution..."
              />
            </>
          )}
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Share Post</Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#1f441e',
  },
  plantSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  plantSelectedText: {
    fontSize: 16,
    color: '#1f441e',
  },
  plantPlaceholderText: {
    fontSize: 16,
    color: '#ccc',
  },
  plantListContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  plantItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  plantText: {
    fontSize: 16,
    color: '#1f441e',
  },
  imageSection: {
    padding: 16,
  },
  imageScroll: {
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 2,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  statusSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f441e',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  inputSection: {
    padding: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostModal;