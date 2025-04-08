import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';

export default function ExpertTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        tabBarStyle: { display: 'none' }, // Hide the tab bar (footer)
      }}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="index" // Default screen
        options={{
          title: 'Home', // Title for the tab
        }}
      />

      {/* Profile Screen */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile', // Title for the tab
        }}
      />

      {/* Posts Screen */}
      <Tabs.Screen
        name="posts"
        options={{
          title: 'Posts', // Title for the tab
        }}
      />

      {/* KYC Verification Screen */}
      <Tabs.Screen
        name="KYCVerification"
        options={{
          title: 'KYC Verification', // Title for the tab
        }}
      />
    </Tabs>
  );
}