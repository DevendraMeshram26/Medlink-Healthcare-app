import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl, Platform, StatusBar, TouchableOpacity, Alert } from "react-native";
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

  const updateStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.put(`/booking-status/${bookingId}`, { status });
      if (data.success) {
        Alert.alert("Success", data.message);
        getAppointments(); // Refresh the list
      }
    } catch (error) {
      alert("Failed to update status");
    }
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
              <View key={appt._id} style={styles.appointmentWrapper}>
                <AppointmentCard
                  PatientName={appt.patient?.name}
                  AppointmentTime={appt.appointment}
                  status={appt.status}
                  isDoctorView={true}
                />
                
                {appt.status === "pending" && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.acceptBtn]}
                      onPress={() => updateStatus(appt._id, "confirmed")}
                    >
                      <Text style={styles.actionBtnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.rejectBtn]}
                      onPress={() => updateStatus(appt._id, "rejected")}
                    >
                      <Text style={[styles.actionBtnText, { color: theme.colors.error }]}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {appt.status === "confirmed" && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.completeBtn]}
                      onPress={() => updateStatus(appt._id, "completed")}
                    >
                      <Text style={styles.actionBtnText}>Mark Completed</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
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
  appointmentWrapper: {
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  acceptBtn: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  rejectBtn: {
    backgroundColor: "#FFF1F2",
    borderColor: "#FECDD3",
  },
  completeBtn: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  actionBtnText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.surface,
  },
});
