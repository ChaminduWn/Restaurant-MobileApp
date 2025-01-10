import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserType } from "../UserContext";


const PaynowScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems, totalPrice } = route.params;

  const [cardType, setCardType] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const { userId, setUserId } = useContext(UserType);


  useEffect(() => {
    const fetchUser = async() => {
        const token = await AsyncStorage.getItem("authToken");
        const decodedToken = jwt_decode(token);
        const userId = decodedToken.userId;
        setUserId(userId)
    }

    fetchUser();
  },[]);

  const handlePayment = () => {
    // Validation
    if (
      !cardType ||
      !nameOnCard ||
      !cardNumber ||
      !expiryMonth ||
      !expiryYear ||
      !cvv
    ) {
      Alert.alert('Error', 'Please fill in all the payment details.');
      return;
    }

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      Alert.alert('Error', 'Card Number must be a valid 16-digit number.');
      return;
    }

    if (expiryMonth.length !== 2 || isNaN(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) {
      Alert.alert('Error', 'Expiry Month must be a valid 2-digit number (01-12).');
      return;
    }

    if (expiryYear.length !== 4 || isNaN(expiryYear) || expiryYear < new Date().getFullYear()) {
      Alert.alert('Error', 'Expiry Year must be a valid 4-digit year.');
      return;
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
      Alert.alert('Error', 'CVV must be a valid 3-digit number.');
      return;
    }

    // Navigate to Payment Receipt with payment details
    navigation.navigate('PaymentReceipt', {
      cartItems,
      totalPrice,
      tokenNumber: Math.floor(Math.random() * 1000) + 1,
      paymentInfo: {
        cardType,
        nameOnCard,
        cardNumber: cardNumber.slice(-4), // Mask the card number
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Secure Payment Info</Text>
        <Text style={styles.totalPrice}>Total Price: LKR {totalPrice}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Visa, MasterCard"
            value={cardType}
            onChangeText={setCardType}
          />
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
          />
        </View>

        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
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
