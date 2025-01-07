import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
  } from "react-native";
  import React, { useState,useEffect } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from 'react-redux';


  const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleLogin = async () => {
      const user = {
        email: email,
        password: password,
      };
    
      try {
        const response = await fetch("http://192.168.195.160:9000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
    
        if (!response.ok) {
          throw new Error("Invalid Email");
        }
    
        const data = await response.json();
        console.log(data);
    
        const token = data.token;
        await AsyncStorage.setItem("authToken", token);
        navigation.replace("Home");
      } catch (error) {
        Alert.alert("Login Error", error.message);
        console.log(error);
      }
    };
    
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#3F3F4E", alignItems: "center",marginTop:50 }}
      >
        <View>
        <Image
  style={{ width: 200, height: 60 }} // Adjusted to half the original size
  source={require("../assets/images/Wn Resturants logo.png")}
/>

        </View>
  
        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 60,
                color: "#FFFFFF",
              }}
            >
              Login In to your Account
            </Text>
          </View>
  
          <View style={{ marginTop: 70 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 10,
              }}
            >
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={24}
                color="gray"
              />
  
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: email ? 16 : 16,
                }}
                placeholder="enter your Email"
              />
            </View>
          </View>
  
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 5,
                borderRadius: 5,
                marginTop: 30,
              }}
            >
              <AntDesign
                name="lock1"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
  
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="enter your Password"
              />
            </View>
          </View>
  
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>Keep me logged in</Text>
  
            <Text style={{ color: "#007FFF", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>
  
          <View style={{ marginTop: 80 }} />
  
          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: "#FEBE10",
              borderRadius: 6,
              marginLeft: "auto",
              marginRight: "auto",
              padding: 15,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Login
            </Text>
          </Pressable>
  
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>
              Don't have an account? Sign Up
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default LoginScreen;
  
  const styles = StyleSheet.create({});