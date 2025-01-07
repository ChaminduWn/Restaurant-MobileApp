import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

const HomeScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://192.168.195.160:9000/getAllFoods");

        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }

        const data = await response.json();
        setFoodItems(data.foodItems);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert("Error", error.message);
      }
    };

    fetchFoodItems();
  }, []);

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
      <FlatList
        data={foodItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
