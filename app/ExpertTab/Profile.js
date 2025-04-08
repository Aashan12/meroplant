import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; // For icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing/retrieving phone number
import { BASE_URL } from '../config';

export default function Profile() {
  const [kycStatus, setKycStatus] = useState('Pending'); // Default KYC status
  const [isLoading, setIsLoading] = useState(false); // Loading state for verification check
  const router = useRouter();
  const { mobile: paramMobile } = useLocalSearchParams(); // Get the phone number from navigation params
  const [mobile, setMobile] = useState(null); // State to store the phone number

  // Retrieve the phone number from Async Storage on component mount
  useEffect(() => {
    const getMobile = async () => {
      const storedMobile = await AsyncStorage.getItem('mobile');
      if (storedMobile) {
        setMobile(storedMobile);
      } else if (paramMobile) {
        setMobile(paramMobile);
      }
    };

    getMobile();
  }, [paramMobile]);

  // Check KYC status when the phone number is available
  useEffect(() => {
    if (mobile) {
      checkKYCStatus();
    }
  }, [mobile]);

  // Function to check KYC status
  const checkKYCStatus = async () => {
    setIsLoading(true); // Start loading

    try {
      // Call the backend to check if the phone number is verified
      const response = await fetch( `${BASE_URL}/check-verified-expert/${mobile}`);
      const result = await response.json();

      console.log('Backend Response:', result); // Debugging: Log the response

      if (result.success === true) {
        // If verified, update the KYC status
        setKycStatus('Verified');
      } else {
        // If not verified, keep the status as "Pending"
        setKycStatus('Pending');
      }
    } catch (error) {
      console.error('Error during KYC check:', error);
      Alert.alert('Error', 'Failed to check KYC status. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Navigation handlers
  const handleHomePress = () => {
    try {
      router.push('/ExpertTab/Index'); // Navigate to Home
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to the home screen.');
    }
  };

  const handleProfilePress = () => {
    try {
      router.push('/ExpertTab/Profile'); // Navigate to Profile
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to the profile screen.');
    }
  };

  const handlePostsPress = () => {
    try {
      router.push('/ExpertTab/Post'); // Navigate to Posts
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Unable to navigate to the posts screen.');
    }
  };

  return (
    <LinearGradient
      colors={['#f5f7f6', '#e6f3e9']} // Subtle gradient background
      style={styles.container}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={require('../../assets/images/profile.jpg')} // Add a profile picture
          style={styles.profileImage}
        />
        <Text style={styles.title}>Expert Profile</Text>
      </View>

      {/* Qualifications Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="school" size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>Qualifications</Text>
        </View>
        <Text style={styles.sectionContent}>
          - Plant Pathologist
          {'\n'}- Certified in Agricultural Sciences
          {'\n'}- 10+ years of experience
        </Text>
      </View>

      {/* KYC Status Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="id-card" size={24} color="#4CAF50" />
          <Text style={styles.sectionTitle}>KYC Status</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="small" color="#4CAF50" /> // Show loader while checking KYC status
        ) : (
          <View
            style={[
              styles.kycStatusContainer,
              kycStatus === 'Verified' ? styles.verified : styles.pending,
            ]}
          >
            <Text style={styles.kycStatusText}>{kycStatus}</Text>
          </View>
        )}
      </View>

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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 80, // Add padding to avoid overlap with the nav bar
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f441e',
  },
  sectionCard: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#4CAF50',
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  kycStatusContainer: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  kycStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pending: {
    backgroundColor: '#ffeb3b',
  },
  verified: {
    backgroundColor: '#4CAF50',
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