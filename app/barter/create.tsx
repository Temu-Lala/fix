import * as React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker, Region } from "react-native-maps";
import { useBarterStore } from "@/store/barterStore";
import { useRouter } from "expo-router";
import { Plus, Image as ImageIcon, X, MapPin } from "lucide-react-native";
import { useTranslation } from "@/constants/translations";
import { useTheme } from "@/hooks/useTheme";

const categories = ["goods", "services", "music", "user"];
const conditions = ["New", "Like New", "Used", "For Parts"];

export default function CreateBarter() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [images, setImages] = React.useState<string[]>([]);
  const [category, setCategory] = React.useState("goods");
  const [condition, setCondition] = React.useState("New");
  const [location, setLocation] = React.useState<string>("");
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [region, setRegion] = React.useState<Region | null>(null);
  const [marker, setMarker] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const addBarter = useBarterStore((s) => s.addBarter);
  const router = useRouter();

  // Image picker
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });
    if (!result.canceled) {
      const uris = (result.assets as ImagePicker.ImagePickerAsset[]).map(
        (a) => a.uri
      );
      setImages([...images, ...uris.filter((uri) => !images.includes(uri))]);
    }
  };

  const handleRemoveImage = (img: string) => {
    setImages(images.filter((i) => i !== img));
  };

  // Location picker
  const getLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow location access.");
        setLocationLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(`${loc.coords.latitude},${loc.coords.longitude}`);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setMarker({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      let rev = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (rev && rev.length > 0) {
        const addr = rev[0];
        setAddress(
          [addr.name, addr.street, addr.city, addr.region, addr.country]
            .filter(Boolean)
            .join(", ")
        );
      } else {
        setAddress(`${loc.coords.latitude},${loc.coords.longitude}`);
      }
    } catch (e) {
      Alert.alert("Error", "Could not get location");
    }
    setLocationLoading(false);
  };

  // When marker is moved, update address
  const onMarkerDragEnd = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion((r) => (r ? { ...r, latitude, longitude } : null));
    setLocation(`${latitude},${longitude}`);
    let rev = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (rev && rev.length > 0) {
      const addr = rev[0];
      setAddress(
        [addr.name, addr.street, addr.city, addr.region, addr.country]
          .filter(Boolean)
          .join(", ")
      );
    } else {
      setAddress(`${latitude},${longitude}`);
    }
  };

  const handleSubmit = () => {
    if (!title || !description || images.length === 0) {
      Alert.alert("Error", "Please fill all fields and add at least one image");
      return;
    }
    addBarter({
      id: Date.now().toString(),
      title,
      description,
      image: images[0], // main image
      images,
      user: { name: "You" },
      category,
      condition,
      location: address || location,
    });
    Alert.alert("Barter Posted!", "Your offer is now live.");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.bg}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Plus size={28} color={colors.primary} />
            <Text style={styles.title}>{t("postBarterOffer")}</Text>
          </View>
          <View style={styles.imageUploadWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              {images.map((img) => (
                <View key={img} style={styles.imagePreviewWrap}>
                  <Image source={{ uri: img }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImgBtn}
                    onPress={() => handleRemoveImage(img)}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addImgBtn}
                onPress={pickImages}
                activeOpacity={0.8}
              >
                <ImageIcon size={28} color={colors.textSecondary} />
              </TouchableOpacity>
            </ScrollView>
          </View>
          <TextInput
            placeholder={t("title")}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder={t("description")}
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 80 }]}
            multiline
          />
          <View style={styles.optionsRow}>
            <View style={styles.optionCol}>
              <Text style={styles.optionLabel}>{t("category")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.chip, category === cat && styles.chipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        category === cat && styles.chipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.optionCol}>
              <Text style={styles.optionLabel}>{t("condition")}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {conditions.map((cond) => (
                  <TouchableOpacity
                    key={cond}
                    style={[
                      styles.chip,
                      condition === cond && styles.chipActive,
                    ]}
                    onPress={() => setCondition(cond)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        condition === cond && styles.chipTextActive,
                      ]}
                    >
                      {cond}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          <View style={styles.locationRow}>
            <TextInput
              placeholder={t("location")}
              value={address || location}
              onChangeText={setAddress}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
            />
            <TouchableOpacity
              style={styles.locBtn}
              onPress={getLocation}
              activeOpacity={0.85}
            >
              {locationLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <MapPin size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
          {region && marker && (
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setMarker({ latitude, longitude });
                setRegion((r) => (r ? { ...r, latitude, longitude } : null));
                setLocation(`${latitude},${longitude}`);
                Location.reverseGeocodeAsync({ latitude, longitude }).then(
                  (rev) => {
                    if (rev && rev.length > 0) {
                      const addr = rev[0];
                      setAddress(
                        [
                          addr.name,
                          addr.street,
                          addr.city,
                          addr.region,
                          addr.country,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      );
                    } else {
                      setAddress(`${latitude},${longitude}`);
                    }
                  }
                );
              }}
            >
              <Marker
                coordinate={marker}
                draggable
                onDragEnd={onMarkerDragEnd}
              />
            </MapView>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{t("postBarter")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f3f6fa",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 24,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 10,
  },
  imageUploadWrap: {
    marginBottom: 16,
  },
  imageScroll: {
    flexDirection: "row",
    marginBottom: 8,
  },
  imagePreviewWrap: {
    position: "relative",
    marginRight: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f8fafd",
  },
  removeImgBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF3366",
    borderRadius: 10,
    padding: 2,
    zIndex: 2,
  },
  addImgBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f8fafd",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f8fafd",
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionCol: {
    flex: 1,
    marginRight: 8,
  },
  optionLabel: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  chip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 4,
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locBtn: {
    marginLeft: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 8,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#FF6600",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
