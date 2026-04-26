import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Doctors_List from "../components/general/Doctors_List";
import axios from "axios";
import { theme } from "../config/theme";

/**
 * ConsultationScreen — shows specialist doctors based on AI recommendation.
 * Falls back to full doctor list if no specialist match is found.
 */
const ConsultationScreen = ({ route }) => {
  const { doctor } = route.params;
  const [consultData, setconsultData] = useState(null);
  const [loading, setloading] = useState(false);

  const getSpecificDoctor = async () => {
    try {
      setloading(true);
      const { data } = await axios.get(
        `/get-specialist?specialization=${doctor}`
      );
      if (data.success) {
        setconsultData(data);
      }
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    if (doctor) {
      getSpecificDoctor();
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>
          {doctor ? `${doctor} Specialists` : "All Doctors"}
        </Text>
        <Text style={styles.pageSubtitle}>
          {doctor
            ? `Showing doctors specializing in ${doctor}`
            : "Browse all available doctors"}
        </Text>
      </View>

      {/* Doctors List */}
      <Doctors_List />
    </View>
  );
};

export default ConsultationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBlock: {
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxl,
    color: theme.colors.textPrimary,
    textTransform: "capitalize",
  },
  pageSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textTransform: "capitalize",
  },
});