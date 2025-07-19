import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Modal,
  Animated as RNAnimated,
  Easing,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  MapPin,
  Truck,
  User,
  Clock,
  CheckCircle,
  Locate,
} from "lucide-react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";
import { useTranslation } from "@/constants/translations";
import { useTheme } from "@/hooks/useTheme";

const deliveryProviders = [
  { key: "dhl", name: "DHL Express" },
  { key: "fedex", name: "FedEx" },
  { key: "local", name: "Local Courier" },
];
const deliveryMethods = [
  { key: "door", name: "Door to Door" },
  { key: "pickup", name: "Pickup Point" },
];

export default function BarterNow() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [option, setOption] = React.useState<"provider" | "self" | null>(null);
  // Service Provider
  const [provider, setProvider] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("");
  const [deliveryDate, setDeliveryDate] = React.useState<Date | null>(null);
  const [deliveryLocation, setDeliveryLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // Self Exchange
  const [meetDate, setMeetDate] = React.useState<Date | null>(null);
  const [meetLocation, setMeetLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [mapModal, setMapModal] = React.useState<null | "provider" | "self">(
    null
  );
  const [locationLoading, setLocationLoading] = React.useState(false);
  const rotateAnim = React.useRef(new RNAnimated.Value(0)).current;
  const [mapRegion, setMapRegion] = React.useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [userLocation, setUserLocation] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (locationLoading) {
      RNAnimated.loop(
        RNAnimated.timing(rotateAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.stopAnimation();
      rotateAnim.setValue(0);
    }
  }, [locationLoading]);

  // Delivery Date Picker
  const [isDeliveryDatePickerVisible, setDeliveryDatePickerVisibility] =
    React.useState(false);
  const showDeliveryDatePicker = () => setDeliveryDatePickerVisibility(true);
  const hideDeliveryDatePicker = () => setDeliveryDatePickerVisibility(false);
  const handleDeliveryConfirm = (date: Date) => {
    setDeliveryDate(date);
    hideDeliveryDatePicker();
  };

  // Meeting Date Picker
  const [isMeetDatePickerVisible, setMeetDatePickerVisibility] =
    React.useState(false);
  const showMeetDatePicker = () => setMeetDatePickerVisibility(true);
  const hideMeetDatePicker = () => setMeetDatePickerVisibility(false);
  const handleMeetConfirm = (date: Date) => {
    setMeetDate(date);
    hideMeetDatePicker();
  };

  // Default map center (Addis Ababa)
  const defaultRegion = {
    latitude: 9.03,
    longitude: 38.74,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleSubmit = () => {
    if (option === "provider") {
      if (!provider || !method || !deliveryDate || !deliveryLocation) {
        Alert.alert("Please fill all delivery details");
        return;
      }
      setSuccess(true);
    } else if (option === "self") {
      if (!meetDate || !meetLocation) {
        Alert.alert("Please fill all meeting details");
        return;
      }
      setSuccess(true);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleString();
  };

  // Get and set user location for blue dot and recentering
  const getAndSetUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      return loc;
    } catch (e) {}
  };

  // When map modal opens, center on selected/current location
  React.useEffect(() => {
    if (mapModal) {
      let lat = 9.03,
        lng = 38.74;
      if (mapModal === "provider" && deliveryLocation) {
        lat = deliveryLocation.lat;
        lng = deliveryLocation.lng;
      } else if (mapModal === "self" && meetLocation) {
        lat = meetLocation.lat;
        lng = meetLocation.lng;
      } else if (userLocation) {
        lat = userLocation.latitude;
        lng = userLocation.longitude;
      }
      setMapRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      getAndSetUserLocation();
    }
  }, [mapModal]);

  // Get current location for delivery
  const getCurrentDeliveryLocation = async () => {
    setLocationLoading(true);
    try {
      let loc = await getAndSetUserLocation();
      if (loc) {
        setDeliveryLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
        setMapRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (e) {
      Alert.alert("Error", "Could not get location");
    }
    setLocationLoading(false);
  };

  // Get current location for meeting
  const getCurrentMeetLocation = async () => {
    setLocationLoading(true);
    try {
      let loc = await getAndSetUserLocation();
      if (loc) {
        setMeetLocation({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
        setMapRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (e) {
      Alert.alert("Error", "Could not get location");
    }
    setLocationLoading(false);
  };

  if (success) {
    return (
      <View style={styles.successBg}>
        <CheckCircle
          size={64}
          color={colors.success}
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.successTitle}>Barter Request Sent!</Text>
        <Text style={styles.successDesc}>
          The other party will be notified and can confirm the exchange details.
        </Text>
        <TouchableOpacity
          style={styles.successBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.successBtnText}>Back to Details</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Barter Now</Text>
      <Text style={styles.subtitle}>
        Choose how you want to exchange your item:
      </Text>
      <View style={styles.optionsRow}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            option === "provider" && styles.optionCardActive,
          ]}
          onPress={() => setOption("provider")}
        >
          <Truck
            size={32}
            color={
              option === "provider" ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.optionText,
              option === "provider" && styles.optionTextActive,
            ]}
          >
            Service Provider Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionCard,
            option === "self" && styles.optionCardActive,
          ]}
          onPress={() => setOption("self")}
        >
          <User
            size={32}
            color={option === "self" ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.optionText,
              option === "self" && styles.optionTextActive,
            ]}
          >
            Self Exchange
          </Text>
        </TouchableOpacity>
      </View>
      {option === "provider" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Delivery Provider</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipRow}
          >
            {deliveryProviders.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.chip, provider === p.key && styles.chipActive]}
                onPress={() => setProvider(p.key)}
              >
                <Text
                  style={[
                    styles.chipText,
                    provider === p.key && styles.chipTextActive,
                  ]}
                >
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipRow}
          >
            {deliveryMethods.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[styles.chip, method === m.key && styles.chipActive]}
                onPress={() => setMethod(m.key)}
              >
                <Text
                  style={[
                    styles.chipText,
                    method === m.key && styles.chipTextActive,
                  ]}
                >
                  {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={showDeliveryDatePicker}
          >
            <Text
              style={{
                color: deliveryDate ? colors.text : colors.textSecondary,
              }}
            >
              {deliveryDate ? formatDate(deliveryDate) : "Select date & time"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDeliveryDatePickerVisible}
            mode="datetime"
            onConfirm={handleDeliveryConfirm}
            onCancel={hideDeliveryDatePicker}
          />
          <Text style={styles.sectionTitle}>Delivery Location</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => setMapModal("provider")}
            >
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.mapBtnText}>
                {deliveryLocation
                  ? `Lat: ${deliveryLocation.lat.toFixed(
                      4
                    )}, Lng: ${deliveryLocation.lng.toFixed(4)}`
                  : "Select on Map"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mapBtn,
                {
                  backgroundColor: colors.infoLight,
                  borderColor: colors.info,
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
              onPress={getCurrentDeliveryLocation}
              disabled={locationLoading}
              activeOpacity={0.8}
            >
              <RNAnimated.View
                style={{
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Locate size={20} color={colors.info} />
              </RNAnimated.View>
              <Text
                style={{
                  color: colors.info,
                  fontWeight: "bold",
                  marginLeft: 6,
                }}
              >
                {locationLoading ? "Locating..." : "Use Current Location"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {option === "self" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Location</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              style={styles.mapBtn}
              onPress={() => setMapModal("self")}
            >
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.mapBtnText}>
                {meetLocation
                  ? `Lat: ${meetLocation.lat.toFixed(
                      4
                    )}, Lng: ${meetLocation.lng.toFixed(4)}`
                  : "Select on Map"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.mapBtn,
                {
                  backgroundColor: colors.infoLight,
                  borderColor: colors.info,
                  flexDirection: "row",
                  alignItems: "center",
                },
              ]}
              onPress={getCurrentMeetLocation}
              disabled={locationLoading}
              activeOpacity={0.8}
            >
              <RNAnimated.View
                style={{
                  transform: [
                    {
                      rotate: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Locate size={20} color={colors.info} />
              </RNAnimated.View>
              <Text
                style={{
                  color: colors.info,
                  fontWeight: "bold",
                  marginLeft: 6,
                }}
              >
                {locationLoading ? "Locating..." : "Use Current Location"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Meeting Time</Text>
          <TouchableOpacity style={styles.input} onPress={showMeetDatePicker}>
            <Text
              style={{ color: meetDate ? colors.text : colors.textSecondary }}
            >
              {meetDate ? formatDate(meetDate) : "Select date & time"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isMeetDatePickerVisible}
            mode="datetime"
            onConfirm={handleMeetConfirm}
            onCancel={hideMeetDatePicker}
          />
        </View>
      )}
      {option && (
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Send Barter Request</Text>
        </TouchableOpacity>
      )}
      {/* Map Modal for location selection */}
      <Modal
        visible={!!mapModal}
        animationType="slide"
        onRequestClose={() => setMapModal(null)}
        transparent={true}
      >
        <View style={styles.fullScreenModalBg}>
          <View style={styles.fullScreenModalContent}>
            <Text style={styles.mapModalTitle}>Select Location</Text>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.fullScreenMap}
              initialRegion={mapRegion || defaultRegion}
              region={mapRegion || defaultRegion}
              showsUserLocation={!!userLocation}
              showsMyLocationButton={false}
              onPress={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                if (mapModal === "provider")
                  setDeliveryLocation({ lat: latitude, lng: longitude });
                if (mapModal === "self")
                  setMeetLocation({ lat: latitude, lng: longitude });
                setMapRegion({
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }}
            >
              {mapModal === "provider" && deliveryLocation && (
                <Marker
                  coordinate={{
                    latitude: deliveryLocation.lat,
                    longitude: deliveryLocation.lng,
                  }}
                />
              )}
              {mapModal === "self" && meetLocation && (
                <Marker
                  coordinate={{
                    latitude: meetLocation.lat,
                    longitude: meetLocation.lng,
                  }}
                />
              )}
            </MapView>
            {/* Floating My Location Button */}
            <TouchableOpacity
              style={styles.myLocationBtn}
              onPress={async () => {
                const loc = await getAndSetUserLocation();
                if (loc) {
                  setMapRegion({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  });
                  if (mapModal === "provider")
                    setDeliveryLocation({
                      lat: loc.coords.latitude,
                      lng: loc.coords.longitude,
                    });
                  if (mapModal === "self")
                    setMeetLocation({
                      lat: loc.coords.latitude,
                      lng: loc.coords.longitude,
                    });
                }
              }}
              activeOpacity={0.8}
            >
              <Locate size={28} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mapModalBtn}
              onPress={() => setMapModal(null)}
            >
              <Text style={styles.mapModalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f3f6fa",
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 18,
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 16,
  },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#eee",
    width: 150,
    elevation: 2,
  },
  optionCardActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    color: "#007AFF",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 15,
    textAlign: "center",
  },
  optionTextActive: {
    color: "#fff",
  },
  section: {
    width: "100%",
    marginBottom: 18,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    fontSize: 15,
  },
  chipRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 14,
  },
  chipTextActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    backgroundColor: "#f8fafd",
    fontSize: 16,
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  mapBtnText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "bold",
  },
  submitBtn: {
    backgroundColor: "#FF6600",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
  successBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f6fa",
    padding: 32,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  successBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    width: 200,
  },
  successBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  mapModalBg: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    justifyContent: "center",
  },
  mapModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  mapModalBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  mapModalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  fullScreenModalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenModalContent: {
    width: Dimensions.get("window").width * 0.98,
    height: Dimensions.get("window").height * 0.85,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 16,
  },
  fullScreenMap: {
    width: "98%",
    height: "70%",
    borderRadius: 16,
    marginBottom: 12,
  },
  myLocationBtn: {
    position: "absolute",
    bottom: 90,
    right: 24,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    zIndex: 10,
  },
});
