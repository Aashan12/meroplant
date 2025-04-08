import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const { width } = Dimensions.get('window');

const PepperBell = () => {
  const [language, setLanguage] = useState('english');
  const [expandedSection, setExpandedSection] = useState(null); // To handle expandable sections
  const router = useRouter();

  // Image imports
  const healthyImages = [
    require('../../../assets/images/pepper/pepper_healthy1.jpg'),
    require('../../../assets/images/pepper/pepper_healthy2.jpg'),
  ];

  const bacterialSpotImages = [
    require('../../../assets/images/pepper/Pepper_bacterial_spot1.jpg'),
    require('../../../assets/images/pepper/Pepper_bacterial_spot2.jpg'),
  ];

  // Toggle expandable sections
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.languageToggle}>
          <TouchableOpacity 
            style={[styles.langButton, language === 'english' && styles.activeLang]}
            onPress={() => setLanguage('english')}
          >
            <Text style={styles.langText}>🇬🇧</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.langButton, language === 'nepali' && styles.activeLang]}
            onPress={() => setLanguage('nepali')}
          >
            <Text style={styles.langText}>🇳🇵</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.scrollView}>
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            {language === 'english' ? 'Pepper Bell Disease Guide' : 'खुर्सानी बेल रोग मार्गदर्शक'}
          </Text>
          <Text style={styles.welcomeSubtext}>
            {language === 'english'
              ? 'Learn how to identify, prevent, and treat common pepper bell diseases.'
              : 'खुर्सानी बेलका सामान्य रोगहरूको लक्षण, रोकथाम, र उपचार बारे जान्नुहोस्।'}
          </Text>
        </View>

        {/* Healthy Pepper Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('healthy')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Healthy Pepper Bell Plants' : 'स्वस्थ खुर्सानी बेलका बिरुवाहरू'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'healthy' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#4CAF50" 
            />
          </TouchableOpacity>
          {expandedSection === 'healthy' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {healthyImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Healthy pepper bell plants have vibrant green leaves, strong stems, and no visible signs of disease or pests.'
                  : 'स्वस्थ खुर्सानी बेलका बिरुवाहरूमा तेजस्वी हरियो पातहरू, बलियो डाँठ, र कुनै रोग वा कीराहरूको लक्षण देखिदैन।'}
              </Text>
            </>
          )}
        </View>

        {/* Bacterial Spot Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('bacterialSpot')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Bacterial Spot Disease' : 'जीवाणु दाग रोग'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'bacterialSpot' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#D32F2F" 
            />
          </TouchableOpacity>
          {expandedSection === 'bacterialSpot' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {bacterialSpotImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Bacterial spot is caused by the bacterium Xanthomonas campestris. It thrives in warm, humid conditions and spreads through infected seeds, water, and plant debris.'
                  : 'जीवाणु दाग रोग Xanthomonas campestris नामक जीवाणुले गर्दा हुन्छ। यो न्यानो, आर्द्र अवस्थामा बढ्छ र संक्रमित बीउ, पानी, र बोटबाट फैलिन्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Small, water-soaked spots on leaves\n• Spots turn brown and crack over time\n• Yellow halos around spots\n• Infected fruits with raised, scabby lesions'
                    : '• पातमा साना, पानीले भिजेको दागहरू\n• दागहरू खैरो र फुट्छन्\n• दागहरूको वरिपरि पहेंलो घेरा\n• फलमा उठेको, खरानी जस्तो घाउहरू'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Use disease-free seeds\n• Avoid overhead irrigation\n• Apply copper-based bactericides\n• Remove and destroy infected plants'
                    : '• रोगमुक्त बीउ प्रयोग गर्ने\n• माथिबाट सिंचाई नगर्ने\n• तामा आधारित जीवाणुनाशक छर्ने\n• संक्रमित बोटहरू हटाएर नष्ट गर्ने'}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          style={[styles.fab, styles.fabExpert]}
          onPress={() => router.push('/FarmerTab/FeatureNull')}
        >
          <MaterialIcons name="chat" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.fab, styles.fabScan]}
          onPress={() => router.push('/FarmerTab/PepperScreen')}
        >
          <MaterialIcons name="camera-alt" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F3EE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#4CAF50',
  },
  backButton: {
    padding: 10,
  },
  languageToggle: {
    flexDirection: 'row',
    gap: 10,
  },
  langButton: {
    padding: 8,
    borderRadius: 20,
  },
  activeLang: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  langText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#4CAF50',
    padding: 20,
    margin: 15,
    borderRadius: 15,
    elevation: 3,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginTop: 5,
  },
  sectionCard: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cardImage: {
    width: width * 0.6,
    height: 150,
    borderRadius: 10,
    margin: 10,
  },
  sectionDescription: {
    color: '#666',
    paddingHorizontal: 15,
    paddingBottom: 15,
    lineHeight: 22,
  },
  detailsContainer: {
    backgroundColor: '#F1F8E9',
    padding: 15,
    margin: 15,
    borderRadius: 10,
  },
  detailTitle: {
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  detailText: {
    color: '#666',
    lineHeight: 22,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'column',
    gap: 15,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabScan: {
    backgroundColor: '#4CAF50',
  },
  fabExpert: {
    backgroundColor: '#FFA000',
  },
});

export default PepperBell;