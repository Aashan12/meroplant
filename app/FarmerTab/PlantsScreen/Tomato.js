import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // For icons

const { width } = Dimensions.get('window');

const Tomato = () => {
  const [language, setLanguage] = useState('english');
  const [expandedSection, setExpandedSection] = useState(null); // To handle expandable sections
  const router = useRouter();

  // Image imports
  const targetSpotImages = [
    require('../../../assets/images/tomato/tomato_target_spot1.jpg'),
    require('../../../assets/images/tomato/tomato_target_spot2.jpg'),
  ];

  const mosaicVirusImages = [
    require('../../../assets/images/tomato/tomato_mosaic_virus1.jpg'),
    require('../../../assets/images/tomato/tomato_mosaic_virus2.jpg'),
  ];

  const yellowLeafCurlVirusImages = [
    require('../../../assets/images/tomato/tomato_yellow_leaf_curl1.jpg'),
    require('../../../assets/images/tomato/tomato_yellow_leaf_curl2.jpg'),
  ];

  const bacterialSpotImages = [
    require('../../../assets/images/tomato/tomato_bacterial_spot1.jpg'),
    require('../../../assets/images/tomato/tomato_bacterial_spot2.jpg'),
  ];

  const earlyBlightImages = [
    require('../../../assets/images/tomato/tomato_early_blight1.jpg'),
    require('../../../assets/images/tomato/tomato_early_blight2.jpg'),
  ];

  const lateBlightImages = [
    require('../../../assets/images/tomato/tomato_late_blight1.jpg'),
    require('../../../assets/images/tomato/tomato_late_blight2.jpg'),
  ];

  const leafMoldImages = [
    require('../../../assets/images/tomato/tomato_leaf_mold1.jpg'),
    require('../../../assets/images/tomato/tomato_leaf_mold2.jpg'),
  ];

  const septoriaLeafSpotImages = [
    require('../../../assets/images/tomato/tomato_septoria_leaf_spot1.jpg'),
    require('../../../assets/images/tomato/tomato_septoria_leaf_spot2.jpg'),
  ];

  const spiderMitesImages = [
    require('../../../assets/images/tomato/tomato_spider_mites1.jpg'),
    require('../../../assets/images/tomato/tomato_spider_mites2.jpg'),
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
            {language === 'english' ? 'Tomato Disease Guide' : 'टमाटर रोग मार्गदर्शक'}
          </Text>
          <Text style={styles.welcomeSubtext}>
            {language === 'english'
              ? 'Learn how to identify, prevent, and treat common tomato diseases.'
              : 'टमाटरका सामान्य रोगहरूको लक्षण, रोकथाम, र उपचार बारे जान्नुहोस्।'}
          </Text>
        </View>

        {/* Tomato Target Spot Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('targetSpot')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Target Spot' : 'टमाटर टार्गेट स्पट'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'targetSpot' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#FF5722" 
            />
          </TouchableOpacity>
          {expandedSection === 'targetSpot' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {targetSpotImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Tomato Target Spot is a fungal disease caused by Corynespora cassiicola. It causes dark, concentric spots on leaves, stems, and fruits, leading to defoliation and reduced yield.'
                  : 'टमाटर टार्गेट स्पट Corynespora cassiicola नामक फंगसले गर्दा हुन्छ। यसले पात, डाँठ, र फलमा गाढा, केन्द्रित दागहरू बनाउँछ, जसले पात झर्ने र उत्पादन घटाउँछ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Dark, circular spots with concentric rings\n• Yellowing and wilting of leaves\n• Spots on stems and fruits\n• Premature leaf drop'
                    : '• गाढा, गोलाकार दागहरू जसमा केन्द्रित छल्लाहरू हुन्छन्\n• पातहरू पहेंलो हुन्छन् र झुण्डिन्छन्\n• डाँठ र फलमा दागहरू\n• पात अघिल्लो समयमा झर्ने'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Remove and destroy infected plant debris\n• Apply fungicides like chlorothalonil or mancozeb\n• Ensure proper spacing for airflow\n• Avoid overhead watering to reduce leaf wetness'
                    : '• संक्रमित बोटका अवशेष हटाएर नष्ट गर्ने\n• chlorothalonil वा mancozeb जस्ता ढुसीनाशक छर्ने\n• हावा प्रवाहको लागि उचित दूरी कायम गर्ने\n• पातमा पानी नपर्ने गरी सिंचाई गर्ने'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Tomato Mosaic Virus Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('mosaicVirus')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Mosaic Virus' : 'टमाटर मोजेक भाइरस'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'mosaicVirus' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#9C27B0" 
            />
          </TouchableOpacity>
          {expandedSection === 'mosaicVirus' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {mosaicVirusImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Tomato Mosaic Virus is a viral disease that causes mottled leaves, stunted growth, and reduced fruit production. It is highly contagious and spreads through contact.'
                  : 'टमाटर मोजेक भाइरस एक भाइरल रोग हो जसले पातहरूमा धब्बा, बिरुवाको वृद्धि रोक्छ, र फल उत्पादन घटाउँछ। यो धेरै संक्रामक छ र सम्पर्कबाट फैलिन्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Mottled or mosaic patterns on leaves\n• Stunted plant growth\n• Distorted or misshapen fruits\n• Yellowing of leaves'
                    : '• पातहरूमा धब्बा वा मोजेक प्याटर्न\n• बिरुवाको वृद्धि रोकिने\n• फलहरू विकृत वा अनियमित आकार\n• पातहरू पहेंलो हुन्छन्'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Use virus-free seeds\n• Control aphid populations (which spread the virus)\n• Remove and destroy infected plants\n• Disinfect tools and hands after handling infected plants'
                    : '• भाइरसमुक्त बीज प्रयोग गर्ने\n• एफिड नियन्त्रण गर्ने (जसले भाइरस फैलाउँछ)\n• संक्रमित बोटहरू हटाएर नष्ट गर्ने\n• संक्रमित बोटहरू ह्यान्डल गरेपछि औजार र हात सफा गर्ने'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Tomato Yellow Leaf Curl Virus Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('yellowLeafCurlVirus')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Yellow Leaf Curl Virus' : 'टमाटर पहेँलो पात मुड्ने भाइरस'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'yellowLeafCurlVirus' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#FFC107" 
            />
          </TouchableOpacity>
          {expandedSection === 'yellowLeafCurlVirus' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {yellowLeafCurlVirusImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Tomato Yellow Leaf Curl Virus is a viral disease transmitted by whiteflies. It causes yellowing and curling of leaves, stunted growth, and reduced fruit size.'
                  : 'टमाटर पहेँलो पात मुड्ने भाइरस वाइटफ्लाइबाट फैलिन्छ। यसले पातहरू पहेंलो हुन्छन् र मुड्छन्, बिरुवाको वृद्धि रोकिन्छ, र फलको आकार घट्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Yellowing and upward curling of leaves\n• Stunted plant growth\n• Reduced fruit size and yield\n• Whiteflies on the undersides of leaves'
                    : '• पातहरू पहेंलो हुन्छन् र माथि मुड्छन्\n• बिरुवाको वृद्धि रोकिन्छ\n• फलको आकार र उत्पादन घट्छ\n• पातको तल वाइटफ्लाइहरू देखिन्छन्'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Control whitefly populations using insecticides\n• Use resistant tomato varieties\n• Remove and destroy infected plants\n• Use reflective mulches to repel whiteflies'
                    : '• कीटनाशक प्रयोग गरेर वाइटफ्लाइ नियन्त्रण गर्ने\n• प्रतिरोधी टमाटर जातहरू प्रयोग गर्ने\n• संक्रमित बोटहरू हटाएर नष्ट गर्ने\n• वाइटफ्लाइहरू टार्न प्रतिबिम्बित मल्च प्रयोग गर्ने'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Tomato Bacterial Spot Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('bacterialSpot')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Bacterial Spot' : 'टमाटर जीवाणु धब्बा'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'bacterialSpot' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#2196F3" 
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
                  ? 'Tomato Bacterial Spot is caused by the bacterium Xanthomonas campestris. It causes small, dark spots on leaves, stems, and fruits, leading to defoliation and fruit damage.'
                  : 'टमाटर जीवाणु धब्बा Xanthomonas campestris नामक जीवाणुले गर्दा हुन्छ। यसले पात, डाँठ, र फलमा साना, गाढा दागहरू बनाउँछ, जसले पात झर्ने र फल नष्ट हुन्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Small, dark, water-soaked spots on leaves\n• Spots on stems and fruits\n• Yellow halos around spots\n• Premature leaf drop'
                    : '• पातमा साना, गाढा, पानीले भिजेका दागहरू\n• डाँठ र फलमा दागहरू\n• दागहरूको वरिपरि पहेंलो घेरा\n• पात अघिल्लो समयमा झर्ने'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Use disease-free seeds\n• Apply copper-based bactericides\n• Avoid overhead watering\n• Remove and destroy infected plants'
                    : '• रोगमुक्त बीज प्रयोग गर्ने\n• तामा आधारित जीवाणुनाशक छर्ने\n• माथिबाट सिंचाई नगर्ने\n• संक्रमित बोटहरू हटाएर नष्ट गर्ने'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Tomato Early Blight Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('earlyBlight')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Early Blight' : 'टमाटर प्रारम्भिक झुलसा'}
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
                  ? 'Tomato Early Blight is caused by the fungus Alternaria solani. It causes dark, concentric rings on older leaves, leading to defoliation and reduced fruit yield.'
                  : 'टमाटर प्रारम्भिक झुलसा Alternaria solani नामक फंगसले गर्दा हुन्छ। यसले पुराना पातहरूमा गाढा, केन्द्रित छल्लाहरू बनाउँछ, जसले पात झर्ने र फल उत्पादन घटाउँछ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Dark, concentric rings on leaves\n• Yellowing of leaves\n• Brown lesions on stems\n• Infected fruits with dark, sunken spots'
                    : '• पातमा गाढा, केन्द्रित छल्लाहरू\n• पातहरू पहेंलो हुन्छन्\n• डाँठमा खैरो घाउहरू\n• फलमा गाढा, धंसिएका दागहरू'}
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

        {/* Tomato Late Blight Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('lateBlight')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Late Blight' : 'टमाटर ढिलो झुलसा'}
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
                  ? 'Tomato Late Blight is caused by the pathogen Phytophthora infestans. It spreads rapidly in cool, wet conditions and can destroy entire crops if not controlled.'
                  : 'टमाटर ढिलो झुलसा Phytophthora infestans नामक रोगजनकले गर्दा हुन्छ। यो चिसो, ओसिलो अवस्थामा छिटो फैलिन्छ र नियन्त्रण नगरे पूरै बाली नष्ट गर्न सक्छ।'}
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

        {/* Tomato Leaf Mold Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('leafMold')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Leaf Mold' : 'टमाटर पात फोहोर'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'leafMold' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#4CAF50" 
            />
          </TouchableOpacity>
          {expandedSection === 'leafMold' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {leafMoldImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Tomato Leaf Mold is a fungal disease caused by Fulvia fulva. It causes yellow spots on the upper leaf surface and moldy growth on the underside, leading to defoliation.'
                  : 'टमाटर पात फोहोर Fulvia fulva नामक फंगसले गर्दा हुन्छ। यसले पातको माथिल्लो सतहमा पहेंलो दागहरू बनाउँछ र तल्लो सतहमा फोहोर हुन्छ, जसले पात झर्ने गर्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Yellow spots on upper leaf surfaces\n• Moldy growth on the underside of leaves\n• Premature leaf drop\n• Reduced fruit yield'
                    : '• पातको माथिल्लो सतहमा पहेंलो दागहरू\n• पातको तल्लो सतहमा फोहोर\n• पात अघिल्लो समयमा झर्ने\n• फल उत्पादन घट्ने'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Improve air circulation\n• Reduce humidity in the greenhouse\n• Apply fungicides like chlorothalonil\n• Remove and destroy infected plants'
                    : '• हावा प्रवाह बढाउने\n• ग्रीनहाउसको आर्द्रता घटाउने\n• chlorothalonil जस्ता ढुसीनाशक छर्ने\n• संक्रमित बोटहरू हटाएर नष्ट गर्ने'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Tomato Septoria Leaf Spot Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('septoriaLeafSpot')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Septoria Leaf Spot' : 'टमाटर सेप्टोरिया पात धब्बा'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'septoriaLeafSpot' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#673AB7" 
            />
          </TouchableOpacity>
          {expandedSection === 'septoriaLeafSpot' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {septoriaLeafSpotImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Tomato Septoria Leaf Spot is caused by the fungus Septoria lycopersici. It causes small, circular spots with gray centers and dark edges on leaves, leading to defoliation.'
                  : 'टमाटर सेप्टोरिया पात धब्बा Septoria lycopersici नामक फंगसले गर्दा हुन्छ। यसले पातमा साना, गोलाकार दागहरू बनाउँछ जसमा खैरो केन्द्र र गाढा किनाराहरू हुन्छन्, जसले पात झर्ने गर्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Small, circular spots with gray centers\n• Dark edges around spots\n• Yellowing and wilting of leaves\n• Premature leaf drop'
                    : '• साना, गोलाकार दागहरू जसमा खैरो केन्द्र हुन्छ\n• दागहरूको वरिपरि गाढा किनाराहरू\n• पातहरू पहेंलो हुन्छन् र झुण्डिन्छन्\n• पात अघिल्लो समयमा झर्ने'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Remove infected leaves\n• Apply fungicides like chlorothalonil\n• Practice crop rotation\n• Avoid overhead watering'
                    : '• संक्रमित पातहरू हटाउने\n• chlorothalonil जस्ता ढुसीनाशक छर्ने\n• बाली घुमाउने\n• माथिबाट सिंचाई नगर्ने'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Tomato Spider Mites Section */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={() => toggleSection('spiderMites')}
          >
            <Text style={styles.sectionTitle}>
              {language === 'english' ? 'Tomato Spider Mites' : 'टमाटर स्पाइडर माइट्स'}
            </Text>
            <MaterialIcons 
              name={expandedSection === 'spiderMites' ? 'expand-less' : 'expand-more'} 
              size={24} 
              color="#795548" 
            />
          </TouchableOpacity>
          {expandedSection === 'spiderMites' && (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {spiderMitesImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.cardImage} />
                ))}
              </ScrollView>
              <Text style={styles.sectionDescription}>
                {language === 'english'
                  ? 'Tomato Spider Mites are tiny pests that feed on plant sap, causing stippling on leaves, yellowing, and potentially defoliation.'
                  : 'टमाटर स्पाइडर माइट्स साना कीराहरू हुन् जसले बोटको रस चुस्छन्, जसले पातहरूमा धब्बा, पहेंलो हुन्छ, र पात झर्न सक्छ।'}
              </Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Symptoms:' : 'लक्षणहरू:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Stippling or tiny white spots on leaves\n• Yellowing and bronzing of leaves\n• Fine webbing on the undersides of leaves\n• Premature leaf drop'
                    : '• पातहरूमा धब्बा वा साना सेतो दागहरू\n• पातहरू पहेंलो हुन्छन् र खैरो हुन्छन्\n• पातको तल्लो सतहमा जाला जस्तो देखिन्छ\n• पात अघिल्लो समयमा झर्ने'}
                </Text>
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>
                  {language === 'english' ? 'Prevention & Treatment:' : 'रोकथाम र उपचार:'}
                </Text>
                <Text style={styles.detailText}>
                  {language === 'english'
                    ? '• Use miticides to control spider mites\n• Introduce natural predators like ladybugs\n• Maintain proper plant hygiene\n• Increase humidity to deter mites'
                    : '• स्पाइडर माइट्स नियन्त्रण गर्न माइटिसाइड प्रयोग गर्ने\n• लेडीबग जस्ता प्राकृतिक शिकारीहरू परिचय गर्ने\n• बोटको स्वच्छता कायम गर्ने\n• माइट्स हटाउन आर्द्रता बढाउने'}
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
          onPress={() => router.push('/ExpertTab/Index')}
        >
          <MaterialIcons name="chat" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.fab, styles.fabScan]}
          onPress={() => router.push('/FarmerTab/TomatoScreen')}
        >
          <MaterialIcons name="camera-alt" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles (same as your existing styles)
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

export default Tomato;