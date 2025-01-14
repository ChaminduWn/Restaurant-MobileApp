import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Pressable,
    Image,
    Alert,
    ScrollView,
    TextInput,
    ActivityIndicator,
  } from "react-native";
  import React, { useState, useContext } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { MaterialIcons } from "@expo/vector-icons";
  import { UserType } from "../UserContext";
  
  const EditProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userData } = route.params;
    const [loading, setLoading] = useState(false);
    const { userId } = useContext(UserType);
    
    const [formData, setFormData] = useState({
      username: userData.username || "",
      gender: userData.gender || "",
      dateOfBirth: userData.dateOfBirth || "",
      address: userData.address || "",
      contactNumber: userData.contactNumber || "",
      profilePicture: userData.profilePicture || ""
    });
  
    const handleChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
    const handleSave = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem("authToken");
      
          console.log("Form data being sent:", formData); // Log formData here
      
          const response = await fetch(`http://192.168.118.160:9000/user/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
      
          const data = await response.json();
          console.log("Response data:", data);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      };
  
    const validateForm = () => {
      if (!formData.username.trim()) {
        Alert.alert("Error", "Name is required");
        return false;
      }
      
      if (formData.dateOfBirth) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(formData.dateOfBirth)) {
          Alert.alert("Error", "Date must be in YYYY-MM-DD format");
          return false;
        }
      }
  
      if (formData.contactNumber) {
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(formData.contactNumber.replace(/\D/g, ''))) {
          Alert.alert("Error", "Please enter a valid phone number");
          return false;
        }
      }
  
      return true;
    };
  
    const InputField = ({ label, value, onChangeText, placeholder, required }) => (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          {label} {required && <Text style={styles.requiredStar}>*</Text>}
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      </View>
    );
  
    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FEBE10" />
          <Text style={styles.loadingText}>Updating profile...</Text>
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>
  
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: formData.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
              style={styles.profileImage}
            />
            <Pressable style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </Pressable>
          </View>
  
          <View style={styles.formContainer}>
            <InputField
              label="Name"
              value={formData.username}
              onChangeText={(text) => handleChange('username', text)}
              placeholder="Enter your name"
              required
            />
            <InputField
              label="Gender"
              value={formData.gender}
              onChangeText={(text) => handleChange('gender', text)}
              placeholder="Enter your gender"
            />
            <InputField
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={(text) => handleChange('dateOfBirth', text)}
              placeholder="YYYY-MM-DD"
            />
            <InputField
              label="Address"
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
              placeholder="Enter your address"
            />
            <InputField
              label="Contact Number"
              value={formData.contactNumber}
              onChangeText={(text) => handleChange('contactNumber', text)}
              placeholder="Enter your contact number"
            />
          </View>
  
          <Pressable 
            style={styles.saveButton}
            onPress={() => {
              if (validateForm()) {
                handleSave();
              }
            }}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      paddingTop: 50,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    loadingText: {
      marginTop: 10,
      color: "#666",
      fontSize: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#000",
    },
    scrollContent: {
      paddingBottom: 30,
    },
    profileImageContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
      backgroundColor: "#E1E1E1",
    },
    changePhotoButton: {
      padding: 8,
    },
    changePhotoText: {
      color: "#FEBE10",
      fontSize: 16,
      fontWeight: "500",
    },
    formContainer: {
      backgroundColor: "#fff",
      borderRadius: 15,
      marginHorizontal: 20,
      padding: 15,
      marginBottom: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    },
    inputContainer: {
      marginBottom: 15,
    },
    inputLabel: {
      fontSize: 14,
      color: "#666",
      marginBottom: 5,
    },
    requiredStar: {
      color: "red",
      fontSize: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: "#000",
    },
    saveButton: {
      backgroundColor: "#FEBE10",
      marginHorizontal: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  
  export default EditProfileScreen;