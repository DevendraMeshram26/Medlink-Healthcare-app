import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../state/AuthContext";
import Input from "../components/form/Input";
import CustomButton from "../components/form/CustomButton";
import Loader from "../components/general/Loader";
import axios from "axios";
import { theme } from "../config/theme";

/**
 * ApplyDoctor screen — multi-field form for users to apply as a doctor.
 * Step 1: Registers a doctor account
 * Step 2: Submits professional details
 */
const ApplyDoctor = ({ navigation }) => {
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Step 1: Registration fields
  const [password, setPassword] = useState("");

  // Step 2: Doctor details
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [fees, setFees] = useState("");
  const [website, setWebsite] = useState("");

  const handleApply = async () => {
    try {
      // Validate required fields
      if (!password || !specialization || !licenseNumber || !experience || !address || !fees) {
        Alert.alert("Missing Fields", "Please fill in all required fields.");
        return;
      }

      setLoading(true);

      // Step 1: Register doctor account
      const regResponse = await axios.post("/register-doctor", {
        name: authState.name,
        email: authState.email,
        password: password,
      });

      if (!regResponse.data.status) {
        // If already registered, proceed to step 2
        if (regResponse.status === 409) {
          // Already registered — continue to details
        } else {
          setLoading(false);
          alert(regResponse.data.message);
          return;
        }
      }

      // Step 2: Submit doctor details
      const detailsResponse = await axios.post("/apply-doctor", {
        email: authState.email,
        doctorInfo: {
          profilepic: "https://via.placeholder.com/150",
          licenseNumber,
          address,
          specialization,
          experience: parseInt(experience),
          feesPerConsultation: parseInt(fees),
          openingTime: new Date().setHours(9, 0, 0),
          closingTime: new Date().setHours(17, 0, 0),
          website: website || "",
          role: "doctor",
        },
      });

      setLoading(false);

      if (detailsResponse.data.success) {
        Alert.alert(
          "Application Submitted! 🎉",
          "Your doctor application has been submitted for review. You will be notified once approved.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      setLoading(false);
      const msg = error.response?.data?.message || "Something went wrong";
      // If already registered as doctor, try submitting details only
      if (msg.includes("already")) {
        Alert.alert("Note", msg);
      } else {
        alert(msg);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>Apply as Doctor</Text>
        <Text style={styles.pageSubtitle}>
          Fill in your professional details to join our network of medical professionals
        </Text>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoEmoji}>ℹ️</Text>
        <Text style={styles.infoText}>
          Applying with: {authState?.name} ({authState?.email})
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Security</Text>
        <Input
          label="Create a Doctor Password *"
          secureTextEntry={true}
          value={password}
          setValue={setPassword}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Details</Text>
        <Input
          label="Specialization * (e.g., Cardiologist)"
          value={specialization}
          setValue={setSpecialization}
        />
        <Input
          label="License Number *"
          value={licenseNumber}
          setValue={setLicenseNumber}
        />
        <Input
          label="Years of Experience *"
          value={experience}
          setValue={setExperience}
          keyboardType="numeric"
        />
        <Input
          label="Consultation Fees (₹) *"
          value={fees}
          setValue={setFees}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact & Location</Text>
        <Input
          label="Clinic Address *"
          value={address}
          setValue={setAddress}
          multiline={true}
          numberOfLines={2}
        />
        <Input
          label="Website (optional)"
          value={website}
          setValue={setWebsite}
          keyboardType="url"
        />
      </View>

      {/* Submit */}
      <View style={styles.submitSection}>
        <CustomButton label="Submit Application" onPress={handleApply} />
        <CustomButton
          label="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>

      {loading && <Loader />}
    </ScrollView>
  );
};

export default ApplyDoctor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBlock: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
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
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryLight,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  submitSection: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
});
