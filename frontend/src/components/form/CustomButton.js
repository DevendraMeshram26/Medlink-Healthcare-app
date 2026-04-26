import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../config/theme";

/**
 * Primary action button with accessible touch target (48px minimum).
 * Uses the teal primary color from the design system.
 *
 * @param {Object} props
 * @param {string} props.label - Button text.
 * @param {Function} props.onPress - Callback on press.
 * @param {string} [props.variant="primary"] - "primary" | "outline" | "danger"
 */
const CustomButton = ({ label, onPress, variant = "primary" }) => {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.base,
        isPrimary && styles.primary,
        variant === "outline" && styles.outline,
        isDanger && styles.danger,
      ]}
    >
      <Text
        style={[
          styles.label,
          isPrimary && styles.primaryLabel,
          variant === "outline" && styles.outlineLabel,
          isDanger && styles.dangerLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  danger: {
    backgroundColor: theme.colors.error,
  },
  label: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
    letterSpacing: 0.3,
  },
  primaryLabel: {
    color: "#FFFFFF",
  },
  outlineLabel: {
    color: theme.colors.primary,
  },
  dangerLabel: {
    color: "#FFFFFF",
  },
});

export default CustomButton;