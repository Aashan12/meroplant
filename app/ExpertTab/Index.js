import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator, Animated, Easing } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { BASE_URL } from '../config';

const MenuIcon = ({ onPress }) => (
  <Pressable onPress={onPress} style={styles.menuIcon}>
    <MaterialIcons name="menu" size={30} color="#4CAF50" />
  </Pressable>
);

const Menu = ({ isVisible, onClose }) => {
  const router = useRouter();

  const handleKYC = () => {
    onClose();
    router.push('/ExpertTab/KYCVerification');
  };

  const handleMyPost = () => {
    onClose();
    router.push('/ExpertTab/MyPost'); // Navigate to MyPost.js
  };

  const showLogoutConfirmation = () => {
    Alert.alert(
      'Ready to Leave?',
      "You'll need to sign back in to access your crop information.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('mobile');
            router.replace('/Screens/Login');
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  if (!isVisible) return null;

  return (
    <Pressable style={styles.menuOverlay} onPress={onClose}>
      <Animatable.View animation="slideInLeft" duration={300} style={styles.menuContent}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu</Text>
        </View>

        <Pressable style={styles.menuItem} onPress={handleKYC}>
          <MaterialIcons name="verified-user" size={24} color="#4CAF50" style={styles.menuIcon} />
          <Text style={styles.menuItemText}>KYC Verification</Text>
        </Pressable>

        <Pressable style={styles.menuItem} onPress={handleMyPost}>
          <MaterialIcons name="post-add" size={24} color="#4CAF50" style={styles.menuIcon} />
          <Text style={styles.menuItemText}>My Post</Text>
        </Pressable>

        <Pressable
          style={styles.menuItem}
          onPress={() => {
            onClose();
            showLogoutConfirmation();
          }}
        >
          <MaterialIcons name="logout" size={24} color="#E53935" style={styles.menuIcon} />
          <Text style={[styles.menuItemText, { color: '#E53935' }]}>Logout</Text>
        </Pressable>
      </Animatable.View>
    </Pressable>
  );
};

const Home = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState(null);
  const router = useRouter();
  const { mobile: paramMobile } = useLocalSearchParams();

  const fadeAnim = useState(new Animated.Value(0))[0];

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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [paramMobile]);

  const handleProfilePress = () => {
    router.push('/ExpertTab/Profile');
  };

  const handlePostsPress = () => {
    router.push('/ExpertTab/Post');
  };

  const handleAddPostPress = async () => {
    if (!mobile) {
      Alert.alert('Error', 'Phone number not found. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/check-verified-expert/${mobile}`);
      const result = await response.json();

      console.log('Backend Response:', result);

      if (result.success === true) {
        router.push('/ExpertTab/Common');
      } else {
        Alert.alert(
          'KYC Verification Required',
          'Please complete your KYC verification to access this feature.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/ExpertTab/KYCVerification'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error during verification check:', error);
      Alert.alert('Error', 'Failed to verify your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#f5f7f6', '#c8e6c9']} style={styles.container}>
      <View style={styles.topBar}>
        <MenuIcon onPress={() => setIsMenuVisible(true)} />
        <Text style={styles.title}>Crop Expert</Text>
      </View>

      <Menu isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.encouragementContainer}>
          <MaterialIcons name="eco" size={50} color="#4CAF50" />
          <Text style={styles.encouragementText}>
            Share your knowledge! Add posts about plants and help others grow.
          </Text>
          <Pressable
            style={styles.addPostButton}
            onPress={handleAddPostPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addPostButtonText}>Add Post</Text>
            )}
          </Pressable>
        </Animatable.View>
      </ScrollView>

      <View style={styles.navBar}>
        <Pressable style={styles.navButton} onPress={() => {}}>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 15,
  },
  menuIcon: {
    padding: 5,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  menuContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 50,
    zIndex: 1001,
  },
  menuHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f441e',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginLeft: 15,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 80,
  },
  encouragementContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
    width: '90%',
  },
  encouragementText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  addPostButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPostButtonText: {
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

export default Home;