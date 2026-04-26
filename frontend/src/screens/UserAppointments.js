import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../state/AuthContext";
import AppointmentCard from "../components/general/AppointmentCard";
import { theme } from "../config/theme";

/**
 * UserAppointments screen showing all booked appointments.
 * Includes a friendly empty state when no appointments are found
 * and pull-to-refresh functionality.
 */
const UserAppointments = () => {
  const { authState } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setrefreshing] = useState(false);

  const userID = authState?.Userid;

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`/get-booking?userId=${userID}`);
      setAppointments(data?.bookings || []);
    } catch (error) {
      alert("Unable to fetch appointments. Please try again.");
    }
  };

  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      getAllAppointments();
      setrefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      <Text style={styles.pageTitle}>Your Appointments</Text>
      <Text style={styles.pageSubtitle}>
        {appointments.length > 0
          ? `You have ${appointments.length} upcoming appointment${appointments.length > 1 ? "s" : ""}`
          : "Pull down to refresh"}
      </Text>

      {appointments.length === 0 ? (
        /* Friendly Empty State */
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Appointments Yet</Text>
          <Text style={styles.emptySubtitle}>
            When you book an appointment with a doctor, it will appear here.
            Pull down to refresh.
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              Doctor={appointment.doctor?.name}
              AppointmentTime={appointment?.appointment}
              specialization={appointment?.doctor?.info?.specialization}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default UserAppointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.lg,
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
});
