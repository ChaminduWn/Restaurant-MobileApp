import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const UserType = createContext();

const UserContext = ({ children }) => {
  const [userId, setUserId] = useState("");
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("authToken");
        if (savedToken) setAuthToken(savedToken);
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };

    loadToken();
  }, []);

  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      setAuthToken(token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      setAuthToken("");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  return (
    <UserType.Provider value={{ userId, setUserId, authToken, saveToken, removeToken }}>
      {children}
    </UserType.Provider>
  );
};

export { UserType, UserContext };
