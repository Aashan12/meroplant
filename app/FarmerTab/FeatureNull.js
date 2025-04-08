import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

const { width, height } = Dimensions.get('window');

const FeatureNotAvailable = () => {
  const router = useRouter(); // Initialize useRouter
  const [fadeAnim] = React.useState(new Animated.Value(0)); // For fade animation
  const [scaleAnim] = React.useState(new Animated.Value(0.8)); // For scale animation
  const [bounceAnim] = React.useState(new Animated.Value(0)); // For bounce animation

  React.useEffect(() => {
    // Fade in animation for the entire page
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    // Scale animation for the card
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.elastic(1.2),
      useNativeDriver: true,
    }).start();

    // Bounce animation for the construction icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20], // Bounce up and down
  });

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LinearGradient
        colors={['#4CAF50', '#81C784', '#A5D6A7']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()} // Navigate back
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.headerText}>Oops! 🚧</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Animated.View
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Animated.View style={{ transform: [{ translateY: bounce }] }}>
              <MaterialIcons name="construction" size={100} color="#2E7D32" />
            </Animated.View>
            <Text style={styles.title}>Feature Under Construction!</Text>
            <Text style={styles.subtitle}>
              Our team of highly trained 🐒 monkeys is working hard to bring you this feature.
            </Text>
            <Text style={styles.funText}>
              In the meantime, why not enjoy a cup of ☕ coffee?
            </Text>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Follow us for updates and 🍌 banana giveaways!
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  backButton: {
    marginRight: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.9,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  funText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FeatureNotAvailable;