import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../state/AuthContext";
import { theme } from "../config/theme";

/**
 * Admin Dashboard
 * Shows pending doctor applications for admin review.
 */
const AdminDashboard = () => {
  const { authState } = useContext(AuthContext);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPendingDoctors = async () => {
    try {
      const { data } = await axios.get("/admin/pending-doctors");
      setPendingDoctors(data?.doctors || []);
    } catch (error) {
      // Silently handle - empty list is fine
      setPendingDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (doctorId, doctorName) => {
    Alert.alert(
      "Approve Doctor",
      `Are you sure you want to verify Dr. ${doctorName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          style: "default",
          onPress: async () => {
            try {
              await axios.put(`/admin/approve-doctor/${doctorId}`);
              Alert.alert("Success ✅", `Dr. ${doctorName} has been approved!`);
              fetchPendingDoctors();
            } catch (error) {
              Alert.alert("Error", "Failed to approve doctor.");
            }
          },
        },
      ]
    );
  };

  const handleReject = (doctorId, doctorName) => {
    Alert.alert(
      "Reject Application",
      `Are you sure you want to reject Dr. ${doctorName}'s application? This will remove their record.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.put(`/admin/reject-doctor/${doctorId}`);
              Alert.alert("Done", "Application rejected.");
              fetchPendingDoctors();
            } catch (error) {
              Alert.alert("Error", "Failed to reject doctor.");
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPendingDoctors().then(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Admin Panel</Text>
        <Text style={styles.subtitle}>
          Review and manage doctor applications
        </Text>
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
        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pendingDoctors.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {pendingDoctors.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>All Clear!</Text>
            <Text style={styles.emptySubtitle}>
              No pending doctor applications to review. Pull down to refresh.
            </Text>
          </View>
        ) : (
          pendingDoctors.map((doc) => (
            <View key={doc._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {doc.name?.charAt(0)?.toUpperCase() || "D"}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>Dr. {doc.name}</Text>
                  <Text style={styles.cardSpecialization}>
                    {doc.specialization}
                  </Text>
                  <Text style={styles.cardDetail}>
                    {doc.experience} yrs exp • License: {doc.licenseNumber}
                  </Text>
                </View>
              </View>

              <View style={styles.cardMeta}>
                <Text style={styles.metaLabel}>Email</Text>
                <Text style={styles.metaValue}>{doc.email}</Text>
              </View>
              <View style={styles.cardMeta}>
                <Text style={styles.metaLabel}>Fees</Text>
                <Text style={styles.metaValue}>
                  ₹{doc.feesPerConsultation}
                </Text>
              </View>
              <View style={styles.cardMeta}>
                <Text style={styles.metaLabel}>Timings</Text>
                <Text style={styles.metaValue}>
                  {doc.openingTime} – {doc.closingTime}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleReject(doc._id, doc.name)}
                >
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleApprove(doc._id, doc.name)}
                >
                  <Text style={styles.approveBtnText}>Approve ✓</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;

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
  statsBar: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxxl,
    color: theme.colors.warning,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
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
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.primary,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
    textTransform: "capitalize",
  },
  cardSpecialization: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    textTransform: "capitalize",
    marginTop: 2,
  },
  cardDetail: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  metaLabel: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
  metaValue: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  approveBtn: {
    backgroundColor: theme.colors.primary,
  },
  approveBtnText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: "#FFFFFF",
  },
  rejectBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  rejectBtnText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
  },
});
