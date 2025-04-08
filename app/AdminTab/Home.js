import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Expo Router's useRouter

export default function AdminHomePage() {
  const router = useRouter(); // Initialize Expo Router
  const [isMenuVisible, setIsMenuVisible] = useState(false); // State to control menu visibility

  // Navigation handler
  const handleNavigation = (path) => {
    router.push(path); // Navigate to the specified path
    setIsMenuVisible(false); // Close the menu after navigation
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <LinearGradient colors={['#f5f7f6', '#e6f3e9']} style={styles.container}>
      {/* Header with hamburger menu */}
      <View style={styles.header}>
        {/* Hamburger Menu Button */}
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <MaterialIcons name="menu" size={28} color="#1f441e" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      {/* Line below the header when menu is visible */}
      {isMenuVisible && <View style={styles.menuLine} />}

      {/* Hamburger Menu (Dropdown) - Conditionally Rendered */}
      {isMenuVisible && (
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/AdminTab/KycByAdmin')}
          >
            <MaterialIcons name="assignment" size={24} color="#1f441e" />
            <Text style={styles.menuItemText}>KYC Panel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/AdminTab/UserExpert')}
          >
            <MaterialIcons name="people" size={24} color="#1f441e" />
            <Text style={styles.menuItemText}>User Experts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/AdminTab/VerifiedExpert')}
          >
            <MaterialIcons name="verified-user" size={24} color="#1f441e" />
            <Text style={styles.menuItemText}>Verified Experts</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <ScrollView contentContainerStyle={[styles.content, { marginTop: isMenuVisible ? 120 : 0 }]}>
        <Text style={styles.welcomeText}>Welcome to the Admin Panel</Text>
        <Image
          source={require('../../assets/images/Icon.jpg')} // Replace with your image
          style={styles.image}
        />
        <Text style={styles.description}>
          Manage KYC submissions, user experts, and verified experts from here.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20, // Added horizontal padding for a bigger container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40, // Add extra padding at the top
  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f441e',
    marginLeft: 20, // Space between menu button and title
  },
  menuButton: {
    padding: 10,
  },
  menuLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  menuContainer: {
    position: 'absolute',
    top: 80, // Adjust based on header height
    left: 20, // Align to the left
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1,
    width: 200, // Wider menu for better appearance
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500', // Slightly bold text
    marginLeft: 10,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f441e',
    marginBottom: 20,
  },
  image: {
    width: 250, // Bigger image
    height: 250, // Bigger image
    marginBottom: 20,
    borderRadius: 10, // Rounded corners for the image
  },
  description: {
    fontSize: 18, // Bigger font size
    color: '#555',
    textAlign: 'center',
    lineHeight: 24, // Better readability
    paddingHorizontal: 20, // Added padding for better spacing
  },
});