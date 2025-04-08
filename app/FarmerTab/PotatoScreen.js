import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { BASE_URL } from '../config';
const { width, height } = Dimensions.get('window');

const PotatoScreen = () => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera and media library permissions to use this feature.'
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setPrediction(null);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const pickImageFromCamera = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setPrediction(null);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const predictImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const fileExtension = selectedImage.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
      
      formData.append('file', {
        uri: selectedImage,
        type: mimeType,
        name: `image.${fileExtension}`
      });
            //baseurl
      const result = await axios.post(
        `${BASE_URL}/predict/`,
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: (data, headers) => {
            return formData;
          },
        }
      );

      setPrediction(result.data);
    } catch (error) {
      console.error('Error details:', error.response || error);
      Alert.alert(
        'Error',
        error.response?.data?.detail || 'Failed to predict the image. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <LinearGradient
      colors={['#2F855A', '#48BB78', '#68D391']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonHovered,
          ]}
          onPress={() => router.push('./PlantsScreen/Potato')}
        >
          <Ionicons name="arrow-back" size={30} color="#FFF" />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <FontAwesome5 name="leaf" size={24} color="#FFF" style={styles.headerIcon} />
          <Text style={styles.headerText}>Potato Health Scanner</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.card}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.image}
                resizeMode="cover"
              />
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  setSelectedImage(null);
                  setPrediction(null);
                }}
              >
                <MaterialIcons name="close" size={24} color="#FFF" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <MaterialIcons name="local-florist" size={60} color="#2F855A" />
              <Text style={styles.placeholderTitle}>Scan Your Plant</Text>
              <Text style={styles.placeholderText}>
                Take or upload a photo of your potato plant leaf for instant disease detection
              </Text>
            </View>
          )}

          {prediction && (
            <View style={styles.predictionContainer}>
              <View style={styles.resultHeader}>
                <MaterialIcons name="analytics" size={24} color="#2F855A" />
                <Text style={styles.resultTitle}>Analysis Results</Text>
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.predictionLabel}>Condition:</Text>
                <Text style={styles.predictionValue}>{prediction.predicted_class}</Text>
                <Text style={styles.predictionLabel}>Confidence Level:</Text>
                <Text style={styles.confidenceValue}>{prediction.confidence.toFixed(2)}%</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!selectedImage ? (
          <View style={styles.buttonRow}>
            <Animated.View style={[{ transform: [{ scale: buttonScale }] }, styles.buttonWrapper]}>
              <Pressable
                style={styles.actionButton}
                onPress={pickImageFromGallery}
                onPressIn={animateButton}
              >
                <MaterialIcons name="photo-library" size={32} color="#FFF" />
                <Text style={styles.buttonLabel}>Upload Photo</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={[{ transform: [{ scale: buttonScale }] }, styles.buttonWrapper]}>
              <Pressable
                style={styles.actionButton}
                onPress={pickImageFromCamera}
                onPressIn={animateButton}
              >
                <MaterialIcons name="add-a-photo" size={32} color="#FFF" />
                <Text style={styles.buttonLabel}>Take Photo</Text>
              </Pressable>
            </Animated.View>
          </View>
        ) : (
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              style={styles.predictButton}
              onPress={predictImage}
              onPressIn={animateButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="large" />
              ) : (
                <>
                  <MaterialIcons name="search" size={24} color="#FFF" />
                  <Text style={styles.predictButtonText}>Analyze Leaf</Text>
                </>
              )}
            </Pressable>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
    marginTop: 15,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#2F855A',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#2F855A',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionContainer: {
    marginTop: 20,
    backgroundColor: '#F0FFF4',
    borderRadius: 15,
    padding: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F855A',
    marginLeft: 10,
  },
  resultContent: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
  },
  predictionLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  predictionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F855A',
    marginBottom: 15,
  },
  confidenceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2F855A',
  },
  buttonContainer: {
    padding: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 0.48,
  },
  actionButton: {
    backgroundColor: '#2F855A',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  predictButton: {
    backgroundColor: '#2F855A',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  predictButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default PotatoScreen;