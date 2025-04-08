


import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, ImageBackground, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select';
import { BASE_URL } from '../config';
const Verification = () => {
  const params = useLocalSearchParams(); // Access route parameters

    // Extract user data from params
    const userData = {
      firstName: params.firstName,
      lastName: params.lastName,
      dateOfBirth: {
        year: parseInt(params.year), // Convert string to number
        month: parseInt(params.month), // Convert string to number
        day: parseInt(params.day), // Convert string to number
      },
      pin: params.pin,
      role: params.role,
    };
  const [mobile, setMobile] = useState(params.mobile || ''); // Use the mobile parameter
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [countryCode, setCountryCode] = useState('+977'); // Default country code
  const router = useRouter();

  // List of country codes with flags
  const countryCodes = [
    { label: '🇳🇵 +977', value: '+977' }, // Nepal with flag
    { label: '🇺🇸 +1', value: '+1' }, // USA with flag
    { label: '🇬🇧 +44', value: '+44' }, // UK with flag
    { label: '🇮🇳 +91', value: '+91' }, // India with flag
    { label: '🇨🇳 +86', value: '+86' }, // China with flag
    { label: '🇫🇷 +33', value: '+33' }, // France with flag
  ];




  const handleSendOtp = async () => {
    if (mobile) {
      try {
        const response = await fetch(`${BASE_URL}/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ countryCode, mobile }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setIsOtpSent(true);
          Alert.alert('OTP Sent', 'A verification code has been sent to your mobile number.');
        } else {
          Alert.alert('Error', data.message || 'Failed to send OTP.');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid mobile number.');
    }
  };
  


  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      try {
        // Step 1: Verify OTP
        const verifyResponse = await fetch(`${BASE_URL}/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: `${countryCode}${mobile}`, 
            otp: otp,  // Send OTP here
            userData: {  // Send user data as well
              firstName: userData.firstName,
              lastName: userData.lastName,
              dateOfBirth: {
                year: userData.dateOfBirth.year,
                month: userData.dateOfBirth.month,
                day: userData.dateOfBirth.day,
              },
              pin: userData.pin,
              role: userData.role,
            },
          }),
        });
  
        const verifyData = await verifyResponse.json();
  
        if (verifyResponse.ok && verifyData.success) {
          console.log("OTP verified successfully.");
          
          // Step 2: Prepare user data for storing in the database
          const dataToStore = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            dateOfBirth: {
              year: userData.dateOfBirth.year,
              month: userData.dateOfBirth.month,
              day: userData.dateOfBirth.day,
            },
            pin: userData.pin,
            role: userData.role,
            mobile: `${countryCode}${mobile}`,
          };
  
          console.log("Data being sent to backend:", dataToStore); // Debugging
  
          // Step 3: Store user data in the database
          const signupResponse = await fetch(`${BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToStore),
          });
  
          const signupResult = await signupResponse.json();
  
          if (signupResponse.ok) {
            console.log("User data stored successfully.");
  
            // Step 4: Navigate to Login screen after successful signup
            setTimeout(() => {
              router.push("/Screens/Login"); // Navigate to the Login screen after success
            }, 100);
          } else {
            console.error("Signup failed:", signupResult.detail);
  
            // Handle different error cases
            if (signupResult.detail === "Mobile number already registered.") {
              Alert.alert("Error", "This mobile number is already registered.");
            } else if (signupResult.detail === "Invalid role.") {
              Alert.alert("Error", "Invalid role selected.");
            } else {
              Alert.alert("Error", signupResult.detail || "Failed to create account.");
            }
          }
        } else {
          Alert.alert("Error", verifyData.message || "OTP verification failed.");
        }
      } catch (error) {
        console.error("Error during OTP verification or signup:", error);
        Alert.alert("Error", "An error occurred. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
    }
  };
  
  
  return (
    <ImageBackground source={require('../../assets/images/roleImg2.jpeg')} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            We'll send you a verification code to confirm your phone number.
          </Text>

          {/* Country Code and Mobile Number Input */}
          <View style={styles.phoneInputContainer}>
            {/* Country Code Dropdown */}
            <View style={styles.countryCodeContainer}>
              <RNPickerSelect
                onValueChange={(value) => setCountryCode(value)}
                items={countryCodes}
                value={countryCode}
                placeholder={{ label: 'Select Country Code', value: null, color: '#aaa' }}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.countryCodeInput,
                  inputAndroid: styles.countryCodeInput,
                }}
              />
            </View>

            {/* Mobile Number Input */}
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              style={styles.phoneInput}
              editable={!isOtpSent}
            />
          </View>

          {/* Send OTP Button */}
          <Pressable style={styles.sendOtpButton} onPress={handleSendOtp}>
            <Text style={styles.sendOtpButtonText}>{isOtpSent ? 'Resend OTP' : 'Send OTP'}</Text>
          </Pressable>

          {/* OTP Input */}
          {isOtpSent && (
            <View style={styles.otpContainer}>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                style={styles.otpInput}
              />
                
              <Pressable style={styles.verifyButton} onPress={handleVerifyOtp}>
                <Text style={styles.verifyButtonText}>Verify</Text>
              </Pressable>
            </View>
          )}

          {/* Back to SignUp */}
          <Pressable onPress={() => router.push('./SignIn')}>
            <Text style={styles.backText}>Back to Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    width: '100%',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
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
  phoneInput: {
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
  sendOtpButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sendOtpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  verifyButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    marginTop: 20,
    color: '#6A1B9A',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default Verification;