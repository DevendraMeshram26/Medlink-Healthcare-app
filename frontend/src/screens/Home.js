import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Platform, StatusBar as RNStatusBar } from "react-native";
import Carousal from "../components/general/Carousal";
import Doctors_List from "../components/general/Doctors_List";
import HomeHeader from "../components/home/HomeHeader";
import ActionCards from "../components/home/ActionCards";
import SpecialistList from "../components/home/SpecialistList";
import { APP_STRINGS } from "../config/constants";
import { theme } from "../config/theme";

/**
 * Main Home screen component.
 * Displays the greeting, action cards, specialists, and top doctors.
 *
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation prop.
 */
const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header Section */}
          <HomeHeader navigation={navigation} />

          {/* Carousel Section */}
          <View style={styles.carouselWrapper}>
            <Carousal />
          </View>

          {/* Action Cards Section */}
          <ActionCards navigation={navigation} />

          {/* Specialists List Section */}
          <SpecialistList />

          {/* Top Doctors Section */}
          <View style={styles.doctorsSection}>
            <View style={styles.doctorsHeader}>
              <Text style={styles.doctorsTitle}>
                {APP_STRINGS.HOME.TOP_DOCTORS}
              </Text>
              <Text
                style={styles.seeAll}
                onPress={() => navigation.navigate("Nearby")}
              >
                {APP_STRINGS.HOME.SEE_ALL}
              </Text>
            </View>
            <Doctors_List embedded={true} limit={3} />
          </View>

          <StatusBar hidden={false} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: theme.spacing.xxl,
  },
  carouselWrapper: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  doctorsSection: {
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    // Elevated card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  doctorsTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
  },
  seeAll: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
  },
});

export default Home;
