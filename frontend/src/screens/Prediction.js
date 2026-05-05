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

      // data.data is now a parsed JSON object from the backend
      if (data?.data?.doctorToConsult) {
        setupres(data.data.doctorToConsult);
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

          {/* Disease & Severity */}
          <View style={styles.diseaseRow}>
            <Text style={styles.diseaseName}>
              {responseData?.data?.possibleDisease || "Unknown"}
            </Text>
            {responseData?.data?.severity && (
              <View style={[styles.severityBadge, 
                responseData.data.severity === "Severe" && { backgroundColor: "#FEF2F2", borderColor: "#FECACA" },
                responseData.data.severity === "Moderate" && { backgroundColor: "#FFF7ED", borderColor: "#FED7AA" },
                responseData.data.severity === "Mild" && { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
              ]}>
                <Text style={[styles.severityText,
                  responseData.data.severity === "Severe" && { color: "#DC2626" },
                  responseData.data.severity === "Moderate" && { color: "#D97706" },
                  responseData.data.severity === "Mild" && { color: "#16A34A" },
                ]}>{responseData.data.severity}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {responseData?.data?.description && (
            <Text style={styles.resultText}>{responseData.data.description}</Text>
          )}

          {/* Immediate Steps */}
          {responseData?.data?.immediateSteps && responseData.data.immediateSteps.length > 0 && (
            <View style={styles.stepsBlock}>
              <Text style={styles.stepsTitle}>Immediate Steps</Text>
              {responseData.data.immediateSteps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Warning */}
          {responseData?.data?.warning && (
            <View style={styles.warningBlock}>
              <Text style={styles.warningText}>⚠️  {responseData.data.warning}</Text>
            </View>
          )}

          {/* Specialist Badge */}
          {(responseData?.data?.doctorToConsult || upres) && (
            <View style={styles.doctorBadge}>
              <Text style={styles.doctorBadgeLabel}>Recommended Specialist</Text>
              <Text style={styles.doctorBadgeValue}>
                {responseData?.data?.doctorToConsult || upres}
              </Text>
            </View>
          )}

          <View style={{ marginTop: theme.spacing.md }}>
            <CustomButton
              label={"Consult Now"}
              onPress={() =>
                navigation.navigate("consult", { doctor: responseData?.data?.doctorToConsult || upres || "" })
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
  diseaseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  diseaseName: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    marginLeft: theme.spacing.sm,
  },
  severityText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.xs,
  },
  stepsBlock: {
    marginTop: theme.spacing.md,
    backgroundColor: "#F8FAFC",
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  stepsTitle: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  stepNumber: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.surface,
    backgroundColor: theme.colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 20,
    marginRight: theme.spacing.sm,
    overflow: "hidden",
  },
  stepText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  warningBlock: {
    marginTop: theme.spacing.md,
    backgroundColor: "#FEF2F2",
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningText: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.sm,
    color: "#DC2626",
    lineHeight: 20,
  },
});

export default Prediction;
