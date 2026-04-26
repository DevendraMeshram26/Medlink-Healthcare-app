import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

axios.defaults.baseURL = "http://192.168.10.109:6969/api/v1";
// axios.defaults.headers.common["Authorization"] = `Bearer ${authState.token}`
export const AuthProvider = ({ children }) => {
  const [authState, setauthState] = useState({
    user: null,
    token: "",
  });

  const getUserData = async () => {
    let data = await AsyncStorage.getItem("@auth");
    let loginData = JSON.parse(data);
    setauthState({
      ...authState,
      user: loginData?.user,
      token: loginData?.token,
    });
  };

  useEffect(() => {
    console.log("user data fetching");
    getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setauthState }}>
      {children}
    </AuthContext.Provider>
  );
};
import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { AuthContext } from '../state/AuthContext';

const Stack= createNativeStackNavigator()

const Routes = () => {
const{authState} = useContext(AuthContext)
const authenticateduser= authState?.token
console.log("is user sigin",authenticateduser);
  
  return (
   <NavigationContainer>
   <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName={ authenticateduser ? (MainStack):(AuthStack)}>
   {authenticateduser ? MainStack(Stack):AuthStack(Stack)}


   

   </Stack.Navigator>
   
   </NavigationContainer>
  )
}

export default Routes

import {
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    View,
  } from "react-native";
  import React, { useContext, useState } from "react";
  import Input from "../components/form/Input";
  import CustomButton from "../components/form/CustomButton";
  import { Button } from "react-native-paper";
  import Loader from "../components/general/Loader";
  import { AuthContext } from "../state/AuthContext";
  import axios from "axios";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const Login = ({ navigation }) => {
    const [email, setemail] = useState();
    const [password, setPassword] = useState();
    const [loading, setloading] = useState(false);
    const { setislogin } = useContext(AuthContext);
  
    const handleLogin = async () => {
      try {
        setloading(true);
  
        if (!email || !password) {
          Alert.alert("Please fill all the fields");
          setloading(false);
        }
        const { data } = await axios.post("/login", { email, password });
        await AsyncStorage.setItem("@auth", JSON.stringify(data));
        Alert.alert("User login success", data?.message);
  
      
  
        console.log("all data ", data);
        console.log("Token ", data.token);
  
        setemail("");
        setPassword("");
        // setislogin(true);
        setloading(false)
        navigation.navigate("home");
      } catch (error) {
        alert(error.response.data.message)
        console.log(error);
        setloading(false)
  
      }
    };
  
    return (
      <View className="flex-1  ">
        <KeyboardAvoidingView behavior="height" className="flex-1 justify-evenly">
          <View className="">
            <Text className="text-4xl ml-8 font-semibold mb-4">
              Welcome Back !
            </Text>
            <Text className="text-3xl ml-8  ">Sign In Now</Text>
          </View>
          <View>
            <Input label="Email" value={email} setValue={setemail} />
            <Input
              label="Password"
              secureTextEntry={true}
              value={password}
              setValue={setPassword}
            />
          </View>
  
          <View>
            <CustomButton label={"Sign In"} onPress={handleLogin} />
          </View>
          <View>
            <Text className="text-center mt-2 text-gray-500 font-bold opacity-70 ">
              -----Or Sign In with-----
            </Text>
          </View>
          <View className="flex flex-row justify-evenly items-center">
            <Button icon="google" mode="outlined" textColor="#070F2B">
              Google
            </Button>
            <Button
              icon="facebook"
              mode="outlined"
              textColor="#070F2B"
              onPress={() => console.log("Pressed")}
            >
              Facebook
            </Button>
          </View>
          <Text className="text-center mt-2 text-gray-500 font-bold opacity-70">
            Not user yet ?{" "}
            <Text onPress={() => navigation.navigate("register")}>Register </Text>
          </Text>
          {loading && <Loader />}
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default Login;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  import { View, Text } from 'react-native'
import React from 'react'
import Home from '../screens/Home'
import Nearby from '../screens/Nearby'
import Profile from '../screens/Profile'
import TabRoutes from './TabRoutes'
import Vdoc from '../screens/Vdoc'
import ExploreStack from './ExploreStack'

const MainStack = (Stack) => {
  return (
 <>
 <Stack.Screen name="bottomTabs" component={TabRoutes} />

 
 </>
  )
}

export default MainStack

import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack"

import Home from "../screens/Home";
import Nearby from "../screens/Nearby";
import Profile from "../screens/Profile";
import Explore from "../screens/Explore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ExploreStack from "./ExploreStack";

const BottomTabs = createBottomTabNavigator();
const Stack =createNativeStackNavigator()
const TabRoutes = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#86efac",
        tabBarInactiveTintColor: "grey",
        tabBarHideOnKeyboard:true
      }}
    >
      <BottomTabs.Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="explore"
        component={ExploreStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="arch" size={size} color={color} />
          ),
        }}
      />

      <BottomTabs.Screen
        name="nearby"
        component={Nearby}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default TabRoutes;

  when i clicking on Login then getting this error "The action 'NAVIGATE' with payload {"name":"home"} was not handled by any navigator."