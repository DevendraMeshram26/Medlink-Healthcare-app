import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../config/theme";

const { width } = Dimensions.get("window");
const ONBOARDING_KEY = "@onboarding_complete";

/**
 * Onboarding screen — shown only on first app launch.
 * Uses the app's teal palette and updated copy to match "Medlink" branding.
 */
const InitialScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has already seen onboarding
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (seen) {
        navigation.replace("register");
      } else {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleDone = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    navigation.navigate("register");
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    navigation.replace("register");
  };

  if (loading) return null;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar animated={true} backgroundColor={theme.colors.primary} hidden={true} />
      <Onboarding
        containerStyles={{ paddingHorizontal: 20 }}
        titleStyles={styles.title}
        subTitleStyles={styles.subtitle}
        onDone={handleDone}
        onSkip={handleSkip}
        pages={[
          {
            backgroundColor: "#0F766E", // teal-700
            image: (
              <View>
                <LottieView
                  source={require("../../assets/animations/Doc1.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Welcome to Medlink",
            subtitle: "Your AI-powered healthcare companion — always in your pocket",
          },
          {
            backgroundColor: "#0D9488", // teal-600
            image: (
              <View>
                <LottieView
                  source={require("../../assets/animations/Doc2.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "AI Symptom Checker",
            subtitle:
              "Describe your symptoms and get instant AI-powered analysis with specialist recommendations",
          },
          {
            backgroundColor: "#14B8A6", // teal-500
            image: (
              <View>
                <LottieView
                  source={require("../../assets/animations/MultiTask.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>
            ),
            title: "Smart Health Hub",
            subtitle:
              "NutriSnap food analysis, Virtual Doctor chat, and easy appointment booking — all in one app",
          },
        ]}
      />
    </View>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({
  lottie: {
    width: width * 0.9,
    height: width,
  },
  title: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxl,
    color: "#FFFFFF",
  },
  subtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.base,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});