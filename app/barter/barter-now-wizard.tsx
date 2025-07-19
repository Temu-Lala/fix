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
  Animated,
  LogBox,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  MapPin,
  Truck,
  User,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react-native";
import MapView, { Marker } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

const steps = ["Type", "Details", "Review"];

export default function BarterNowWizard() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useTranslation();
  const [step, setStep] = React.useState(0);
  const [option, setOption] = React.useState<"provider" | "self" | null>(null);
  // Service Provider
  const [provider, setProvider] = React.useState<string>("");
  const [method, setMethod] = React.useState<string>("");
  const [deliveryDate, setDeliveryDate] = React.useState<Date | null>(null);
  const [showDeliveryDate, setShowDeliveryDate] = React.useState(false);
  const [deliveryLocation, setDeliveryLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  // Self Exchange
  const [meetDate, setMeetDate] = React.useState<Date | null>(null);
  const [showMeetDate, setShowMeetDate] = React.useState(false);
  const [meetLocation, setMeetLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [mapModal, setMapModal] = React.useState<null | "provider" | "self">(
    null
  );
  const anim = React.useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

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

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: step,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [step]);

  React.useEffect(() => {
    LogBox.ignoreLogs([
      "Cannot read property 'dismiss' of undefined",
      "RNDateTimePickerAndroid",
    ]);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleString();
  };

  const canContinue = () => {
    if (step === 0) return !!option;
    if (step === 1) {
      if (option === "provider")
        return provider && method && deliveryDate && deliveryLocation;
      if (option === "self") return meetDate && meetLocation;
    }
    return true;
  };

  const handleSubmit = () => {
    setSuccess(true);
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
      {/* Stepper */}
      <View style={styles.stepperRow}>
        {steps.map((s, i) => (
          <View
            key={s}
            style={[styles.stepperDot, step === i && styles.stepperDotActive]}
          >
            <Text
              style={[
                styles.stepperText,
                step === i && styles.stepperTextActive,
              ]}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>
      <Animated.View
        style={{
          left: anim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, -20, -40],
          }),
        }}
      >
        {step === 0 && (
          <View>
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
                  color={option === "provider" ? colors.primary : colors.text}
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
                  color={option === "self" ? colors.primary : colors.text}
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
          </View>
        )}
        {step === 1 && (
          <View>
            {option === "provider" && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Select Delivery Provider
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.chipRow}
                >
                  {deliveryProviders.map((p) => (
                    <TouchableOpacity
                      key={p.key}
                      style={[
                        styles.chip,
                        provider === p.key && styles.chipActive,
                      ]}
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
                      style={[
                        styles.chip,
                        method === m.key && styles.chipActive,
                      ]}
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
                      color: deliveryDate ? colors.text : colors.placeholder,
                    }}
                  >
                    {deliveryDate
                      ? formatDate(deliveryDate)
                      : "Select date & time"}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDeliveryDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleDeliveryConfirm}
                  onCancel={hideDeliveryDatePicker}
                />
                <Text style={styles.sectionTitle}>Delivery Location</Text>
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
              </View>
            )}
            {option === "self" && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meeting Location</Text>
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
                <Text style={styles.sectionTitle}>Meeting Time</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={showMeetDatePicker}
                >
                  <Text
                    style={{
                      color: meetDate ? colors.text : colors.placeholder,
                    }}
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
          </View>
        )}
        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review & Confirm</Text>
            {option === "provider" ? (
              <View>
                <Text style={styles.reviewLabel}>
                  Type:{" "}
                  <Text style={styles.reviewValue}>
                    Service Provider Delivery
                  </Text>
                </Text>
                <Text style={styles.reviewLabel}>
                  Provider:{" "}
                  <Text style={styles.reviewValue}>
                    {deliveryProviders.find((p) => p.key === provider)?.name ||
                      "-"}
                  </Text>
                </Text>
                <Text style={styles.reviewLabel}>
                  Method:{" "}
                  <Text style={styles.reviewValue}>
                    {deliveryMethods.find((m) => m.key === method)?.name || "-"}
                  </Text>
                </Text>
                <Text style={styles.reviewLabel}>
                  Time:{" "}
                  <Text style={styles.reviewValue}>
                    {formatDate(deliveryDate)}
                  </Text>
                </Text>
                <Text style={styles.reviewLabel}>
                  Location:{" "}
                  <Text style={styles.reviewValue}>
                    {deliveryLocation
                      ? `Lat: ${deliveryLocation.lat.toFixed(
                          4
                        )}, Lng: ${deliveryLocation.lng.toFixed(4)}`
                      : "-"}
                  </Text>
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.reviewLabel}>
                  Type: <Text style={styles.reviewValue}>Self Exchange</Text>
                </Text>
                <Text style={styles.reviewLabel}>
                  Meeting Time:{" "}
                  <Text style={styles.reviewValue}>{formatDate(meetDate)}</Text>
                </Text>
                <Text style={styles.reviewLabel}>
                  Meeting Location:{" "}
                  <Text style={styles.reviewValue}>
                    {meetLocation
                      ? `Lat: ${meetLocation.lat.toFixed(
                          4
                        )}, Lng: ${meetLocation.lng.toFixed(4)}`
                      : "-"}
                  </Text>
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Send Barter Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
      {/* Stepper Navigation */}
      <View style={styles.stepperNav}>
        {step > 0 && (
          <TouchableOpacity
            style={styles.stepperNavBtn}
            onPress={() => setStep(step - 1)}
          >
            <ChevronLeft size={22} color={colors.primary} />
            <Text style={styles.stepperNavText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < 2 && (
          <TouchableOpacity
            style={[styles.stepperNavBtn, !canContinue() && { opacity: 0.5 }]}
            onPress={() => canContinue() && setStep(step + 1)}
            disabled={!canContinue()}
          >
            <Text style={styles.stepperNavText}>Next</Text>
            <ChevronRight size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      {/* Map Modal for location selection */}
      <Modal
        visible={!!mapModal}
        animationType="slide"
        onRequestClose={() => setMapModal(null)}
      >
        <View style={styles.mapModalBg}>
          <Text style={styles.mapModalTitle}>Select Location</Text>
          <MapView
            style={styles.map}
            initialRegion={defaultRegion}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              if (mapModal === "provider")
                setDeliveryLocation({ lat: latitude, lng: longitude });
              if (mapModal === "self")
                setMeetLocation({ lat: latitude, lng: longitude });
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
          <TouchableOpacity
            style={styles.mapModalBtn}
            onPress={() => setMapModal(null)}
          >
            <Text style={styles.mapModalBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepperRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
  },
  stepperDot: {
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 2,
  },
  stepperDotActive: {
    backgroundColor: "#007AFF",
  },
  stepperText: {
    color: "#888",
    fontWeight: "bold",
    fontSize: 14,
  },
  stepperTextActive: {
    color: "#fff",
  },
  stepperNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    width: "100%",
  },
  stepperNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  stepperNavText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 4,
  },
  reviewLabel: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  reviewValue: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  successBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
    textAlign: "center",
  },
  successDesc: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  successBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  successBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  bg: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 18,
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
    minWidth: 120,
  },
  optionCardActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    elevation: 4,
  },
  optionText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  optionTextActive: {
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  chipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  chipTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  mapBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f6ff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  mapBtnText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 8,
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 18,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  mapModalBg: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    alignItems: "center",
  },
  mapModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  map: {
    width: "95%",
    height: 300,
    borderRadius: 16,
    marginBottom: 16,
  },
  mapModalBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 12,
  },
  mapModalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
