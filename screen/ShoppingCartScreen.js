import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ShoppingCartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in");

      const cartKey = `cart_${userId}`;
      const cart = JSON.parse((await AsyncStorage.getItem(cartKey)) || "[]");
      setCartItems(cart);
      calculateTotal(cart);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to load cart items.");
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(Number(total.toFixed(2))); // Store as a number for precision
  };

  const updateQuantity = async (id, delta) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);

    const userId = await AsyncStorage.getItem("userId");
    const cartKey = `cart_${userId}`;
    await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const removeItem = async (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);

    const userId = await AsyncStorage.getItem("userId");
    const cartKey = `cart_${userId}`;
    await AsyncStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  


  const handleOrderNow = () => {
    // Navigate to the payment page with cart items and total price
    navigate("/checkout/payment", { state: { cartItems, totalPrice, userId } });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <Text style={styles.price}>LKR {item.price}</Text>
        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, -1)}
          disabled={item.quantity === 1}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.id, 1)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <View>
          <Text style={styles.emptyMessage}>Your cart is currently empty.</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate("home")}
          >
            <Text style={styles.browseButtonText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: LKR {totalPrice.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={handleOrderNow}
          >
            <Text style={styles.orderButtonText}>Order Now</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ShoppingCartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 32,
  },
  browseButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#4c0000",
    borderRadius: 8,
    alignItems: "center",
  },
  browseButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  removeButton: {
    fontSize: 14,
    color: "#FF4C4C",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
  },
  orderButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#4c0000",
    borderRadius: 8,
    alignItems: "center",
  },
  orderButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
