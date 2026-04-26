import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { IconButton } from "react-native-paper";
import { theme } from "../config/theme";

/**
 * Explore screen — Feature Hub with rich cards for each AI-powered feature.
 * Replaces the old 3-button layout with visually engaging feature cards.
 */
const Explore = ({ navigation }) => {
  const features = [
    {
      id: "predict",
      icon: "brain",
      title: "AI Symptom Checker",
      subtitle: "Describe your symptoms and get an instant AI-powered analysis with specialist recommendations.",
      route: "prediction",
      color: theme.colors.primary,
      bgColor: theme.colors.primaryLight,
    },
    {
      id: "nutrisnap",
      icon: "camera",
      title: "NutriSnap",
      subtitle: "Take a photo of your food and instantly get calorie estimates, diet info, and nutritional analysis.",
      route: "nutrisnap",
      color: theme.colors.accent,
      bgColor: "#E0F2FE", // sky-100
    },
    {
      id: "vdoc",
      icon: "chat-processing",
      title: "Virtual Doctor",
      subtitle: "Chat with our AI medical assistant for personalized health advice, medication suggestions, and diet tips.",
      route: "Vdoc",
      color: "#8B5CF6", // violet-500
      bgColor: "#EDE9FE", // violet-100
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Page Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle}>Explore</Text>
          <Text style={styles.pageSubtitle}>
            Discover AI-powered tools to take control of your health
          </Text>
        </View>

        {/* Feature Cards */}
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(feature.route)}
          >
            <View style={[styles.iconCircle, { backgroundColor: feature.bgColor }]}>
              <IconButton icon={feature.icon} iconColor={feature.color} size={28} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
            </View>
            <IconButton icon="chevron-right" iconColor={theme.colors.textMuted} size={24} />
          </TouchableOpacity>
        ))}

        {/* Bottom Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={styles.tipText}>
            Tip: For the most accurate results, describe your symptoms in detail including duration and severity.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  headerBlock: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxxl,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    // Elevated
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: theme.radii.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF7ED", // amber-50
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: "#FED7AA", // amber-200
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  tipText: {
    flex: 1,
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: "#92400E", // amber-800
    lineHeight: 18,
  },
});

export default Explore;
