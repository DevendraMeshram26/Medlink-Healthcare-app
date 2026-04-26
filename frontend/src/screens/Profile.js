import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../state/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton } from "react-native-paper";
import { theme } from "../config/theme";

/**
 * Profile screen with user avatar, menu items, and logout.
 * Non-functional items show a "Coming Soon" alert.
 */
const Profile = ({ navigation }) => {
  const { authState, setauthState } = useContext(AuthContext);
  const isDoctor = authState?.role === "doctor";

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("@auth");
          setauthState({ token: "", user: null });
          navigation.replace("login");
        },
      },
    ]);
  };

  const comingSoon = (feature) => {
    Alert.alert("Coming Soon", `${feature} will be available in a future update.`);
  };

  /** Menu items configuration */
  const menuItems = [
    {
      icon: "account-cog-outline",
      label: "Account Settings",
      onPress: () => comingSoon("Account Settings"),
    },
    {
      icon: "chat-outline",
      label: "Chats",
      subtitle: "Talk to your AI Doctor",
      onPress: () => navigation.navigate("Vdoc"),
    },
    {
      icon: "calendar-check-outline",
      label: "Appointments",
      subtitle: "View your bookings",
      onPress: () => navigation.navigate("allappointments"),
    },
    {
      icon: "information-outline",
      label: "About",
      onPress: () =>
        Alert.alert(
          "About Medlink",
          "Version 1.0.0\nBuilt with ❤️ by Devendra\n\nA modern AI-powered healthcare companion."
        ),
    },
    {
      icon: "stethoscope",
      label: "Apply as Doctor",
      onPress: () => navigation.navigate("ApplyDoctor"),
    },
  ].filter((item) => {
    // Hide 'Apply as Doctor' if already a doctor
    if (isDoctor && item.label === "Apply as Doctor") return false;
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.userName}>{authState?.name || "User"}</Text>
          <Text style={styles.userEmail}>{authState?.email || ""}</Text>
          {isDoctor && (
            <View style={styles.doctorBadge}>
              <Text style={styles.doctorBadgeText}>✓ Verified Doctor</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={styles.menuIconCircle}>
                <IconButton
                  icon={item.icon}
                  iconColor={theme.colors.primary}
                  size={22}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              <IconButton
                icon="chevron-right"
                iconColor={theme.colors.textMuted}
                size={20}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <IconButton icon="logout" iconColor={theme.colors.error} size={20} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Profile Header
  profileCard: {
    alignItems: "center",
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: theme.radii.xl,
    borderBottomRightRadius: theme.radii.xl,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: theme.radii.full,
    borderWidth: 3,
    borderColor: theme.colors.primaryLight,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  userName: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    textTransform: "capitalize",
  },
  userEmail: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  doctorBadge: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  doctorBadgeText: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
  },
  editButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
  },
  // Menu
  menuSection: {
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingRight: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9", // slate-100
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    flex: 1,
    marginLeft: 4,
  },
  menuLabel: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
  },
  menuSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: "#FFF1F2", // rose-50
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: "#FECDD3", // rose-200
  },
  logoutText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.error,
    marginLeft: -4,
  },
});
