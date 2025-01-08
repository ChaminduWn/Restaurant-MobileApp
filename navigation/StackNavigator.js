import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screen/LoginScreen.js";
import RegisterScreen from "../screen/RegisterScreen.js";
import HomeScreen from "../screen/HomeScreen.js";
import CartScreen from "../screen/CartScreen.js";
import ShoppingCartScreen from "../screen/ShoppingCartScreen.js";
import PaymentScreen from "../screen/PaymentScreen.js";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ShoppingCart"
          component={ShoppingCartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="payment"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
       


      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigator;

const styles = StyleSheet.create({});
