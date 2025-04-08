import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        tabBarStyle: { display: "none" }, // Hide the tab bar (footer)
      }}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="Home" // Corresponds to Home.js
        options={{
          title: "Home", // Title for the tab
        }}
      />

      {/* KYC by Admin Screen */}
      <Tabs.Screen
        name="Kycbyadmin" // Corresponds to Kycbyadmin.js
        options={{
          title: "KYC by Admin", // Title for the tab
        }}
      />

      {/* User Experts Screen */}
      <Tabs.Screen
        name="UserExperts" // Corresponds to UserExperts.js
        options={{
          title: "User Experts", // Title for the tab
        }}
      />

      {/* Verified Experts Screen */}
      <Tabs.Screen
        name="VerifiedExperts" // Corresponds to VerifiedExperts.js
        options={{
          title: "Verified Experts", // Title for the tab
        }}
      />
    </Tabs>
  );
}