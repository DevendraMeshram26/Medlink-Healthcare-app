import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { theme } from "../../config/theme";

const AppointmentCard = ({
  Doctor,
  PatientName,
  specialization,
  AppointmentTime,
  status = "pending",
  isDoctorView = false,
}) => {
  // Format the date if it's a valid date string
  const formattedTime = new Date(AppointmentTime).toLocaleString();

  const getStatusColor = () => {
    switch (status) {
      case "confirmed": return theme.colors.success;
      case "rejected": return theme.colors.error;
      case "completed": return theme.colors.primary;
      default: return theme.colors.warning;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>📅</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            {isDoctorView ? `Patient: ${PatientName}` : `Dr. ${Doctor}`}
          </Text>
          {!isDoctorView && specialization && (
            <Text style={styles.subtitle}>{specialization}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.timeBlock}>
        <Text style={styles.timeLabel}>Appointment Time</Text>
        <Text style={styles.timeValue}>{formattedTime}</Text>
      </View>
    </View>
  );
};

export default AppointmentCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textTransform: "capitalize",
    marginTop: 2,
  },
  timeBlock: {
    backgroundColor: "#F8FAFC",
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeLabel: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  timeValue: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  statusText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.xs,
  },
});