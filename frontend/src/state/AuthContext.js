import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";

import { API_BASE_URL } from "@env";

export const AuthContext = createContext();

axios.defaults.baseURL = API_BASE_URL || "http://192.168.1.6:6970/api/v1";

/**
 * Axios Response Interceptor
 * Automatically handles 401 (Unauthorized) responses by clearing
 * auth data and showing a re-login alert.
 */
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("@auth");
      Alert.alert(
        "Session Expired",
        "Your session has expired. Please log in again."
      );
    }
    return Promise.reject(error);
  }
);

/**
 * AuthProvider component that provides authentication state to its children.
 * It fetches initial auth data from AsyncStorage and populates the context.
 */
export const AuthProvider = ({ children }) => {
  const [authState, setauthState] = useState({
    Userid: "",
    name: "",
    email: "",
    token: "",
    role: "user",
    doctorId: null,
  });
  const [islogin, setislogin] = useState(false);

  const getUserData = async () => {
    try {
      let data = await AsyncStorage.getItem("@auth");
      if (!data) return; // No stored auth data, skip

      let loginData = JSON.parse(data);
      if (!loginData || !loginData.data) return; // Corrupted data, skip

      setauthState({
        Userid: loginData.data._id,
        name: loginData.data.name,
        email: loginData.data.email,
        token: loginData.token,
        role: loginData.data.role || "user",
        doctorId: loginData.data.doctorId || null,
      });
      setislogin(true);
    } catch (error) {
      // Silently fail — user will just see the login screen
    }
  };

  // Set the Axios Authorization header whenever the token changes
  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authState.token]);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setauthState, islogin, setislogin }}>
      {children}
    </AuthContext.Provider>
  );
};
