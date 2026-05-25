import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Input from "../components/form/Input";
import CustomButton from "../components/form/CustomButton";
import Loader from "../components/general/Loader";
import axios from "axios";
import { IconButton } from "react-native-paper";
import { theme } from "../config/theme";

/**
 * ResetPassword screen component.
 * Verifies OTP and resets user password in the system.
 */
const ResetPassword = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all the fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/reset-password", {
        email,
        otp,
        newPassword,
      });
      setLoading(false);

      if (data.success) {
        Alert.alert(
          "Success",
          "Your password has been reset successfully! Please log in with your new password."
        );
        navigation.navigate("login");
      } else {
        Alert.alert("Error", data.message || "Failed to reset password.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reset password. Please check your verification code."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <IconButton icon="arrow-left" iconColor={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior="height" style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {email} and choose your new password.
          </Text>
        </View>

        {/* Input Fields */}
        <View style={{ marginTop: theme.spacing.sm }}>
          <Input
            label="Verification Code (OTP)"
            value={otp}
            setValue={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Input
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            secureTextEntry={true}
          />
          <Input
            label="Confirm New Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>

        {/* Action Button */}
        <View style={{ marginTop: theme.spacing.md }}>
          <CustomButton label={"Reset Password"} onPress={handleResetPassword} />
        </View>
      </KeyboardAvoidingView>

      {loading && <Loader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
    gap: theme.spacing.sm,
  },
  titleBlock: {
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxxl,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: 22,
  },
});

export default ResetPassword;
