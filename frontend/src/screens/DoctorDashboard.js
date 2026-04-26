import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Platform, StatusBar } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../state/AuthContext";
import AppointmentCard from "../components/general/AppointmentCard";
import { theme } from "../config/theme";

/**
 * Doctor Dashboard
 * Shows upcoming appointments and patient requests for verified doctors.
 */
const DoctorDashboard = () => {
  const { authState } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAppointments = async () => {
    try {
      if (!authState?.doctorId) return;
      const { data } = await axios.get(`/get-appointment?doctorId=${authState.doctorId}`);
      setAppointments(data?.bookings || []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAppointments([]);
      } else {
        alert("Failed to load appointments");
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getAppointments();
      setRefreshing(false);
    }, 2000);
  };

  useEffect(() => {
    getAppointments();
  }, [authState?.doctorId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome, Dr. {authState?.name}</Text>
        <Text style={styles.subtitle}>Here is your schedule for today</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {appointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No Appointments Yet</Text>
            <Text style={styles.emptySubtitle}>
              When patients book a consultation with you, it will appear here.
              Pull down to refresh.
            </Text>
          </View>
        ) : (
          <View style={{ paddingBottom: theme.spacing.xxl }}>
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                PatientName={appt.patient?.name}
                AppointmentTime={appt.appointment}
                isDoctorView={true}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DoctorDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  greeting: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.textPrimary,
    textTransform: "capitalize",
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
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
