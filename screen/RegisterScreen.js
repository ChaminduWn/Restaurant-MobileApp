import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Pressable,
    Image,
    KeyboardAvoidingView,
    TextInput,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import { Ionicons } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  
  const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigation = useNavigation();
    const handleRegister = () => {
      const user = {
        username: username,
        email: email,
        password: password,
      };
  
      // send a POST  request to the backend API to register the user
      fetch("http://192.168.195.118:9000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Registration failed");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          Alert.alert(
            "Registration Successful",
            "You have been registered successfully"
          );
          setUsername(""); // Clear the name input
          setEmail(""); // Clear the email input
          setPassword(""); // Clear the password input
        })
        .catch((error) => {
          Alert.alert(
            "Registration Error",
            "An error occurred while registering"
          );
          console.log("Registration failed:", error);
        });
      
    };
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#fff", alignItems: "center"  }}
      >

      
       
  
        <KeyboardAvoidingView>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 20,
                marginTop: 50,
                fontWeight: "bold",
                color: "#671B61",
              }}
            >
              Register to your Account
            </Text>
          </View>
  
          <View style={{ marginTop: 40 }}>
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
              {/* <Ionicons
                name="ios-person"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              /> */}
              

<MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={24}
                color="#671B61"
              />
              <TextInput
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: username ? 16 : 16,
                }}
                placeholder="enter your name"
              />
            </View>
  
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
              <MaterialIcons
                style={{ marginLeft: 8 }}
                name="email"
                size={24}
                color="#671B61"
              />
  
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={{
                  color: "gray",
                  marginVertical: 10,
                  width: 300,
                  fontSize: password ? 16 : 16,
                }}
                placeholder="enter your Email"
              />
            </View>
          </View>
  
          <View>
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
                color="#671B61"
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
                  fontSize: email ? 16 : 16,
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
            <Text style={{ color: "#gray"}}>Keep me logged in</Text>
  
            <Text style={{ color: "#BD2B4B", fontWeight: "500" }}>
              Forgot Password
            </Text>
          </View>
  
          <View style={{ marginTop: 80 }} />
  
          <Pressable
            onPress={handleRegister}
            style={{
              width: 200,
              backgroundColor: "#671B61",
              // backgroundColor: "#893271",
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
              Register
            </Text>
          </Pressable>
  
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginTop: 15 }}
          >
            <Text style={{ textAlign: "center", color: "#CF7793", fontSize: 16 }}>
              Already have an account? Sign In
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({});