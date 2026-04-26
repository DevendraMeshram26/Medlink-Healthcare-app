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

  const handleGallery = () => {};

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
      alert("Failed to analyze the image. Please try again.");
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
          <InfoRow label="Diet" value={foodData?.data?.diet || "N/A"} />

          {foodData?.data?.description && (
            <View style={styles.descriptionBlock}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>
                {foodData.data.description}
              </Text>
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
});
