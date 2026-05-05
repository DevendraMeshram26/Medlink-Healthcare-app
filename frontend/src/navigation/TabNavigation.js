import { View, Text } from "react-native";
import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../state/AuthContext";
import ExploreStack from "./ExploreStack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import NearbyStack from "./NearbyStack";
import ProfileStack from "./ProfileStack";
import HomeStack from "./HomeStack";
import DoctorDashboard from "../screens/DoctorDashboard";
import AdminDashboard from "../screens/AdminDashboard";
import { theme } from "../config/theme";

const BottomTabs = createBottomTabNavigator();

const TabNavigation = () => {
  const { authState } = useContext(AuthContext);
  const isDoctor = authState?.role === "doctor";
  const isAdmin = authState?.role === "admin";
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: "#E2E8F0",
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamilies.medium,
          fontSize: 11,
        },
      }}
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      {isAdmin ? (
        <BottomTabs.Screen
          name="Admin"
          component={AdminDashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="shield-check" size={size} color={color} />
            ),
          }}
        />
      ) : isDoctor ? (
        <BottomTabs.Screen
          name="Dashboard"
          component={DoctorDashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
            ),
          }}
        />
      ) : (
        <BottomTabs.Screen
          name="Explore"
          component={ExploreStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="compass" size={size} color={color} />
            ),
          }}
        />
      )}
      <BottomTabs.Screen
        name="Nearby"
        component={NearbyStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default TabNavigation;
