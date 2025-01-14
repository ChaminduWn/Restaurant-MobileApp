import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { jsPDF } from 'jspdf';
import { captureRef } from 'react-native-view-shot';
// import RNFS from 'react-native-fs';

const PaymentScreen = () => {
  const route = useRoute();
  const { paymentDetails } = route.params;
  const viewRef = useRef();

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Needed',
            message:
              'This app needs access to your storage to save screenshots.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const saveScreenshot = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Cannot save the screenshot.');
        return;
      }

      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      const fileName = `Payment_Receipt_${paymentDetails.tokenNumber || 'N/A'}.png`;
      const path =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.moveFile(uri, path);
      Alert.alert('Screenshot Saved', `Saved to ${path}`);
    } catch (error) {
      console.error('Error saving screenshot:', error);
      Alert.alert('Error', 'Could not save the screenshot. Please try again.');
    }
  };

  return (
    <View style={styles.container} ref={viewRef}>
      <Text style={styles.title}>Payment Receipt</Text>
      <Text style={styles.detail}>
        Token Number: {paymentDetails?.tokenNumber || 'N/A'}
      </Text>
      <Text style={styles.detail}>
        Total Price: LKR {paymentDetails?.totalPrice || 'N/A'}
      </Text>
      <Text style={styles.heading}>Order Details:</Text>
      {paymentDetails?.cartItems?.map((item, index) => (
        <Text key={index} style={styles.detail}>
          {item.foodName} - Quantity: {item.quantity}, Price: LKR {item.price}
        </Text>
      ))}
      <Text style={styles.heading}>Payment Info:</Text>
      <Text style={styles.detail}>
        Card Type: {paymentDetails?.paymentInfo?.cardType || 'N/A'}
      </Text>
      <Text style={styles.detail}>
        Name on Card: {paymentDetails?.paymentInfo?.cardName || 'N/A'}
      </Text>
      <Text style={styles.detail}>
        Card Number: **** **** ****{' '}
        {paymentDetails?.paymentInfo?.cardNumber?.slice(-4) || 'N/A'}
      </Text>
      <Text style={styles.detail}>
        Payment Date: {paymentDetails?.paymentInfo?.paymentDate || 'N/A'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={saveScreenshot}>
        <Text style={styles.buttonText}>Save Screenshot</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  detail: {
    fontSize: 16,
    marginVertical: 4,
  },
  button: {
    backgroundColor: '#671B61',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
