import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { APP_STRINGS } from "../../config/constants";
import { theme } from "../../config/theme";

/**
 * ActionCards component with two feature cards for AI and Doctor Consultation.
 * Uses elevated card styling with the new teal/slate palette.
 *
 * @param {Object} props
 * @param {Object} props.navigation - React Navigation prop.
 */
const ActionCards = ({ navigation }) => {
  return (
    <View style={styles.row}>
      {/* Experience AI Card */}
      <TouchableOpacity
        style={[styles.card, styles.aiCard]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Explore")}
      >
        <View style={styles.iconCircle}>
          <IconButton icon="robot-outline" iconColor={theme.colors.primary} size={24} />
        </View>
        <Text style={styles.cardTitle}>
          {APP_STRINGS.HOME.EXPERIENCE_AI}
        </Text>
        <Text style={styles.cardTitle}>
          {APP_STRINGS.HOME.VIRTUAL_CONSULTATION}
        </Text>
        <Text style={styles.cardSubtitle}>
          {APP_STRINGS.HOME.AI_SUBTITLE_1}
        </Text>
        <Text style={styles.cardSubtitle}>
          {APP_STRINGS.HOME.AI_SUBTITLE_2}
        </Text>
        <View style={styles.cardButton}>
          <Text style={styles.cardButtonText}>{APP_STRINGS.HOME.BUTTON_EXPLORE}</Text>
        </View>
      </TouchableOpacity>

      {/* Specialized Doctor Card */}
      <TouchableOpacity
        style={[styles.card, styles.doctorCard]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("Nearby")}
      >
        <View style={styles.iconCircle}>
          <IconButton icon="stethoscope" iconColor={theme.colors.accent} size={24} />
        </View>
        <Text style={styles.cardTitle}>
          {APP_STRINGS.HOME.SPECIALIZED}
        </Text>
        <Text style={styles.cardTitle}>
          {APP_STRINGS.HOME.DOCTOR_CONSULTATION}
        </Text>
        <Text style={styles.cardSubtitle}>
          {APP_STRINGS.HOME.DOC_SUBTITLE_1}
        </Text>
        <View style={styles.cardButton}>
          <Text style={styles.cardButtonText}>{APP_STRINGS.HOME.BUTTON_CHECK}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  card: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    justifyContent: "space-between",
    minHeight: 260,
    // Subtle elevation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  aiCard: {
    backgroundColor: theme.colors.primaryLight,
  },
  doctorCard: {
    backgroundColor: "#E0F2FE", // sky-100
  },
  iconCircle: {
    backgroundColor: theme.colors.surface,
    width: 48,
    height: 48,
    borderRadius: theme.radii.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  cardButton: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.radii.md,
    alignItems: "center",
    marginTop: theme.spacing.md,
    // Subtle shadow on button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardButtonText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
});

export default ActionCards;
