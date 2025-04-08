import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { BASE_URL } from '../config';

export default function KYCVerification() {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+977'); // Default country code for Nepal
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [nationalId, setNationalId] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Function to pick an image (full by default)
  const pickImage = async (setImage) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow access to your gallery to upload documents.',
          [
            {
              text: 'OK',
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // No cropping by default to get full image
        quality: 1, // Maximum quality
        base64: false,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Set full image URI
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  // Function to pick and crop an image (for re-cropping)
  const cropImage = async (setImage) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow access to your gallery to crop documents.',
          [
            {
              text: 'OK',
              onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync(),
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Enable cropping
        aspect: undefined, // No forced aspect ratio (freeform cropping)
        quality: 1,
        base64: false,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri); // Set cropped image URI
      }
    } catch (error) {
      console.error('Error cropping image:', error);
      Alert.alert('Error', 'An error occurred while cropping the image.');
    }
  };

  // Handle KYC submission to FastAPI backend
  const handleUploadDocuments = async () => {
    if (!name || !contact || !email || !address || !specialization || !nationalId || !degreeCertificate) {
      Alert.alert('Error', 'Please fill all fields and upload required documents.');
      return;
    }

    if (!/^\d{10}$/.test(contact)) {
      Alert.alert('Error', 'Contact number must be exactly 10 digits.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('contact', `${countryCode}${contact}`);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('specialization', specialization);
      formData.append('nationalId', {
        uri: nationalId,
        type: 'image/jpeg',
        name: 'national_id.jpg',
      });
      formData.append('degreeCertificate', {
        uri: degreeCertificate,
        type: 'image/jpeg',
        name: 'degree_certificate.jpg',
      });

      const response = await axios.post(
        `${BASE_URL}/kyc-verification`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Your KYC has been submitted successfully!');
        setName('');
        setCountryCode('+977');
        setContact('');
        setEmail('');
        setAddress('');
        setSpecialization('');
        setNationalId(null);
        setDegreeCertificate(null);
      }
    } catch (error) {
      console.error('Error submitting KYC:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to submit KYC. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleHomePress = () => router.push('/ExpertTab/Index');
  const handleProfilePress = () => router.push('/ExpertTab/Profile');
  const handlePostsPress = () => router.push('/ExpertTab/Post');

  return (
    <LinearGradient colors={['#f5f7f6', '#e6f3e9']} style={styles.container}>
      <Text style={styles.title}>KYC Verification</Text>

      {/* KYC Form */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInUp" style={styles.formCard}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#4CAF50" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Contact Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="phone" size={24} color="#4CAF50" />
            <View style={styles.contactContainer}>
              <Picker
                selectedValue={countryCode}
                style={styles.countryCodePicker}
                onValueChange={(itemValue) => setCountryCode(itemValue)}
              >
                <Picker.Item label="+977 (Nepal)" value="+977" />
                <Picker.Item label="+91 (India)" value="+91" />
                <Picker.Item label="+1 (USA)" value="+1" />
              </Picker>
              <TextInput
                style={[styles.input, styles.contactInput]}
                placeholder="Contact Number"
                placeholderTextColor="#888"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#4CAF50" />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={24} color="#4CAF50" />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#888"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* Specialization Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="school" size={24} color="#4CAF50" />
            <TextInput
              style={styles.input}
              placeholder="Specialization"
              placeholderTextColor="#888"
              value={specialization}
              onChangeText={setSpecialization}
            />
          </View>

          {/* National ID Upload */}
          <View style={styles.uploadContainer}>
            <Pressable style={styles.uploadButton} onPress={() => pickImage(setNationalId)}>
              <MaterialIcons name="upload" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>
                {nationalId ? 'Replace National ID' : 'Upload National ID'}
              </Text>
            </Pressable>
            {nationalId && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: nationalId }} style={styles.uploadedImage} />
                <Pressable
                  style={styles.cropButton}
                  onPress={() => cropImage(setNationalId)}
                >
                  <MaterialIcons name="crop" size={20} color="#fff" />
                  <Text style={styles.cropButtonText}>Crop</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Degree Certificate Upload */}
          <View style={styles.uploadContainer}>
            <Pressable style={styles.uploadButton} onPress={() => pickImage(setDegreeCertificate)}>
              <MaterialIcons name="upload" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>
                {degreeCertificate ? 'Replace Degree Certificate' : 'Upload Degree Certificate'}
              </Text>
            </Pressable>
            {degreeCertificate && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: degreeCertificate }} style={styles.uploadedImage} />
                <Pressable
                  style={styles.cropButton}
                  onPress={() => cropImage(setDegreeCertificate)}
                >
                  <MaterialIcons name="crop" size={20} color="#fff" />
                  <Text style={styles.cropButtonText}>Crop</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <Pressable
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleUploadDocuments}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit KYC</Text>
            )}
          </Pressable>
        </Animatable.View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable style={styles.navButton} onPress={handleHomePress}>
          <MaterialIcons name="home" size={24} color="#4CAF50" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={handleProfilePress}>
          <MaterialIcons name="person" size={24} color="#4CAF50" />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={handlePostsPress}>
          <MaterialIcons name="post-add" size={24} color="#4CAF50" />
          <Text style={styles.navText}>Posts</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f6',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    color: '#1f441e',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryCodePicker: {
    width: 120,
    height: 50,
  },
  contactInput: {
    flex: 1,
    marginLeft: 10,
  },
  uploadContainer: {
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: 200, // Increased height to better display transcripts
    borderRadius: 10,
    resizeMode: 'contain', // Ensure full image is visible
  },
  cropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cropButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#1f441e',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#888',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
});