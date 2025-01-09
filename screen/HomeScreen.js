import React, { useContext, useEffect, useState } from "react";
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
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch to dispatch Redux actions
import { addToCart } from "../redux/CartReducer"; // Import the Redux action to add items to the cart
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [cartCount, setCartCount] = useState();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const { userId, setUserId } = useContext(UserType);
    const cart = useSelector((state) => state.cart.cart);

  const dispatch = useDispatch(); // Initialize useDispatch for dispatching actions

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

  const handleAddToCart = (item) => {
    dispatch(addToCart(item)); // Dispatch the Redux action to add the item to the cart
    Alert.alert("Added to Cart", `${item.foodName} has been added to your cart.`);
  };

  const handleBuyNow = (item) => {
    dispatch(addToCart(item)); // Add the item to the cart
    navigation.navigate("ShoppingCart"); // Navigate to the Cart screen
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
    fetchUser();
    fetchFoodItems();
  }, []);

  const fetchUser = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = jwt_decode(token);
    const userId = decodedToken.userId;
    setUserId(userId);
  };

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
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleBuyNow(item)}
          >
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
       <View style={styles.topBar}>
              <Text style={styles.topBarTitle}>WN Foods And Resturants</Text>
              
            </View>
            
      {/* Search Bar */}
      <View
        style={{
          backgroundColor: "#FFC72C",
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
    marginTop: 30,
    
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  topBar: {
    
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  topBarTitle: {
    color: "#1c1c1c",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    width: "90%",
    height: 40,
    borderColor: "#1C1C1C",
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
