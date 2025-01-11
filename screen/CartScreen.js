import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "../redux/CartReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

const CartScreen = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const [userId, setUserId] = React.useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.userId);
      }
    };

    // Fetch userId from token if not passed from HomeScreen
    if (!userId && route.params?.userId) {
      setUserId(route.params.userId);
    } else {
      fetchUser();
    }
  }, [route.params?.userId]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart({ id }));
    Alert.alert("Success", "Item removed from cart");
  };

  const handleIncrementQuantity = (id) => {
    dispatch(incrementQuantity({ id }));
  };

  const handleDecrementQuantity = (id) => {
    const item = cart.find((item) => item._id === id);
    if (item && item.quantity > 1) {
      dispatch(decrementQuantity({ id }));
    } else {
      handleRemoveItem(id);
    }
  };

  const handleCheckout = () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please log in.");
      return;
    }

    const orderData = {
      userId: userId,
      items: cart.map((item) => ({
        foodId: item._id,
        foodName: item.foodName,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      totalAmount: calculateTotal(),
      orderDate: new Date().toISOString(),
    };

    navigation.navigate("payment", { orderData: orderData });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <Text style={styles.price}>LKR {item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleDecrementQuantity(item._id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleIncrementQuantity(item._id)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item._id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: LKR {calculateTotal()}</Text>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  list: {
    paddingVertical: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#FFC72C",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  totalContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  checkoutButton: {
    backgroundColor: "#FFC72C",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#757575",
  },
});

export default CartScreen;
