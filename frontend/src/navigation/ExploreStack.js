import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Vdoc from "../screens/Vdoc";
import Explore from "../screens/Explore";
import Prediction from "../screens/Prediction";
import NutriSnap from "../screens/NutriSnap";
import ConsultationScreen from "../screens/ConsultationScreen";

const Stack = createNativeStackNavigator();

const ExploreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="aitools"
        component={Explore}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="prediction"
        component={Prediction}
        options={{ title: "Symptom Checker" }}
      />
      <Stack.Screen
        name="nutrisnap"
        component={NutriSnap}
        options={{ title: "NutriSnap" }}
      />
      <Stack.Screen
        name="Vdoc"
        component={Vdoc}
        options={{ title: "Virtual Doctor" }}
      />
      <Stack.Screen
        name="consult"
        component={ConsultationScreen}
        options={{ title: "Consult a Doctor" }}
      />
    </Stack.Navigator>
  );
};

export default ExploreStack;