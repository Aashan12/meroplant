import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const { width } = Dimensions.get('window');

const Potato = () => {
  const [language, setLanguage] = useState('english');
  const [expandedSection, setExpandedSection] = useState(null); // To handle expandable sections
  const router = useRouter();

  // Image imports
  const healthyImages = [
    require('../../../assets/images/potato_healthy1.jpg'),
    require('../../../assets/images/potato_healthy2.jpg'),
  ];

  const earlyBlightImages = [
    require('../../../assets/images/potato_early_blight1.jpg'),
    require('../../../assets/images/potato_early_blight2.jpg'),
  ];

  const lateBlightImages = [
    require('../../../assets/images/potato_late_blight1.jpg'),
    require('../../../assets/images/potato_late_blight2.jpg'),
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
            {language === 'english' ? 'Potato Disease Guide' : 'आलु रोग मार्गदर्शक'}
          </Text>
          <Text style={styles.welcomeSubtext}>
            {language === 'english'
              ? 'Learn how to identify, prevent, and treat common potato diseases.'
              : 'आलुका सामान्य रोगहरूको लक्षण, रोकथाम, र उपचार बारे जान्नुहोस्।'}
          </Text>
        </View>

        {/* Healthy Potato Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('healthy')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Healthy Potato Plants' : 'स्वस्थ आलुका बिरुवाहरू'}
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
                  ? 'Healthy potato plants have vibrant green leaves, strong stems, and no visible signs of disease or pests.'
                  : 'स्वस्थ आलुका बिरुवाहरूमा तेजस्वी हरियो पातहरू, बलियो डाँठ, र कुनै रोग वा कीराहरूको लक्षण देखिदैन।'}
              </Text>
            </>
          )}
        </View>

        {/* Early Blight Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('earlyBlight')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Early Blight Disease' : 'प्रारम्भिक झुलसा रोग'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'earlyBlight' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#FFA000" 
            />
          </TouchableOpacity>
          {expandedSection === 'earlyBlight' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {earlyBlightImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Early blight is caused by the fungus Alternaria solani. It thrives in warm, humid conditions and spreads through infected plant debris, wind, and water.'
                  : 'प्रारम्भिक झुलसा रोग Alternaria solani नामक फंगसले गर्दा हुन्छ। यो न्यानो, आर्द्र अवस्थामा बढ्छ र संक्रमित बोट, हावा, र पानीबाट फैलिन्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Dark, concentric spots on leaves\n• Yellowing of leaves\n• Brown lesions on stems\n• Infected tubers with dark, sunken spots'
                    : '• पातमा गाढा, केन्द्रित दागहरू\n• पातहरू पहेंलो हुन्छन्\n• डाँठमा खैरो घाउहरू\n• कन्दमा गाढा, धंसिएको दागहरू'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Remove infected plants immediately\n• Apply fungicides like chlorothalonil or mancozeb\n• Ensure proper spacing for airflow\n• Rotate crops to prevent soil-borne fungi'
                    : '• संक्रमित बोटहरू तुरुन्तै हटाउने\n• chlorothalonil वा mancozeb जस्ता ढुसीनाशक छर्ने\n• हावा प्रवाहको लागि उचित दूरी कायम गर्ने\n• माटोबाट फैलिने फंगस रोक्न बाली घुमाउने'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Late Blight Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('lateBlight')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Late Blight Disease' : 'ढिलो झुलसा रोग'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'lateBlight' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#D32F2F" 
            />
          </TouchableOpacity>
          {expandedSection === 'lateBlight' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {lateBlightImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Late blight is caused by the pathogen Phytophthora infestans. It spreads rapidly in cool, wet conditions and can destroy entire crops if not controlled.'
                  : 'ढिलो झुलसा रोग Phytophthora infestans नामक रोगजनकले गर्दा हुन्छ। यो चिसो, ओसिलो अवस्थामा छिटो फैलिन्छ र नियन्त्रण नगरे पूरै बाली नष्ट गर्न सक्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Water-soaked lesions on leaves\n• White fungal growth under leaves\n• Dark, rotting tubers\n• Rapid wilting and death of plants'
                    : '• पातमा पानीले भिजेको घाउहरू\n• पातको तल सेतो फंगस\n• कन्दमा गाढा, सडेको भाग\n• बिरुवा छिटो मर्ने'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Remove and destroy infected plants\n• Apply copper-based fungicides\n• Avoid overhead irrigation\n• Plant resistant varieties like Kennebec or Defender'
                    : '• संक्रमित बोटहरू हटाएर नष्ट गर्ने\n• तामा आधारित ढुसीनाशक छर्ने\n• माथिबाट सिंचाई नगर्ने\n• Kennebec वा Defender जस्ता प्रतिरोधी जातहरू रोप्ने'}
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
          onPress={() => router.push('/FarmerTab/PotatoScreen')}
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

export default Potato;