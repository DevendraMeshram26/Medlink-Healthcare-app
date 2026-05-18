import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "../components/form/CustomButton";
import { theme } from "../config/theme";
import { IconButton } from "react-native-paper";

/**
 * Doctor info/detail screen showing full profile of a doctor.
 */
const DoctorInfo = ({ route, navigation }) => {
  const { Itemid } = route.params;
  const [docData, setdocData] = useState();

  const getDocDetails = async (id) => {
    try {
      const { data } = await axios.get(`/get-doctor-profile?doctorId=${id}`);
      setdocData(data?.doctor);
    } catch (error) {
      alert("Failed to load doctor details.");
    }
  };

  useEffect(() => {
    getDocDetails(Itemid);
  }, []);

  const openingTime = docData?.info?.openingTime
    ? new Date(docData.info.openingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "09:00";
  const closingTime = docData?.info?.closingTime
    ? new Date(docData.info.closingTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "17:00";

  return (
    <ScrollView style={styles.container}>
      {/* Hero Card */}
      <View style={styles.heroCard}>
        <Image
          source={{
            uri:
              docData?.info?.profilepic ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRECWxY9RPTChUABfN3UAc73uSH6Gh2eiwewQ&usqp=CAU",
          }}
          style={styles.avatar}
        />
        <View style={styles.heroInfo}>
          <Text style={styles.doctorName}>
            {docData?.name || "Doctor Name"}
          </Text>
          <Text style={styles.specialization}>
            {docData?.info?.specialization || "Specialization"}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {docData?.info?.experience || "0"} yrs exp
              </Text>
            </View>
            <View style={[styles.badge, styles.ratingBadge]}>
              <Text style={styles.ratingText}>
                ⭐ {docData?.avgRating || 0} ({docData?.reviewCount || 0})
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.divider} />

        <InfoRow icon="email-outline" label="Email" value={docData?.email || "Not provided"} />
        <InfoRow icon="map-marker-outline" label="Address" value={docData?.info?.address || "Not provided"} />
        <InfoRow icon="card-account-details-outline" label="License" value={docData?.info?.licenseNumber || "Not provided"} />
        <InfoRow
          icon="cash"
          label="Consultation Fee"
          value={`₹ ${docData?.info?.feesPerConsultation || "N/A"}`}
          bold
        />
        <InfoRow
          icon="clock-outline"
          label="Mon - Fri"
          value={`${openingTime} - ${closingTime}`}
        />
        {docData?.info?.website && (
          <InfoRow icon="web" label="Website" value={docData.info.website} />
        )}
      </View>

      {/* Book Button */}
      <View style={styles.bookSection}>
        <CustomButton
          label="Book Appointment"
          onPress={() => navigation.navigate("Booking", { doctorId: Itemid })}
        />
      </View>

      <View style={{ height: theme.spacing.xxl }} />
    </ScrollView>
  );
};

/** Reusable info row */
const InfoRow = ({ icon, label, value, bold }) => (
  <View style={styles.infoRow}>
    <IconButton icon={icon} iconColor={theme.colors.primary} size={20} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, bold && styles.infoBold]}>
        {value}
      </Text>
    </View>
  </View>
);

export default DoctorInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Hero
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.radii.lg,
    backgroundColor: "#E2E8F0",
  },
  heroInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  doctorName: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
  },
  specialization: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    marginTop: 2,
    textTransform: "capitalize",
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: theme.spacing.sm,
  },
  badge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radii.full,
  },
  badgeText: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
  },
  ratingBadge: {
    backgroundColor: '#FFFBEB',
    marginLeft: theme.spacing.xs,
  },
  ratingText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.xs,
    color: '#D97706',
  },
  // Details
  detailsCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
    marginLeft: 4,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    marginTop: 1,
  },
  infoBold: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.primary,
  },
  bookSection: {
    marginTop: theme.spacing.lg,
  },
});
