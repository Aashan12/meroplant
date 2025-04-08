import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, TextInput, Alert, SafeAreaView } from 'react-native';
import { Link, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for the icons

const allCrops = [
  {
    id: 1,
    name: 'POTATO (आलु)',
    keywords: ['potato', 'p', 'aa', 'aloo', 'aalu', 'alu', 'आलु'],
    image: require('../../assets/images/Potato.jpeg'),
    screen: './PlantsScreen/Potato',
  },
  {
    id: 2,
    name: 'TOMATO (टमाटर)',
    keywords: ['tomato', 'tamatar', 'golvheda', 'gholbheda', 'टमाटर'],
    image: require('../../assets/images/Tomato.jpeg'),
    screen: './PlantsScreen/Tomato',
  },
  {
    id: 3,
    name: 'Bell Pepper (क्याप्सिकम)',
    keywords: ['bell pepper', 'thuko', 'khursani', 'capsicum', 'क्याप्सिकम'],
    image: require('../../assets/images/Pepper.jpeg'),
    screen: './PlantsScreen/Pepper',
  },
  {
    id: 4,
    name: 'Onion (प्याज)',
    keywords: ['onion', 'pyaz', 'paj', 'प्याज'],
    image: require('../../assets/images/onion.jpg'),
    screen: './FeatureNull',
  },
  {
    id: 5,
    name: 'Cauliflower (फूलगोभी)',
    keywords: ['cauliflower', 'c', 'cauli', 'kauli', 'फूलगोभी'],
    image: require('../../assets/images/cauli.jpg'),
    screen: './FeatureNull',
  },
  {
    id: 6,
    name: 'Pumpkin (कद्दू)',
    keywords: ['pumpkin', 'kaddu', 'farsi', 'कद्दू'],
    image: require('../../assets/images/Pumpkin.jpg'),
    screen: './FeatureNull',
  },
  {
    id: 7,
    name: 'Carrot (गाजर)',
    keywords: ['carrot', 'gazar', 'gajar', 'गाजर'],
    image: require('../../assets/images/carrot.jpg'),
    screen: './FeatureNull',
  },
  {
    id: 8,
    name: 'Cucumber (खीरा)',
    keywords: ['cucumber', 'kheera', 'kakro', 'खीरा'],
    image: require('../../assets/images/cucumber.jpg'),
    screen: './FeatureNull',
  },
  {
    id: 9,
    name: 'Spinach (पालक)',
    keywords: ['spinach', 'palak', 'sag', 'पालक'],
    image: require('../../assets/images/spinach.jpg'),
    screen: './FeatureNull',
  },
  {
    id: 10,
    name: 'Broccoli (ब्रोकली)',
    keywords: ['broccoli', 'ब्रोकली'],
    image: require('../../assets/images/brocauli.jpg'),
    screen: './FeatureNull',
  },
];

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
        onPress: () => {
          router.replace('/Screens/Login');
        },
      },
    ],
    {
      cancelable: true,
    }
  );
};

const MenuIcon = ({ onPress }) => (
  <Pressable onPress={onPress} style={styles.menuIcon}>
    <View style={styles.menuBar} />
    <View style={styles.menuBar} />
    <View style={styles.menuBar} />
  </Pressable>
);

const Menu = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <Pressable style={styles.menuOverlay} onPress={onClose}>
      <View style={styles.menuContent}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu</Text>
        </View>
        <Pressable
          style={styles.menuItem}
          onPress={() => {
            onClose();
            showLogoutConfirmation();
          }}
        >
          <Text style={styles.menuItemText}>Logout</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCrops, setFilteredCrops] = useState(allCrops);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredCrops(allCrops);
      return;
    }

    const searchText = text.toLowerCase();
    const filtered = allCrops.filter((crop) =>
      crop.keywords.some((keyword) => keyword.toLowerCase().includes(searchText))
    );

    if (filtered.length === 0) {
      Alert.alert('Crop Not Found', '', [{ text: 'OK' }]);
    }

    setFilteredCrops(filtered);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Menu Icon */}
      <View style={styles.header}>
        <MenuIcon onPress={() => setIsMenuVisible(true)} />
        <Text style={styles.headerTitle}>Crops</Text>
      </View>

      {/* Menu Overlay */}
      <Menu isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />

      {/* Main Content */}
      <View style={styles.mainContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search crops..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Main Grid Section */}
          <View style={styles.plantsContainer}>
            {filteredCrops.slice(0, 6).map((plant) => (
              <Link key={plant.id} href={plant.screen} asChild>
                <Pressable style={styles.plantCard}>
                  <Image source={plant.image} style={styles.plantImage} />
                  <View style={styles.imageOverlay} />
                  <View style={styles.plantContent}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <View style={styles.greenCircle}>
                      <Text style={styles.arrow}>→</Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>

          {/* Horizontal Scroll Section */}
          <Text style={styles.sectionTitle}>More Crops</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {filteredCrops.slice(6).map((plant) => (
              <Link key={plant.id} href={plant.screen} asChild>
                <Pressable style={styles.horizontalPlantCard}>
                  <Image source={plant.image} style={styles.horizontalPlantImage} />
                  <View style={styles.imageOverlay} />
                  <View style={styles.plantContent}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <View style={styles.greenCircle}>
                      <Text style={styles.arrow}>→</Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </ScrollView>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <Pressable style={styles.navButton} onPress={() => router.push('/FarmerTab/Index')}>
          <MaterialIcons name="home" size={24} color="#1f441e" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push('/FarmerTab/PostFarmer')}>
          <MaterialIcons name="post-add" size={24} color="#1f441e" />
          <Text style={styles.navText}>Post</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(245, 247, 246)',
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#1f441e',
    flex: 1, // Allow title to take up remaining space
  },
  menuIcon: {
    padding: 5,
  },
  menuBar: {
    width: 25,
    height: 2,
    backgroundColor: '#1f441e',
    marginVertical: 3,
    borderRadius: 1,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80, // Add padding to avoid overlap with bottom nav bar
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'rgb(245, 247, 246)',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  plantCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#fff',
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  plantContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  greenCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f441e',
    marginTop: 20,
    marginBottom: 10,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  horizontalPlantCard: {
    width: 160,
    height: 150,
    borderRadius: 20,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: '#fff',
  },
  horizontalPlantImage: {
    width: '100%',
    height: '100%',
  },
  bottomNavBar: {
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
    color: '#1f441e',
    marginTop: 5,
  },
});

export default App;