import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons'; // For eye icon
import { useNavigation, Link, useRouter } from 'expo-router'; // Import useNavigation



const SignIn = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [year, setYear] = useState(null); // Initialize as null
  const [month, setMonth] = useState(null); // Initialize as null
  const [day, setDay] = useState(null); // Initialize as null
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isPinVisible, setIsPinVisible] = useState(false); // For PIN visibility toggle
  const [isYearModalVisible, setIsYearModalVisible] = useState(false); // For year modal visibility
  const [isMonthModalVisible, setIsMonthModalVisible] = useState(false); // For month modal visibility
  const [isDayModalVisible, setIsDayModalVisible] = useState(false); // For day modal visibility
  const [role, setRole] = useState(null); // For role selection

  // Initialize navigation
  const router = useRouter();

  // Roles (Expert or Farmer)
  const roles = [
    { label: 'Expert', value: 'expert' },
    { label: 'Farmer', value: 'farmer' },
  ];

  // Generate years (1900 to current year)
  const years = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i).reverse();

  // Months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSubmit = () => {
    // Check if all fields are filled
    if (
      !firstName ||
      !lastName ||
      !year ||
      !month ||
      !day ||
      !pin ||
      !confirmPin ||
      !role
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Check if PINs match and are valid
    if (pin !== confirmPin || pin.length !== 4) {
      Alert.alert('Error', 'PINs do not match or are invalid');
      return;
    }

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      dateOfBirth: { year, month, day },
      pin,
      role,
    };

    // Navigate to Verification screen with user data
    router.push({
      pathname: './Verification',
      params: {
        ...userData, // Spread user data into params
        year: userData.dateOfBirth.year, // Add year separately
        month: userData.dateOfBirth.month, // Add month separately
        day: userData.dateOfBirth.day, // Add day separately
      },
    });
  };

  const renderYearItem = ({ item }) => (
    <Pressable
      style={[styles.gridButton, year === item && styles.selectedGridButton]}
      onPress={() => {
        setYear(item);
        setIsYearModalVisible(false); // Close modal after selecting a year
      }}
    >
      <Text style={styles.gridButtonText}>{item}</Text>
    </Pressable>
  );

  const renderMonthItem = ({ item, index }) => (
    <Pressable
      style={[styles.gridButton, month === index + 1 && styles.selectedGridButton]}
      onPress={() => {
        setMonth(index + 1); // Set month as a number (1-12)
        setIsMonthModalVisible(false); // Close modal after selecting a month
      }}
    >
      <Text style={styles.gridButtonText}>{item}</Text>
    </Pressable>
  );

  const renderDayItem = ({ item }) => (
    <Pressable
      style={[styles.gridButton, day === item && styles.selectedGridButton]}
      onPress={() => {
        setDay(item);
        setIsDayModalVisible(false); // Close modal after selecting a day
      }}
    >
      <Text style={styles.gridButtonText}>{item}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../assets/images/roleImg3.jpg')} // Replace with your green-themed farm background image
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>🌱 Sign Up</Text>

          {/* First Name */}
          <TextInput
            placeholder="Enter your first name"
            placeholderTextColor="#aaa"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />

          {/* Last Name */}
          <TextInput
            placeholder="Enter your last name"
            placeholderTextColor="#aaa"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />

          {/* Date of Birth */}
          <View style={styles.dateContainer}>
            {/* Year Picker */}
            <Pressable
              style={styles.pickerContainer}
              onPress={() => setIsYearModalVisible(true)}
            >
              <View pointerEvents="none">
                <TextInput
                  placeholder="Year"
                  placeholderTextColor="#aaa"
                  value={year ? year.toString() : ''}
                  editable={false}
                  style={styles.pickerInput}
                />
              </View>
            </Pressable>

            {/* Month Picker */}
            <Pressable
              style={styles.pickerContainer}
              onPress={() => setIsMonthModalVisible(true)}
            >
              <View pointerEvents="none">
                <TextInput
                  placeholder="Month"
                  placeholderTextColor="#aaa"
                  value={month ? months[month - 1] : ''} // Map month number to month name
                  editable={false}
                  style={styles.pickerInput}
                />
              </View>
            </Pressable>

            {/* Day Picker */}
            <Pressable
              style={styles.pickerContainer}
              onPress={() => setIsDayModalVisible(true)}
            >
              <View pointerEvents="none">
                <TextInput
                  placeholder="Day"
                  placeholderTextColor="#aaa"
                  value={day ? day.toString() : ''}
                  editable={false}
                  style={styles.pickerInput}
                />
              </View>
            </Pressable>
          </View>

          {/* Year Modal */}
          <Modal
            visible={isYearModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsYearModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={years}
                  renderItem={renderYearItem}
                  keyExtractor={(item) => item.toString()}
                  numColumns={3}
                  contentContainerStyle={styles.grid}
                />
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setIsYearModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Month Modal */}
          <Modal
            visible={isMonthModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsMonthModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={months}
                  renderItem={renderMonthItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3}
                  contentContainerStyle={styles.grid}
                />
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setIsMonthModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* Day Modal */}
          <Modal
            visible={isDayModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsDayModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <FlatList
                  data={days}
                  renderItem={renderDayItem}
                  keyExtractor={(item) => item.toString()}
                  numColumns={7}
                  contentContainerStyle={styles.grid}
                />
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setIsDayModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* PIN */}
          <View style={styles.pinContainer}>
            <TextInput
              placeholder="Enter your PIN"
              placeholderTextColor="#aaa"
              secureTextEntry={!isPinVisible}
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              onChangeText={(text) => {
                if (/^\d*$/.test(text)) {
                  setPin(text);
                }
              }}
              style={styles.pinInput}
            />
            <Pressable onPress={() => setIsPinVisible(!isPinVisible)} style={styles.eyeIconContainer}>
              <MaterialIcons
                name={isPinVisible ? 'visibility-off' : 'visibility'}
                size={24}
                color="#aaa"
              />
            </Pressable>
          </View>

          {/* Confirm PIN */}
          <TextInput
            placeholder="Confirm your PIN"
            placeholderTextColor="#aaa"
            secureTextEntry={!isPinVisible}
            keyboardType="numeric"
            maxLength={4}
            value={confirmPin}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setConfirmPin(text);
              }
            }}
            style={styles.input}
          />

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <RNPickerSelect
              onValueChange={(value) => setRole(value)}
              items={roles}
              placeholder={{ label: 'Select Role', value: null, color: '#aaa' }}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: styles.roleInput,
                inputAndroid: styles.roleInput,
              }}
            />
          </View>

          {/* Submit Button */}
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>

          {/* Login Link */}
          <Link href="./Login" asChild>
            <Pressable>
              <Text style={styles.loginText}>Already have an account? Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
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
    color: '#2E7D32', // Dark green
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  pickerContainer: {
    width: '30%',
  },
  pickerInput: {
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%', // Ensure modal doesn't take up full screen
    alignItems: 'center',
  },
  grid: {
    justifyContent: 'center',
  },
  gridButton: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
  },
  selectedGridButton: {
    backgroundColor: '#2E7D32', // Dark green
    borderColor: '#2E7D32',
    
  },
  gridButtonText: {
    fontSize: 13,
    color: '#333',
    size:'10%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2E7D32', // Dark green
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  roleContainer: {
    width: '100%',
    marginBottom: 15,
  },
  roleInput: {
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
  button: {
    backgroundColor: '#2E7D32', // Dark green
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
  loginText: {
    marginTop: 20,
    color: '#2E7D32', // Dark green
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default SignIn;