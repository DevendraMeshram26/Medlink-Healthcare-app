import { View, Text, ScrollView, RefreshControl, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Doctor_card from "./Doctor_card";
import SkeletonDoctorCard from "./SkeletonDoctorCard";
import axios from "axios";
import { theme } from "../../config/theme";

/**
 * Doctors_List component with pull-to-refresh and a friendly empty state.
 *
 * @param {Object} props
 * @param {boolean} [props.embedded=false] - If true, renders as a plain View
 *   (for embedding inside another ScrollView like the Home page).
 *   If false (default), renders inside its own ScrollView with pull-to-refresh.
 * @param {number} [props.limit] - Max number of doctors to show (for Home preview).
 */
const Doctors_List = ({ embedded = false, limit }) => {
  const [doctorsList, setdoctorsList] = useState();
  const [refreshing, setrefreshing] = useState(false);

  const getDoctors = async () => {
    try {
      const { data } = await axios.get("/get-doctors");
      setdoctorsList(data.doctors);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setdoctorsList([]);
      } else if (!embedded) {
        // Only show alert in standalone mode, not on Home page
        alert("Unable to fetch doctors. Please try again.");
      }
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const onRefresh = () => {
    setrefreshing(true);
    setTimeout(() => {
      getDoctors();
      setrefreshing(false);
    }, 2000);
  };

  // Apply limit if provided (e.g., show only top 3 on Home page)
  const displayList = limit && doctorsList
    ? doctorsList.slice(0, limit)
    : doctorsList;

  const renderContent = () => (
    <>
      {/* Loading Skeletons */}
      {!displayList && (
        <>
          <SkeletonDoctorCard />
          <SkeletonDoctorCard />
          <SkeletonDoctorCard />
        </>
      )}

      {/* Empty State */}
      {displayList && displayList.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👨‍⚕️</Text>
          <Text style={styles.emptyTitle}>No Doctors Found</Text>
          <Text style={styles.emptySubtitle}>
            {embedded
              ? "No doctors have registered yet."
              : "No doctors have registered yet. Pull down to refresh, or check back later."}
          </Text>
        </View>
      )}

      {/* Doctors List */}
      {displayList?.map((doc, index) => (
        <Doctor_card
          key={doc._id || index}
          name={doc.name}
          specialization={doc?.info?.specialization}
          id={doc._id}
          image={doc?.info?.profilepic}
        />
      ))}
    </>
  );

  // Embedded mode: render as plain View (no nested ScrollView)
  if (embedded) {
    return <View>{renderContent()}</View>;
  }

  // Standalone mode: render with ScrollView + pull-to-refresh
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={refreshing}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {renderContent()}
    </ScrollView>
  );
};

export default Doctors_List;

const styles = StyleSheet.create({
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
