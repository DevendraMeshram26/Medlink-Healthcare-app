import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../state/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/form/Input";
import CustomButton from "../components/form/CustomButton";
import Loader from "../components/general/Loader";
import axios from "axios";
import { theme } from "../config/theme";

/**
 * Edit Profile screen — allows users to update their name and email.
 */
const EditProfile = ({ navigation }) => {
  const { authState, setauthState } = useContext(AuthContext);
  const [name, setName] = useState(authState?.name || "");
  const [email, setEmail] = useState(authState?.email || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      if (!name && !email) {
        Alert.alert("Nothing to update", "Please change at least one field.");
        return;
      }

      setLoading(true);
      const { data } = await axios.put("/update-profile", { name, email });

      if (data.success) {
        // Update local auth state
        const updatedAuth = {
          ...authState,
          name: data.data.name,
          email: data.data.email,
        };
        setauthState(updatedAuth);

        // Update AsyncStorage
        const stored = await AsyncStorage.getItem("@auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.data.name = data.data.name;
          parsed.data.email = data.data.email;
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
});
