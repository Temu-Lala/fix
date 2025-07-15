import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
// @ts-expect-error: lucide-react-native types may be missing
import { CreditCard } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";
import * as Location from 'expo-location'; // If using Expo
import MapView, { Marker } from 'react-native-maps';
import ChapaPayment from './chapa'; // Adjust path if needed

const mockProducts: { [key: string]: { name: string; price: number; image: string; colors: string[] } } = {
  "1": {
    name: "Premium Smart Blender 2024",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    colors: ["Blue", "White", "Black"],
  },
  // Add more products as needed
};

const paymentMethods = [
  { key: 'telebirr', label: 'Telebirr' },
  { key: 'cbe', label: 'CBE' },
  { key: 'dashen', label: 'Dashen Bank' },
  { key: 'kacha', label: 'Kacha' },
  { key: 'amole', label: 'Amole' },
  { key: 'other', label: 'Other' },
];

export default function CheckoutScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const product = mockProducts[id as string] || mockProducts["1"];
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(product.colors[0]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].key);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  // Delivery step state
  const [step, setStep] = useState<"payment" | "delivery">("payment");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [chapaUrl, setChapaUrl] = useState<string | null>(null);
  const [showChapa, setShowChapa] = useState(false);

  const handleNext = () => {
    setStep("delivery");
  };
  const handlePlaceOrder = async () => {
    // In real app, call your backend to get the Chapa checkout URL
    const chapaCheckoutUrl = "https://checkout.chapa.co/checkout/payment/demo-checkout-token"; // Replace with real URL
    setChapaUrl(chapaCheckoutUrl);
    setShowChapa(true);
  };

  const handlePickLocation = async () => {
    setLocationLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      setLocationLoading(false);
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    setLocationLoading(false);
    // Optionally, use reverse geocoding to fill address/city
  };

  // Card input masks (simple, for demo)
  const formatCardNumber = (num: string) => num.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (exp: string) => exp.replace(/[^0-9]/g, '').replace(/(.{2})/, '$1/').substr(0, 5);

  return (
    <>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}> 
        {/* Step Indicator */}
        <View style={styles.stepIndicatorRow}>
          <View style={[styles.stepCircle, step === 'payment' ? styles.stepActive : styles.stepInactive]}>
            <Text style={styles.stepCircleText}>1</Text>
          </View>
          <Text style={[styles.stepLabel, step === 'payment' ? styles.stepActiveText : styles.stepInactiveText]}>Payment</Text>
          <View style={styles.stepLine} />
          <View style={[styles.stepCircle, step === 'delivery' ? styles.stepActive : styles.stepInactive]}>
            <Text style={styles.stepCircleText}>2</Text>
          </View>
          <Text style={[styles.stepLabel, step === 'delivery' ? styles.stepActiveText : styles.stepInactiveText]}>Delivery</Text>
        </View>
        {/* Payment Step */}
        {step === "payment" && (
          <>
            <View style={styles.productBox}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>ETB {product.price.toFixed(2)}</Text>
            </View>
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>Quantity</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.qty, { color: colors.text }]}>{quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>Color</Text>
              <View style={styles.colorRow}>
                {product.colors.map((c: string) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorBtn, { borderColor: color === c ? colors.primary : colors.border, backgroundColor: color === c ? colors.primary : colors.card }]}
                    onPress={() => setColor(c)}
                  >
                    <Text style={{ color: color === c ? '#fff' : colors.text }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>Payment Method</Text>
              <View style={styles.paymentRow}>
                {paymentMethods.map((m) => (
                  <TouchableOpacity
                    key={m.key}
                    style={[
                      styles.paymentBtn,
                      { borderColor: paymentMethod === m.key ? colors.primary : colors.border, backgroundColor: paymentMethod === m.key ? colors.primary : colors.card },
                    ]}
                    onPress={() => setPaymentMethod(m.key)}
                  >
                    <Text style={{ color: paymentMethod === m.key ? '#fff' : colors.text }}>{m.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {/* Card Payment Form (visually perfect) */}
            {paymentMethod === 'other' && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.text }]}>Card Details</Text>
                <View style={styles.cardFormRow}>
                  <CreditCard size={22} color={colors.primary} style={{ marginRight: 8 }} />
                  <TextInput
                    style={[styles.input, { color: colors.text, flex: 1 }]}
                    placeholder="Card Number"
                    placeholderTextColor={colors.textSecondary}
                    value={formatCardNumber(cardNumber)}
                    onChangeText={t => setCardNumber(t.replace(/[^0-9]/g, '').slice(0, 16))}
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>
                <View style={styles.cardFormRow}>
                  <TextInput
                    style={[styles.input, { color: colors.text, flex: 1 }]}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textSecondary}
                    value={formatExpiry(expiry)}
                    onChangeText={t => setExpiry(t.replace(/[^0-9]/g, '').slice(0, 4))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text, flex: 1, marginLeft: 8 }]}
                    placeholder="CVV"
                    placeholderTextColor={colors.textSecondary}
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            )}
            <TouchableOpacity style={[styles.payBtn, { backgroundColor: colors.primary }]} onPress={handleNext}>
              <Text style={styles.payBtnText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        {/* Delivery Step */}
        {step === "delivery" && (
          <>
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>Delivery Location</Text>
              <TouchableOpacity style={styles.locationBtn} onPress={handlePickLocation} disabled={locationLoading}>
                <Text style={styles.locationBtnText}>
                  {locationLoading ? 'Detecting...' : location ? 'Location Selected' : 'Pick Current Location'}
                </Text>
              </TouchableOpacity>
              {location && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    region={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    pointerEvents="none"
                  >
                    <Marker coordinate={location} />
                  </MapView>
                </View>
              )}
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Street Address"
                placeholderTextColor={colors.textSecondary}
                value={address}
                onChangeText={setAddress}
              />
              <TextInput
                style={[styles.input, { color: colors.text, marginTop: 8 }]}
                placeholder="City"
                placeholderTextColor={colors.textSecondary}
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[styles.input, { color: colors.text, marginTop: 8 }]}
                placeholder="Phone Number"
                placeholderTextColor={colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={[styles.input, { color: colors.text, marginTop: 8, minHeight: 48 }]}
                placeholder="Additional Notes (optional)"
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
            <TouchableOpacity style={[styles.payBtn, { backgroundColor: colors.primary }]} onPress={handlePlaceOrder}>
              <Text style={styles.payBtnText}>Place Order</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <ChapaPayment
        url={chapaUrl || ""}
        visible={showChapa}
        onClose={() => setShowChapa(false)}
        onSuccess={() => {
          setShowChapa(false);
          alert("Payment successful!");
          router.replace("/marketplace");
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
  },
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  stepActive: {
    backgroundColor: '#4A80F0',
  },
  stepInactive: {
    backgroundColor: '#E8ECF4',
  },
  stepCircleText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  stepActiveText: {
    color: '#4A80F0',
  },
  stepInactiveText: {
    color: '#888',
  },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: '#E8ECF4',
    marginHorizontal: 2,
  },
  productBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  section: {
    width: "100%",
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    backgroundColor: "#F0F4FF",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  qtyBtnText: {
    fontSize: 18,
    color: "#4A80F0",
    fontWeight: "700",
  },
  qty: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 32,
    textAlign: "center",
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBtn: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  paymentBtn: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
  },
  cardFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    marginLeft: 8,
    backgroundColor: "#fff",
  },
  payBtn: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 18,
  },
  payBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  locationBtn: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  locationBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  map: {
    width: '100%',
    height: '100%',
  },
}); 