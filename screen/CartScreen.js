import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();

  // Fetch cart items for the logged-in user
  const fetchCartItems = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      const user = userData && JSON.parse(userData);
      const userId = user?._id;

      if (!userId) {
        Alert.alert("Error", "User not logged in. Please login to view the cart.");
        navigation.navigate("Login");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`http://192.168.1.1:9000/api/cart/getCart/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Update the quantity of a cart item
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      Alert.alert("Error", "Quantity cannot be less than 1.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://192.168.1.1:9000/api/cart/updateCartItem/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (response.ok) {
        fetchCartItems(); // Reload cart items after updating
      } else {
        console.error("Failed to update cart item");
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  // Navigate to the payment page
  const proceedToPayment = () => {
    navigation.navigate("Payment");
  };

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.foodName}>{item.foodId.foodName}</Text>
      <Text style={styles.foodPrice}>Price: LKR {item.foodId.price.toFixed(2)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.foodId._id, item.quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.foodId._id, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.foodId._id}
          renderItem={renderItem}
          contentContainerStyle={styles.cartList}
        />
      )}
      <TouchableOpacity style={styles.paymentButton} onPress={proceedToPayment}>
        <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  cartList: {
    paddingBottom: 16,
  },
  cartItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  foodPrice: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#FF6347",
    padding: 8,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 16,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginTop: 16,
  },
  paymentButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  paymentButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartScreen;
