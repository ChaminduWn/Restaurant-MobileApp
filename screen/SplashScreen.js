import React, { useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation(); // Access navigation prop

  useEffect(() => {
    // Set a 5-second timer to navigate to the login screen
    const timer = setTimeout(() => {
      navigation.navigate('Login'); // Replace 'Login' with your login screen name
    }, 5000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigation]);

  const handleImagePress = () => {
    navigation.navigate('Login'); // Navigate to the login screen when the image is pressed
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress}>
        <Image
          style={styles.image}
          source={require('../assets/images/resturants splash new.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take the full screen
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#fff', // Optional: Set background color
  },
  image: {
    width: 250,
    height: 300,
    resizeMode: 'contain', // Ensure the image fits well
  },
});
