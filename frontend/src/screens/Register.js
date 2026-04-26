import {
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Input from "../components/form/Input";
import CustomButton from "../components/form/CustomButton";
import { Button } from "react-native-paper";
import Loader from "../components/general/Loader";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { theme } from "../config/theme";

/**
 * Register screen with name, email, and password fields.
 * Redesigned with the teal medical palette and Inter typography.
 */
const Register = ({ navigation }) => {
  const [name, setname] = useState();
  const [email, setemail] = useState();
  const [password, setPassword] = useState();
  const [loading, setloading] = useState(false);

  const handleRegister = async () => {
    try {
      setloading(true);
      if (!name || !email || !password) {
        Alert.alert("Missing Fields", "Please fill in all the fields.");
        setloading(false);
        return;
      }

      const { data } = await axios.post("/register", { name, email, password });

      Alert.alert("Success!", "Your account has been created.");

      setname("");
      setemail("");
      setPassword("");
      navigation.navigate("login");
    } catch (error) {
      setloading(false);
      alert(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Hello!</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>
        </View>

        {/* Input Fields */}
        <View>
          <Input label="Name" value={name} setValue={setname} />
          <Input label="Email" value={email} setValue={setemail} />
          <Input
            label="Password"
            secureTextEntry={true}
            value={password}
            setValue={setPassword}
          />
        </View>

        {/* Sign Up Button */}
        <View>
          <CustomButton label={"Sign Up"} onPress={handleRegister} />
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign up with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <Button
            icon="google"
            mode="outlined"
            textColor={theme.colors.textPrimary}
            style={styles.socialButton}
          >
            Google
          </Button>
          <Button
            icon="facebook"
            mode="outlined"
            textColor={theme.colors.textPrimary}
            style={styles.socialButton}
          >
            Facebook
          </Button>
        </View>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && <Loader />}
      <StatusBar hidden={false} />
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.lg,
  },
  titleBlock: {
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: 40,
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginHorizontal: theme.spacing.md,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.md,
  },
  socialButton: {
    borderColor: "#E2E8F0",
    borderRadius: theme.radii.md,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
  },
});
