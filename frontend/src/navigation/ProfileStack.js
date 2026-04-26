import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import UserAppointments from "../screens/UserAppointments";
import NotificationScreen from "../screens/NotificationScreen";
import Vdoc from "../screens/Vdoc";
import EditProfile from "../screens/EditProfile";
import ApplyDoctor from "../screens/ApplyDoctor";

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
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
        name="profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="allappointments"
        component={UserAppointments}
        options={{ title: "All Appointments" }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="Vdoc"
        component={Vdoc}
        options={{ title: "Virtual Doctor" }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="ApplyDoctor"
        component={ApplyDoctor}
        options={{ title: "Apply as Doctor" }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;