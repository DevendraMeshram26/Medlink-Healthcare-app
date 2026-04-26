import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import Input from "../components/form/Input";
import CustomButton from "../components/form/CustomButton";
import { Button } from "react-native-paper";
import Loader from "../components/general/Loader";
import { AuthContext } from "../state/AuthContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../config/theme";

/**
 * Login screen with email/password fields and social login options.
 * Redesigned with the teal medical palette and Inter typography.
 */
const Login = ({ navigation }) => {
  const [email, setemail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const { setislogin, setauthState } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!email || !password) {
        Alert.alert("Missing Fields", "Please fill in both email and password.");
        setLoading(false);
        return;
      }

      const { data } = await axios.post("/login", { email, password });

      await AsyncStorage.setItem("@auth", JSON.stringify(data));

      if (data.success) {
        setLoading(false);
        setauthState({
          Userid: data?.data?._id,
          name: data?.data?.name,
          email: data?.data?.email,
          token: data?.token,
          role: data?.data?.role || "user",
          doctorId: data?.data?.doctorId || null,
        });
        Alert.alert("Welcome Back!", data?.message);
        navigation.navigate("TabNavigation");
      }
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="height" style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your health journey</Text>
        </View>

        {/* Input Fields */}
        <View>
          <Input label="Email" value={email} setValue={setemail} />
          <Input
            label="Password"
            secureTextEntry={true}
            value={password}
            setValue={setPassword}
          />
        </View>

        {/* Sign In Button */}
        <View>
          <CustomButton label={"Sign In"} onPress={handleLogin} />
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
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

        {/* Register Link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && <Loader />}
    </View>
  );
};

export default Login;

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
    fontSize: theme.typography.sizes.xxxl,
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
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
  },
});
