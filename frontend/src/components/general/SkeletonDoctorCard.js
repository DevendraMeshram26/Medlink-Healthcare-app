import { View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { theme } from "../../config/theme";

/**
 * Animated skeleton loader for Doctor cards.
 * Provides a shimmer effect while data is fetching.
 */
const SkeletonDoctorCard = () => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        <Animated.View style={[styles.avatar, { opacity: animatedValue }]} />
        <View style={styles.infoBlock}>
          <Animated.View style={[styles.title, { opacity: animatedValue }]} />
          <Animated.View style={[styles.subtitle, { opacity: animatedValue }]} />
          <Animated.View style={[styles.badge, { opacity: animatedValue }]} />
        </View>
        <View style={styles.chevronBlock}>
          <Animated.View style={[styles.chevron, { opacity: animatedValue }]} />
        </View>
      </View>
    </View>
  );
};

export default SkeletonDoctorCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    // Base shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: theme.radii.full,
    backgroundColor: "#E2E8F0", // slate-200
  },
  infoBlock: {
    flex: 1,
    marginLeft: theme.spacing.md,
    justifyContent: "center",
  },
  title: {
    height: 18,
    width: "60%",
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    height: 14,
    width: "40%",
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  badge: {
    height: 20,
    width: "30%",
    backgroundColor: "#E2E8F0",
    borderRadius: theme.radii.full,
  },
  chevronBlock: {
    justifyContent: "center",
    paddingLeft: theme.spacing.sm,
  },
  chevron: {
    width: 24,
    height: 24,
    borderRadius: theme.radii.full,
    backgroundColor: "#E2E8F0",
  },
});
