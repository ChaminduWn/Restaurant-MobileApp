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
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const storedUserId = await AsyncStorage.getItem("userId");
      
      console.log("Retrieved token:", token);
      console.log("Retrieved stored userId:", storedUserId);

      if (token) {
        const decodedToken = jwt_decode(token);
        console.log("Decoded token:", decodedToken);
        
        if (decodedToken.userId) {
          console.log("Setting userId from token:", decodedToken.userId);
          setUserId(decodedToken.userId);
        } else if (storedUserId) {
          console.log("Setting userId from storage:", storedUserId);
          setUserId(storedUserId);
        }
      } else {
        console.log("No token found");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Error in fetchUser:", error);
      Alert.alert("Error", "Failed to fetch user data");
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("http://192.168.195.160:9000/getAllFoods");
      if (!response.ok) {
        throw new Error("Failed to fetch food items");
      }

      const data = await response.json();
      console.log("Fetched Food Items:", data);
      setFoodItems(data.foodItems);
      setFilteredItems(data.foodItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Fetch Food Items Error:", error.message);
      Alert.alert("Error", "Failed to fetch food items");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUser();
      await fetchFoodItems();
    };
    
    initialize();
  }, []);

  // Add this useEffect to monitor userId changes
  useEffect(() => {
    console.log("Current userId in context:", userId);
  }, [userId]);

  const handleAddToCart = async (item) => {
    try {
      console.log("Current userId when adding to cart:", userId);
      
      if (!userId) {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          console.log("Retrieved userId from storage:", storedUserId);
          setUserId(storedUserId);
          dispatch(addToCart({ ...item, userId: storedUserId }));
          Alert.alert("Success", `${item.foodName} has been added to your cart.`);
        } else {
          Alert.alert("Error", "Please log in to add items to the cart.");
          navigation.navigate("Login");
        }
      } else {
        dispatch(addToCart({ ...item, userId }));
        Alert.alert("Success", `${item.foodName} has been added to your cart.`);
      }
    } catch (error) {
      console.log("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleBuyNow = async (item) => {
    try {
      if (!userId) {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          dispatch(addToCart({ ...item, userId: storedUserId }));
          navigation.navigate("Cart", { userId: storedUserId });
        } else {
          Alert.alert("Error", "Please log in to proceed with purchase.");
          navigation.navigate("Login");
        }
      } else {
        dispatch(addToCart({ ...item, userId }));
        navigation.navigate("Cart", { userId });
      }
    } catch (error) {
      console.log("Error in buy now:", error);
      Alert.alert("Error", "Failed to process purchase");
    }
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.horizontalContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>Rs. {item.price}/= </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button1}
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
      {/* <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>WN Foods And Restaurants</Text>
      </View> */}

      <View style={styles.searchContainer}>
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
    // marginTop: 30,
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
  searchContainer: {
    backgroundColor: "#893271",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    width: "90%",
    height: 40,
    borderColor: "#671B61",
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
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    padding: 10,
    bordercolor: "#E0E0E0",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 110,
    height: 110,
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
    color: "#212121",
  },
  category: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 2,
  },
  price: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#007BA7",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#F2C75B",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    width: 80,
  },
  button1: {
    backgroundColor: "#893271",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
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