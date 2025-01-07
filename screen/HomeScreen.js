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
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";


const HomeScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // To store the search query
  const [filteredItems, setFilteredItems] = useState([]); // To store filtered food items

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://192.168.195.160:9000/getAllFoods");

        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }

        const data = await response.json();
        setFoodItems(data.foodItems);
        setFilteredItems(data.foodItems); // Initialize filteredItems with all foodItems
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", error.message);
      }
    };

    fetchFoodItems();
  }, []);

  // Function to handle search input and filter food items
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredItems(foodItems); // Show all items if search query is empty
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
          <Text style={styles.price}>LKR {item.price}</Text>
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

<View
          style={{
            backgroundColor: "#00CED1",
            padding: 10,
            height:60,
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
      {/* Search Bar */}
      
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
    marginTop:60,
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
  },
  horizontalContainer: {
    flexDirection: "row", // Layout items horizontally
    alignItems: "center",
  },
  image: {
    width: 100, // Fixed width for the image
    height: 100, // Fixed height for the image
    marginRight: 16, // Space between image and text
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1, // Take up remaining space
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
