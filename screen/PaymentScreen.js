import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { jsPDF } from 'jspdf';

const PaymentScreen = () => {
  const route = useRoute();
  const { paymentDetails } = route.params;

  const generatePDF = () => {
    try {
      if (!paymentDetails) {
        Alert.alert('Error', 'Payment details are missing.');
        return;
      }

      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(40, 167, 69);
      doc.text('Payment Receipt', 105, 20, { align: 'center' });

      // Token Number and Total Price
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Token Number: ${paymentDetails.tokenNumber || 'N/A'}`, 10, 40);
      doc.text(`Total Price: LKR ${paymentDetails.totalPrice || 'N/A'}`, 10, 50);

      // Order Details
      doc.setFontSize(14);
      doc.text('Order Details:', 10, 70);
      paymentDetails.cartItems.forEach((item, index) => {
        doc.setFontSize(12);
        doc.text(
          `${index + 1}. ${item.foodName} - Quantity: ${item.quantity}, Price: LKR ${item.price}`,
          10,
          80 + index * 10
        );
      });

      // Payment Info
      const paymentInfoStartY = 80 + paymentDetails.cartItems.length * 10 + 10;
      doc.setFontSize(14);
      doc.text('Payment Info:', 10, paymentInfoStartY);
      doc.setFontSize(12);
      doc.text(
        `Card Type: ${paymentDetails.paymentInfo.cardType || 'N/A'}`,
        10,
        paymentInfoStartY + 10
      );
      doc.text(
        `Name on Card: ${paymentDetails.paymentInfo.cardName || 'N/A'}`,
        10,
        paymentInfoStartY + 20
      );
      doc.text(
        `Card Number: **** **** **** ${
          paymentDetails.paymentInfo.cardNumber.slice(-4) || 'N/A'
        }`,
        10,
        paymentInfoStartY + 30
      );
      doc.text(
        `Payment Date: ${paymentDetails.paymentInfo.paymentDate || 'N/A'}`,
        10,
        paymentInfoStartY + 40
      );

      // Footer
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(
        'Thank you for your order!',
        105,
        paymentInfoStartY + 60,
        { align: 'center' }
      );

      // Save the PDF
      const fileName = `Payment_Receipt_${paymentDetails.tokenNumber || ''}.pdf`;
      doc.save(fileName);

      Alert.alert('Receipt Generated', `Receipt saved as ${fileName}`);
    } catch (error) {
      console.error('Error generating receipt:', error);
      Alert.alert('Error', 'Could not generate the receipt. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>Download Receipt</Text>
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
    backgroundColor: '#4CAF50',
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
