import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Hospital_List from "../components/general/Hospital_List";
import Doctors_List from "../components/general/Doctors_List";
import { theme } from "../config/theme";
import { IconButton } from "react-native-paper";

/**
 * Nearby screen with tabbed view for Doctors and Hospitals.
 * Includes a search bar for filtering by name.
 */
const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={styles.tabIndicator}
    style={styles.tabBar}
    labelStyle={styles.tabLabel}
    activeColor={theme.colors.primary}
    inactiveColor={theme.colors.textMuted}
  />
);

const renderScene = SceneMap({
  doctors: Doctors_List,
  hospitals: Hospital_List,
});

const Nearby = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [routes] = useState([
    { key: "doctors", title: "Doctors" },
    { key: "hospitals", title: "Hospitals" },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Nearby</Text>
        <Text style={styles.headerSubtitle}>
          Browse doctors and hospitals in your area
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <IconButton
          icon="magnify"
          iconColor={theme.colors.textMuted}
          size={20}
          style={{ marginLeft: -4 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or specialization..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close-circle"
            iconColor={theme.colors.textMuted}
            size={18}
            onPress={() => setSearchQuery("")}
          />
        )}
      </View>

      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        swipeEnabled={true}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

export default Nearby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabIndicator: {
    backgroundColor: theme.colors.primary,
    height: 3,
    borderRadius: 2,
  },
  tabLabel: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    textTransform: "none",
  },
});