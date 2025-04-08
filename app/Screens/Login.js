import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ImageBackground, Alert, ActivityIndicator, Modal } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Link, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

// Splash Screen Component
const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashText}>🌱 Mero Plant</Text>
      <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
    </View>
  );
};

// Login Page Component
const LoginPage = () => {
  const [role, setRole] = useState('');
  const [countryCode, setCountryCode] = useState('+977');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);

  const backgroundImages = [
    require('../../assets/images/Pumpkin.jpg'),
    require('../../assets/images/roleImg3.jpg'),
    require('../../assets/images/roleImg4.jpeg'),
    require('../../assets/images/roleImg5.jpeg'),
    require('../../assets/images/roleImg7.jpeg'),
  ];

  const motivationalMessages = [
    "🌱 Farmers are the backbone of every nation.",
    "🌾 Your hands cultivate the world’s hope.",
    "🍃 Without farmers, there is no food.",
    "🌍 Sowing seeds, shaping futures.",
    "🌟 Every harvest tells your story.",
    "💪 Strength in the soil, power in your hands.",
    "🌻 Farming feeds not just bodies, but souls.",
    "🌤️ Rain or shine, farmers grow dreams.",
    "🌱 You plant today for a better tomorrow.",
    "🌱 From soil to sky, your work uplifts life.",
  ];

  const countryCodes = [
    { label: '🇳🇵 +977', value: '+977' },
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇬🇧 +44', value: '+44' },
    { label: '🇮🇳 +91', value: '+91' },
    { label: '🇨🇳 +86', value: '+86' },
    { label: '🇫🇷 +33', value: '+33' },
  ];

  const router = useRouter();

  useEffect(() => {
    const randomImageIndex = Math.floor(Math.random() * backgroundImages.length);
    const randomMessageIndex = Math.floor(Math.random() * motivationalMessages.length);
    setBackgroundImage(backgroundImages[randomImageIndex]);
    setMessage(motivationalMessages[randomMessageIndex]);
  }, []);

  const handleLogin = async () => {
    if (!role || !phoneNumber || !pin) {
      Alert.alert('Error', 'Please fill all the fields.');
      return;
    }
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: fullPhoneNumber,
          pin: pin,
          role: role.toLowerCase(),
        }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', result.message);
        await AsyncStorage.setItem('mobile', fullPhoneNumber);
        if (role.toLowerCase() === 'expert') {
          router.push({ pathname: '/ExpertTab/Index', params: { mobile: fullPhoneNumber } });
        } else if (role.toLowerCase() === 'farmer') {
          router.push({ pathname: '/FarmerTab/Index', params: { mobile: fullPhoneNumber } });
        }
      } else {
        Alert.alert('Error', result.detail || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please try again.');
    }
  };

  const handleForgotPin = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/forgot-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, mobile: phoneNumber }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'OTP sent to your phone number.');
        setOtpSent(true);
      } else {
        Alert.alert('Error', result.detail || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error requesting OTP:', error);
      Alert.alert('Error', 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !newPin) {
      Alert.alert('Error', 'Please enter OTP and new PIN.');
      return;
    }
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/verify-otp-pin-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: fullPhoneNumber,
          otp: otp,
          new_pin: newPin,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'PIN reset successfully.');
        setModalVisible(false);
        setOtpSent(false);
        setOtp('');
        setNewPin('');
        setPin(newPin);
      } else {
        Alert.alert('Error', result.detail || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.motivationalText}>{message}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>

          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setRole(value)}
              items={[
                { label: 'Expert', value: 'Expert' },
                { label: 'Farmer', value: 'Farmer' },
              ]}
              placeholder={{ label: 'Select Role', value: null, color: '#aaa' }}
              style={{ inputIOS: styles.pickerInput, inputAndroid: styles.pickerInput }}
            />
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <RNPickerSelect
                onValueChange={(value) => setCountryCode(value)}
                items={countryCodes}
                value={countryCode}
                placeholder={{ label: 'Select Country Code', value: null, color: '#aaa' }}
                useNativeAndroidPickerStyle={false}
                style={{ inputIOS: styles.countryCodeInput, inputAndroid: styles.countryCodeInput }}
              />
            </View>
            <TextInput
              style={styles.phoneNumberInput}
              placeholder="Enter phone number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <Text style={styles.label}>PIN</Text>
          <View style={styles.pinContainer}>
            <TextInput
              style={styles.pinInput}
              placeholder="Enter your PIN"
              placeholderTextColor="#aaa"
              secureTextEntry={!isPinVisible}
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) setPin(text);
              }}
            />
            <Pressable onPress={() => setIsPinVisible(!isPinVisible)} style={styles.eyeIconContainer}>
              <MaterialIcons name={isPinVisible ? 'visibility-off' : 'visibility'} size={24} color="#aaa" />
            </Pressable>
          </View>

          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotPinText}>Forgot PIN?</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <Link href="./SignIn" asChild>
            <Pressable>
              <Text style={styles.registerText}>
                Don’t have an account? <Text style={styles.registerLink}>Register</Text>
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Forgot PIN Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Pressable style={styles.closeIconContainer} onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={28} color="#2E7D32" />
              </Pressable>
              <Text style={styles.modalTitle}>{otpSent ? 'Verify OTP' : 'Forgot PIN'}</Text>

              {!otpSent ? (
                <>
                  <Text style={styles.modalLabel}>Enter your phone number to receive an OTP</Text>
                  <View style={styles.phoneInputContainer}>
                    <View style={styles.countryCodeContainer}>
                      <RNPickerSelect
                        onValueChange={(value) => setCountryCode(value)}
                        items={countryCodes}
                        value={countryCode}
                        placeholder={{ label: 'Select Country Code', value: null, color: '#aaa' }}
                        useNativeAndroidPickerStyle={false}
                        style={{ inputIOS: styles.countryCodeInput, inputAndroid: styles.countryCodeInput }}
                      />
                    </View>
                    <TextInput
                      style={styles.phoneNumberInput}
                      placeholder="Enter phone number"
                      placeholderTextColor="#aaa"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                  </View>
                  <Pressable style={styles.button} onPress={handleForgotPin} disabled={loading}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Send OTP</Text>
                    )}
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.modalLabel}>Enter the OTP sent to your phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    value={otp}
                    onChangeText={setOtp}
                  />
                  <Text style={styles.modalLabel}>Enter new PIN</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter new PIN"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry={true}
                    value={newPin}
                    onChangeText={(text) => {
                      if (/^\d*$/.test(text)) setNewPin(text);
                    }}
                  />
                  <Pressable style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Verify & Reset PIN</Text>
                    )}
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Main App Component
const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  if (!showLogin) return <SplashScreen onFinish={() => setShowLogin(true)} />;
  return <LoginPage />;
};

export default App;

// Styles
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  splashText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  loader: {
    marginTop: 20,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    width: '100%',
  },
  motivationalText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  pickerInput: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    color: '#333',
    backgroundColor: '#fff',
    paddingRight: 30,
    height: 50,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  countryCodeContainer: {
    width: '30%',
    marginRight: 10,
  },
  countryCodeInput: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    color: '#333',
    backgroundColor: '#fff',
    paddingRight: 30,
    height: 50,
  },
  phoneNumberInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  pinInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  registerLink: {
    color: '#2E7D32',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  forgotPinText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'right',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    position: 'relative', // For positioning the close icon
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});