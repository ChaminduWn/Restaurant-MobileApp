import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserType } from "../UserContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  token: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, setUserId } = useContext(UserType);


  



  const { paymentDetails, tokenNumber } = route.params || {};


  // Redirect if data is missing
  if (!paymentDetails || !tokenNumber) {
    Alert.alert("Error", "Missing payment details or token number!");
    navigation.navigate("Cart");
    return null;
  }

  const handleDownloadReceipt = () => {
    Alert.alert("Download Receipt", "Receipt downloading feature coming soon!");
    // Use a library to generate and download the PDF
  };

  useEffect(() => {
    const fetchUser = async() => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId)
    }

    fetchUser();
  },[]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.text}>Thank you for your purchase!</Text>
      <Text style={styles.text}>Token Number: {tokenNumber}</Text>
      <Text style={styles.text}>
        Total Price: LKR {paymentDetails.totalPrice.toFixed(2)}
      </Text>
      <Text style={styles.text}>Items:</Text>
      {paymentDetails.cartItems.map((item, index) => (
        <Text key={index} style={styles.text}>
          {item.foodName} x {item.quantity}
        </Text>
      ))}
      <Text style={styles.token}>Token Number: {tokenNumber}</Text>
      <TouchableOpacity style={styles.button} onPress={handleDownloadReceipt}>
        <Text style={styles.buttonText}>Download Receipt</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;
