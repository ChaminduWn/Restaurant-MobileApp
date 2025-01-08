import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("http://192.168.195.160:9000/getAllFoods");

      if (!response.ok) {
        throw new Error("Failed to fetch food items");
      }

      const data = await response.json();
      setFoodItems(data.foodItems);
      setFilteredItems(data.foodItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message);
    }
  };

  const updateCartCount = async () => {
    const userId = await AsyncStorage.getItem("userId");
    const cart = JSON.parse((await AsyncStorage.getItem(`cart_${userId}`)) || "[]");
    setCartCount(cart.length);
  };

  const addToCart = async (item) => {
    const userId = await AsyncStorage.getItem("userId");
    const cartKey = `cart_${userId}`;
    const currentCartList = JSON.parse(
      (await AsyncStorage.getItem(cartKey)) || "[]"
    );

    if (!currentCartList.some((cartItem) => cartItem.id === item._id)) {
      currentCartList.push({
        id: item._id,
        quantity: 1,
        price: item.price,
        foodName: item.foodName,
        image: item.image,
      });
    } else {
      currentCartList.forEach((cartItem) => {
        if (cartItem.id === item._id) {
          cartItem.quantity += 1;
        }
      });
    }

    await AsyncStorage.setItem(cartKey, JSON.stringify(currentCartList));
    setCartCount(currentCartList.length);
    Alert.alert("Success", "Item added to cart!");
  };

  const handleBuyNow = (item) => {
    addToCart(item);
    navigation.navigate("ShoppingCart");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredItems(foodItems);
    } else {
      const filtered = foodItems.filter((item) =>
        item.foodName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  useEffect(() => {
    updateCartCount();
    fetchFoodItems();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.horizontalContainer}>
        {/* Image Section */}
        <Image source={{ uri: item.image }} style={styles.image} />

        {/* Details Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>LKR {item.price}</Text>
        </View>

        {/* Button Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleBuyNow(item)}>
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View
        style={{
          backgroundColor: "#FFC72C",
          padding: 10,
          height: 60,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          style={styles.searchBar}
          placeholder="Search for food..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchBar: {
    width: "90%",
    height: 40,
    borderColor: "#6200EE",
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    padding: 10,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 2,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200EE",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#FFC72C",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    width: 80,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
