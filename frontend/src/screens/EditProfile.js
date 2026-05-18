import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../state/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/form/Input";
import CustomButton from "../components/form/CustomButton";
import Loader from "../components/general/Loader";
import axios from "axios";
import { theme } from "../config/theme";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Edit Profile screen — allows users to update their name and email.
 */
const EditProfile = ({ navigation }) => {
  const { authState, setauthState } = useContext(AuthContext);
  const [name, setName] = useState(authState?.name || "");
  const [email, setEmail] = useState(authState?.email || "");
  const [image, setImage] = useState(authState?.profilePicture || null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!name && !email && !image) {
        Alert.alert("Nothing to update", "Please change at least one field.");
        return;
      }

      setLoading(true);
      
      let updatedPicUrl = authState?.profilePicture;

      // If user selected a new image (it will be a local file URI)
      if (image && image !== authState?.profilePicture) {
        const formData = new FormData();
        formData.append("userId", authState.Userid);
        
        // Match the format required by multer
        const filename = image.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        
        formData.append("image", {
          uri: image,
          name: filename,
          type
        });

        const uploadRes = await axios.post("/upload-avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadRes.data.success) {
          updatedPicUrl = uploadRes.data.data.profilePicture;
        }
      }

      const { data } = await axios.put("/update-profile", { name, email });

      if (data.success) {
        // Update local auth state
        const updatedAuth = {
          ...authState,
          name: data.data.name,
          email: data.data.email,
          profilePicture: updatedPicUrl,
        };
        setauthState(updatedAuth);

        // Update AsyncStorage
        const stored = await AsyncStorage.getItem("@auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.data.name = data.data.name;
          parsed.data.email = data.data.email;
          parsed.data.profilePicture = updatedPicUrl;
          await AsyncStorage.setItem("@auth", JSON.stringify(parsed));
        }

        setLoading(false);
        Alert.alert("Success", "Your profile has been updated.");
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={styles.content}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle}>Edit Profile</Text>
          <Text style={styles.pageSubtitle}>
            Update your personal information
          </Text>
        </View>

        {/* Avatar Picker */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="camera-plus" size={32} color={theme.colors.primary} />
              </View>
            )}
            <View style={styles.editBadge}>
              <MaterialCommunityIcons name="pencil" size={16} color={theme.colors.surface} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        <View>
          <Input label="Name" value={name} setValue={setName} />
          <Input
            label="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <CustomButton label="Save Changes" onPress={handleUpdate} />
          <CustomButton
            label="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
          />
        </View>
      </KeyboardAvoidingView>
      {loading && <Loader />}
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.xl,
  },
  headerBlock: {
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
  },
  actions: {
    gap: theme.spacing.sm,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: theme.spacing.md,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
});
