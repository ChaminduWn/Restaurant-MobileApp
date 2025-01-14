import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserType } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { Picker } from '@react-native-picker/picker';

const PaynowScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderData } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [cardType, setCardType] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error('No auth token found');
        }
        const decodedToken = jwt_decode(token);
        if (!decodedToken.userId) {
          throw new Error('Invalid token format');
        }
        setUserId(decodedToken.userId);
        console.log('UserId set:', decodedToken.userId);
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert(
          'Authentication Error',
          'Please log in again to continue.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('login'),
            },
          ]
        );
      }
    };

    fetchUser();
  }, []);

  const generateTokenNumber = () => {
    return Math.floor(Math.random() * 900) + 100;
  };

  const validateInputs = () => {
    if (!cardType || !nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      Alert.alert('Error', 'Please fill in all the payment details.');
      return false;
    }

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      Alert.alert('Error', 'Card Number must be a valid 16-digit number.');
      return false;
    }

    if (expiryMonth.length !== 2 || isNaN(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) {
      Alert.alert('Error', 'Expiry Month must be a valid 2-digit number (01-12).');
      return false;
    }

    if (expiryYear.length !== 4 || isNaN(expiryYear) || expiryYear < new Date().getFullYear()) {
      Alert.alert('Error', 'Expiry Year must be a valid 4-digit year.');
      return false;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
      Alert.alert('Error', 'CVV must be a valid 3-digit number.');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    const tokenNumber = generateTokenNumber();

    try {
      if (!userId) {
        throw new Error('User ID is missing. Please log in again.');
      }

      const paymentData = {
        userId: userId,
        cartItems: orderData.items.map(item => ({
          foodName: item.foodName,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: orderData.totalAmount,
        paymentInfo: {
          cardType: cardType,
          cardName: nameOnCard,
          cardNumber: cardNumber.slice(-4),
          expirationDate: `${expiryMonth}/${expiryYear}`,
          securityCode: cvv,
        },
        tokenNumber: tokenNumber,
      };

      console.log('Sending payment data:', JSON.stringify(paymentData, null, 2));

      const response = await fetch('http://192.168.195.160:9000/savepayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment failed. Please try again.');
      }

      const responseData = await response.json();

      navigation.navigate('PaymentReceipt', {
        paymentDetails: {
          cartItems: orderData.items,
          totalPrice: orderData.totalAmount,
          tokenNumber: tokenNumber,
          paymentInfo: {
            cardType,
            nameOnCard,
            cardNumber: cardNumber.slice(-4),
            paymentDate: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert(
        'Payment Failed',
        error.message || 'There was an error processing your payment. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Secure Payment Info</Text>
        <Text style={styles.totalPrice}>Total Price: LKR {orderData.totalAmount}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cardType}
              onValueChange={(itemValue) => setCardType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Card Type" value="" />
              <Picker.Item label="Visa" value="Visa" />
              <Picker.Item label="MasterCard" value="MasterCard" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name on Card</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name on card"
            value={nameOnCard}
            onChangeText={setNameOnCard}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 16-digit card number"
            keyboardType="numeric"
            maxLength={16}
            value={cardNumber}
            onChangeText={setCardNumber}
            secureTextEntry
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Expiry Month</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              value={expiryMonth}
              onChangeText={setExpiryMonth}
            />
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>Expiry Year</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              value={expiryYear}
              onChangeText={setExpiryYear}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 3-digit CVV"
            keyboardType="numeric"
            maxLength={3}
            value={cvv}
            onChangeText={setCvv}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  totalPrice: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfInput: {
    width: '48%',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  payButton: {
    backgroundColor: '#FFC72C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaynowScreen;
