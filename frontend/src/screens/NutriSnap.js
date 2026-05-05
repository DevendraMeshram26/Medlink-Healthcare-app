import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CameraModal from "../components/general/CameraModal";
import Loader from "../components/general/Loader";
import { IconButton } from "react-native-paper";
import { theme } from "../config/theme";

/**
 * NutriSnap screen — Take a photo of food and get nutritional analysis.
 * Redesigned with the teal palette, card-based results, and proper empty state.
 */
const NutriSnap = () => {
  const [showModal, setshowModal] = useState(false);
  const [image, setimage] = useState("");
  const [foodData, setfoodData] = useState(null);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    })();
  }, []);

  const handleCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "granted") {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setimage(result.assets[0].uri);
      }
      setshowModal(!showModal);
    }
  };

  const handleGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setimage(result.assets[0].uri);
      }
      setshowModal(false);
    } else {
      alert("Sorry, we need gallery permissions to make this work!");
    }
  };

  const uploadImage = async () => {
    try {
      setloading(true);
      const newImageUri = "file:///" + image.split("file:/").join("");
      const file = {
        name: newImageUri.split("/").pop(),
        uri: newImageUri,
        type: "image/jpeg",
      };
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post("/upload-file", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      setfoodData(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("NutriSnap Error:", error?.response?.data || error?.message);
      const msg = error?.response?.data?.message || error?.message || "Unknown error";
      alert(`Analysis failed: ${msg}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>NutriSnap</Text>
        <Text style={styles.pageSubtitle}>
          Snap a photo of your meal for instant nutritional analysis
        </Text>
      </View>

      {/* Upload Card */}
      <TouchableOpacity
        style={styles.uploadCard}
        activeOpacity={0.85}
        onPress={() => setshowModal(!showModal)}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <IconButton icon="camera-plus" iconColor={theme.colors.primary} size={40} />
            <Text style={styles.uploadText}>Tap to Take a Photo</Text>
            <Text style={styles.uploadSubtext}>or select from gallery</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Camera Modal */}
      <CameraModal
        handleCamera={handleCamera}
        handleGallery={handleGallery}
        showModal={showModal}
        setshowModal={setshowModal}
      />

      {/* Analyze Button */}
      {image && !foodData && (
        <TouchableOpacity
          style={styles.analyzeButton}
          activeOpacity={0.8}
          onPress={uploadImage}
        >
          <IconButton icon="magnify" iconColor="#FFFFFF" size={20} />
          <Text style={styles.analyzeButtonText}>Analyze Food</Text>
        </TouchableOpacity>
      )}

      {/* Results Card */}
      {foodData && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Nutritional Analysis</Text>
          <View style={styles.divider} />

          <InfoRow label="Name" value={foodData?.data?.Name || "Unknown"} />
          <InfoRow label="Status" value={foodData?.data?.status || "N/A"} />
          <InfoRow label="Est. Calories" value={foodData?.data?.est_calories || "N/A"} bold />

          {/* Macros Grid */}
          {foodData?.data?.macros && (
            <View style={styles.macrosSection}>
              <Text style={styles.macrosTitle}>Macronutrients</Text>
              <View style={styles.macrosGrid}>
                <MacroChip label="Protein" value={foodData.data.macros.protein} color="#10B981" />
                <MacroChip label="Carbs" value={foodData.data.macros.carbs} color="#0EA5E9" />
                <MacroChip label="Fats" value={foodData.data.macros.fats} color="#F59E0B" />
                <MacroChip label="Fiber" value={foodData.data.macros.fiber} color="#8B5CF6" />
                <MacroChip label="Sugar" value={foodData.data.macros.sugar} color="#F43F5E" />
              </View>
            </View>
          )}

          {/* Health Tip */}
          {foodData?.data?.healthTip && (
            <View style={styles.healthTipBlock}>
              <Text style={styles.healthTipLabel}>💡 Health Tip</Text>
              <Text style={styles.healthTipText}>{foodData.data.healthTip}</Text>
            </View>
          )}

          {/* Diet Suggestion */}
          {foodData?.data?.diet && (
            <View style={styles.descriptionBlock}>
              <Text style={styles.descriptionLabel}>Diet Suggestion</Text>
              <Text style={styles.descriptionText}>{foodData.data.diet}</Text>
            </View>
          )}

          {foodData?.data?.description && (
            <View style={{ marginTop: theme.spacing.sm }}>
              <Text style={styles.descriptionText}>{foodData.data.description}</Text>
            </View>
          )}
        </View>
      )}

      {loading && <Loader />}
      <View style={{ height: theme.spacing.xxl }} />
    </ScrollView>
  );
};

/** Reusable info row for the results card */
const InfoRow = ({ label, value, bold }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, bold && styles.infoBold]}>{value}</Text>
  </View>
);

/** Macro nutrient chip */
const MacroChip = ({ label, value, color }) => (
  <View style={[styles.macroChip, { borderColor: color + '30' }]}>
    <View style={[styles.macroDot, { backgroundColor: color }]} />
    <View>
      <Text style={styles.macroValue}>{value || 'N/A'}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  </View>
);

export default NutriSnap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBlock: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
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
  },
  // Upload Card
  uploadCard: {
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    minHeight: 200,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    borderRadius: theme.radii.lg,
    margin: 2,
  },
  uploadText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm,
  },
  uploadSubtext: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: theme.radii.lg,
  },
  // Analyze Button
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
    minHeight: 48,
  },
  analyzeButtonText: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
    color: "#FFFFFF",
    marginLeft: -4,
  },
  // Result Card
  resultCard: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    // Shadow
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
    backgroundColor: "#E2E8F0",
    marginVertical: theme.spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    flexShrink: 1,
    textAlign: "right",
    maxWidth: "60%",
  },
  infoBold: {
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.lg,
  },
  descriptionBlock: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  descriptionLabel: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  descriptionText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  macrosSection: {
    marginTop: theme.spacing.md,
  },
  macrosTitle: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  macrosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  macroChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    minWidth: "45%",
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  macroValue: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  macroLabel: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
  healthTipBlock: {
    marginTop: theme.spacing.md,
    backgroundColor: "#FFF7ED",
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  healthTipLabel: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: "#92400E",
    marginBottom: theme.spacing.xs,
  },
  healthTipText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: "#78350F",
    lineHeight: 20,
  },
});
