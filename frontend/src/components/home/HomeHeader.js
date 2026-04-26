import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { APP_STRINGS } from "../../config/constants";
import { theme } from "../../config/theme";

/**
 * HomeHeader with greeting, subtitle, and notification bell.
 * Uses Inter font and the new teal palette for a clinical, professional feel.
 *
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation prop.
 */
const HomeHeader = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>{APP_STRINGS.HOME.GREETING}</Text>
        <Text style={styles.subtitle}>{APP_STRINGS.HOME.SUBTITLE}</Text>
      </View>
      <TouchableOpacity
        style={styles.bellContainer}
        onPress={() => navigation.navigate("Notification")}
        activeOpacity={0.7}
      >
        <IconButton
          icon="bell-outline"
          iconColor={theme.colors.primary}
          size={22}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  bellContainer: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radii.full,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeHeader;
