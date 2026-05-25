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
 * ForgotPassword screen component.
 * Prompts user for email and requests password reset OTP code.
 */
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/forgot-password", { email });
      setLoading(false);

      if (data.success) {
        Alert.alert(
          "Verification Code Sent",
          "A 6-digit verification code has been sent to your email. Check your spam folder if you do not receive it shortly."
        );
        navigation.navigate("resetpassword", { email });
      } else {
        Alert.alert("Error", data.message || "Failed to send verification code.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to initiate password reset."
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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address to receive a 6-digit verification code.
          </Text>
        </View>

        {/* Input Fields */}
        <View style={{ marginTop: theme.spacing.md }}>
          <Input
            label="Email Address"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Action Button */}
        <View style={{ marginTop: theme.spacing.md }}>
          <CustomButton label={"Send Verification Code"} onPress={handleSendOTP} />
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
    paddingBottom: 80,
    gap: theme.spacing.md,
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

export default ForgotPassword;
