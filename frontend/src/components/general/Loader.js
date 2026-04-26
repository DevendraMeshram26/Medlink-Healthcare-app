import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { theme } from "../../config/theme";

/**
 * Full-screen overlay loader with heartbeat animation.
 * Used during async operations (login, file upload, etc.).
 */
const Loader = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <LottieView
        source={require("../../../assets/animations/HeartBeat.json")}
        autoPlay
        style={styles.lottie}
      />
      <Text style={styles.text}>Please wait...</Text>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  lottie: {
    height: 100,
    width: 200,
  },
  text: {
    fontFamily: theme.typography.fontFamilies.medium,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.primary,
  },
});