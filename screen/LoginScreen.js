import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext"; // Import UserContext
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useContext(UserType); // Access the context
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          navigation.replace("Main"); // Redirect to Main if token exists
        }
      } catch (err) {
        console.log("Error reading token from storage:", err);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    const user = { email, password };
  
    fetch("http://192.168.118.160:9000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Invalid email or password") {
          Alert.alert("Login Error", data.message);
          return;
        }
  
        if (data.token) {
          AsyncStorage.setItem("authToken", data.token)
            .then(() => {
              console.log("Token saved successfully");
              const decodedToken = jwt_decode(data.token); // Decode the token
              console.log("Decoded token:", decodedToken);
  
              if (decodedToken.userId) {
                setUserId(decodedToken.userId); // Update the context
                navigation.replace("Main");
              } else {
                Alert.alert("Login Error", "Unable to retrieve user information.");
              }
            })
            .catch((error) => {
              console.error("Error saving token:", error);
            });
        } else {
          Alert.alert("Login Error", "Server response missing token.");
        }
      })
      .catch((error) => {
        console.error("Login fetch error:", error);
        Alert.alert("Login Error", "Something went wrong. Please try again.");
      });
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          style={styles.logo}
          source={{
            uri: "https://assets.stickpng.com/thumbs/6160562276000b00045a7d97.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={styles.centeredText}>
          <Text style={styles.headerText}>Login In to your Account</Text>
        </View>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="gray" style={styles.icon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Enter your Email"
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="lock1" size={24} color="gray" style={styles.icon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.input}
              placeholder="Enter your Password"
            />
          </View>
        </View>

        <View style={styles.row}>
          <Text>Keep me logged in</Text>
          <Text style={styles.linkText}>Forgot Password</Text>
        </View>

        <Pressable onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")} style={styles.registerLink}>
          <Text style={styles.registerText}>Don't have an account? Sign Up</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 100,
  },
  centeredText: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    color: "#041E42",
  },
  inputWrapper: {
    marginTop: 70,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D0D0D0",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 30,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  row: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkText: {
    color: "#007FFF",
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 80,
    width: 200,
    backgroundColor: "#FEBE10",
    borderRadius: 6,
    padding: 15,
    
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 15,
  },
  registerText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
  },
});
