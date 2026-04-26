import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { APP_STRINGS } from "../../config/constants";
import { doctors_category } from "../../config/Doc_Category";
import { theme } from "../../config/theme";

/**
 * SpecialistList component rendering an animated horizontal list of doctor categories.
 * Uses elevated card styling and proper spacing from the design system.
 */
const SpecialistList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{APP_STRINGS.HOME.OUR_SPECIALISTS}</Text>
      <View style={styles.listWrapper}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={doctors_category}
          renderItem={({ item }) => (
            <View style={styles.categoryCircle}>
              <LottieView
                style={{ height: 100, width: 100 }}
                source={item.path}
                autoPlay
                loop
              />
            </View>
          )}
          horizontal={true}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    // Elevated card look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  listWrapper: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  categoryCircle: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radii.full,
    height: 80,
    width: 80,
    marginHorizontal: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SpecialistList;
