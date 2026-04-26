import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import Input from "../components/form/Input";
import Loader from "../components/general/Loader";
import CustomButton from "../components/form/CustomButton";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { theme } from "../config/theme";

/**
 * Prediction screen where users describe symptoms and receive an AI-powered
 * disease prediction from the Groq backend.
 */
const Prediction = ({ navigation, route }) => {
  const [loading, setloading] = useState(false);
  const [responseData, setresponseData] = useState();
  const [symptoms, setsymptoms] = useState();
  const [upres, setupres] = useState();

  const handlePrediction = async () => {
    try {
      setloading(true);
      const { data } = await axios.post("/prediction", { symptoms });
      const stringData = data?.data;
      const responseString = stringData;

      // Extract doctor recommendation from AI response
      const doctorRegex = /Doctor To Consult: (\w+)/;
      const match = responseString.match(doctorRegex);

      if (match) {
        const doctor = match[1];
        setupres(doctor);
      }

      if (data) {
        setresponseData(data);
        setloading(false);
      }
    } catch (error) {
      setloading(false);
      alert(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Describe Your Symptoms</Text>
      <Text style={styles.pageSubtitle}>
        Tell us what you're experiencing and our AI will analyze your symptoms.
      </Text>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Input
          label={"Enter Your Problem"}
          multiline={true}
          numberOfLines={4}
          value={symptoms}
          setValue={setsymptoms}
        />
        <CustomButton label={"Predict"} onPress={handlePrediction} />
      </View>

      {/* Results Card */}
      {responseData && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>AI Analysis</Text>
          <View style={styles.divider} />
          <Text style={styles.resultText}>{responseData?.data}</Text>

          {upres && (
            <View style={styles.doctorBadge}>
              <Text style={styles.doctorBadgeLabel}>Recommended Specialist</Text>
              <Text style={styles.doctorBadgeValue}>{upres}</Text>
            </View>
          )}

          <View style={{ marginTop: theme.spacing.md }}>
            <CustomButton
              label={"Consult Now"}
              onPress={() =>
                navigation.navigate("consult", { doctor: upres ? upres : "" })
              }
            />
          </View>
        </View>
      )}

      {/* Empty state hint */}
      {!responseData && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🩺</Text>
          <Text style={styles.emptyTitle}>No Analysis Yet</Text>
          <Text style={styles.emptySubtitle}>
            Enter your symptoms above and tap "Predict" to get an AI-powered analysis.
          </Text>
        </View>
      )}

      {loading && <Loader />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.lg,
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxxl,
    color: theme.colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    marginHorizontal: theme.spacing.xl,
    lineHeight: 20,
  },
  inputSection: {
    marginTop: theme.spacing.lg,
  },
  resultCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    // Elevated card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  resultTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0", // slate-200
    marginVertical: theme.spacing.md,
  },
  resultText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  doctorBadge: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  doctorBadgeLabel: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  doctorBadgeValue: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.primary,
    marginTop: 4,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
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

export default Prediction;
