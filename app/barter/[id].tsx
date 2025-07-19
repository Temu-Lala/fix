import * as React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useBarterStore } from "@/store/barterStore";
import {
  MessageSquare,
  Star,
  MapPin,
  Tag,
  X,
  Repeat,
} from "lucide-react-native";
import { useTranslation } from "@/constants/translations";
import { useTheme } from "@/hooks/useTheme";

const { width } = Dimensions.get("window");
const DEFAULT_IMAGE = "https://via.placeholder.com/400x300?text=No+Image";
const DEFAULT_LAT = 9.03,
  DEFAULT_LNG = 38.74;

export default function BarterDetails() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const barter = useBarterStore((s) => s.barters.find((b) => b.id === id));
  const [zoomImg, setZoomImg] = React.useState<string | null>(null);
  const { colors } = useTheme();

  if (!barter) {
    return (
      <View style={styles.bg}>
        <Text style={styles.notFound}>{t("barterNotFound")}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>{t("goBack")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Ensure images is always an array
  const images =
    Array.isArray(barter.images) && barter.images.length > 0
      ? barter.images
      : barter.image
      ? [barter.image]
      : [DEFAULT_IMAGE];

  // Parse location for map
  let lat = DEFAULT_LAT,
    lng = DEFAULT_LNG;
  if (barter.location && barter.location.includes(",")) {
    const parts = barter.location.split(",");
    if (parts.length >= 2) {
      lat = parseFloat(parts[0]) || DEFAULT_LAT;
      lng = parseFloat(parts[1]) || DEFAULT_LNG;
    }
  }

  return (
    <View style={styles.bg}>
      {/* Image Zoom Modal */}
      <Modal visible={!!zoomImg} transparent animationType="fade">
        <Pressable style={styles.zoomOverlay} onPress={() => setZoomImg(null)}>
          <View style={styles.zoomContainer}>
            <TouchableOpacity
              style={styles.zoomClose}
              onPress={() => setZoomImg(null)}
            >
              <X size={28} color="#fff" />
            </TouchableOpacity>
            {zoomImg && (
              <Image
                source={{ uri: zoomImg }}
                style={styles.zoomImg}
                resizeMode="contain"
              />
            )}
          </View>
        </Pressable>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.galleryScroll}
        >
          {images.map((img, idx) => (
            <TouchableOpacity
              key={img + idx}
              activeOpacity={0.95}
              onPress={() => setZoomImg(img)}
            >
              <Image
                source={{ uri: img || DEFAULT_IMAGE }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Badges and Title */}
        <View style={styles.badgeRow}>
          {barter.category && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {barter.category.toUpperCase()}
              </Text>
            </View>
          )}
          {barter.condition && (
            <View style={[styles.badge, { backgroundColor: "#4CAF50" }]}>
              <Text style={styles.badgeText}>{barter.condition}</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{barter.title || t("noTitle")}</Text>
        <View style={styles.row}>
          <View style={styles.rating}>
            <Star size={16} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#007AFF" />
            <Text style={styles.locationText} numberOfLines={1}>
              {barter.location && !barter.location.includes(",")
                ? barter.location
                : t("locationAvailable")}
            </Text>
          </View>
        </View>
        <Text style={styles.desc}>
          {barter.description || t("noDescriptionProvided")}
        </Text>
        {/* Map Preview */}
        {barter.location && barter.location.includes(",") && (
          <MapView
            style={styles.map}
            region={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            pointerEvents="none"
          >
            <Marker coordinate={{ latitude: lat, longitude: lng }} />
          </MapView>
        )}
        {/* User Info */}
        <View style={styles.userCard}>
          <Tag size={18} color="#007AFF" />
          <Text style={styles.userText}>
            {t("postedBy")}: {barter.user?.name || t("unknown")}
          </Text>
        </View>
      </ScrollView>
      {/* Sticky Barter Now & Chat Button */}
      <View style={styles.stickyBarRow}>
        <TouchableOpacity
          style={[styles.button, styles.barterBtn]}
          onPress={() =>
            router.push({
              pathname: "/barter/barter-now",
              params: { id: String(id) },
            })
          }
          activeOpacity={0.85}
        >
          <Repeat size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{t("barterNow")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.chatBtn]}
          onPress={() =>
            router.push({
              pathname: "/chat/[id]",
              params: { id: String(id), product: JSON.stringify(barter) },
            })
          }
          activeOpacity={0.85}
        >
          <MessageSquare size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>{t("chatWithSeller")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f3f6fa",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 120,
  },
  galleryScroll: {
    width: "100%",
    height: width > 400 ? 280 : 200,
    backgroundColor: "#eee",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 8,
  },
  galleryImage: {
    width: width,
    height: width > 400 ? 280 : 200,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 4,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 8,
    marginTop: 2,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 15,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "60%",
  },
  locationText: {
    marginLeft: 4,
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 14,
    maxWidth: 120,
  },
  desc: {
    fontSize: 16,
    color: "#444",
    marginBottom: 12,
    alignSelf: "flex-start",
    width: "100%",
  },
  map: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
    marginTop: 2,
    overflow: "hidden",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaf3ff",
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  userText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  stickyBarRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#FF6600",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    maxWidth: 400,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  notFound: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  zoomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomImg: {
    width: width,
    height: width,
    maxHeight: "80%",
    maxWidth: "100%",
  },
  zoomClose: {
    position: "absolute",
    top: 40,
    right: 24,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  barterBtn: {
    backgroundColor: "#FF6600",
    flex: 1,
    marginRight: 8,
  },
  chatBtn: {
    backgroundColor: "#007AFF",
    flex: 1,
    marginLeft: 8,
  },
});
