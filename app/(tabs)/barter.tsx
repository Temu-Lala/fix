import * as React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Animated,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  Heart,
  Star,
  Filter,
  ChevronDown,
  Plus,
  Repeat,
  Zap,
  ShoppingBag,
  Book,
  Music,
  User,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useBarterStore } from "@/store/barterStore";

const HERO_IMAGE =
  "https://img.alicdn.com/imgextra/i4/6000000000427/O1CN01Qw1k6B1F1nQ2r0RkA_!!6000000000427-0-tbvideo.jpg";
const { width } = Dimensions.get("window");

const categories = [
  { key: "all", label: "All", icon: <ShoppingBag size={20} color="#007AFF" /> },
  { key: "goods", label: "Goods", icon: <Book size={20} color="#FF9800" /> },
  {
    key: "services",
    label: "Services",
    icon: <Zap size={20} color="#4CAF50" />,
  },
  { key: "music", label: "Music", icon: <Music size={20} color="#E91E63" /> },
  { key: "user", label: "People", icon: <User size={20} color="#9C27B0" /> },
];

function ProductCard({ product, onPress, onWishlist }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.imageWrap}>
        <ImageBackground
          source={{ uri: product.image }}
          style={styles.image}
          imageStyle={{ borderRadius: 16 }}
        >
          {product.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.heart} onPress={onWishlist}>
            <Heart
              size={18}
              color={product.wishlisted ? "#FF3366" : "#fff"}
              fill={product.wishlisted ? "#FF3366" : "none"}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.row}>
          <View style={styles.rating}>
            <Star size={13} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
          <View style={styles.userBadge}>
            <User size={13} color="#007AFF" />
          </View>
        </View>
        <TouchableOpacity style={styles.cta}>
          <Text style={styles.ctaText}>Barter Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function BarterTab() {
  const router = useRouter();
  const { barters } = useBarterStore();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState("Newest");
  const [wishlist, setWishlist] = React.useState({});
  const fabAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(fabAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, []);

  const filtered = barters
    .filter(
      (b) =>
        (category === "all" || b.category === category) &&
        (b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.description.toLowerCase().includes(search.toLowerCase()))
    )
    .map((b) => ({
      ...b,
      wishlisted: wishlist[b.id],
      badge:
        b.category === "goods"
          ? "HOT"
          : b.category === "services"
          ? "NEW"
          : undefined,
    }));

  return (
    <View style={styles.bg}>
      <ImageBackground
        source={{ uri: HERO_IMAGE }}
        style={styles.hero}
        imageStyle={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Barter Express</Text>
          <Text style={styles.heroSubtitle}>
            Discover, connect, and trade like a pro!
          </Text>
          {/* Add a search bar here if you want */}
        </View>
      </ImageBackground>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catRow}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.catChip,
              category === cat.key && styles.catChipActive,
            ]}
            onPress={() => setCategory(cat.key)}
          >
            {cat.icon}
            <Text
              style={[
                styles.catText,
                category === cat.key && styles.catTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter size={18} color="#007AFF" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortText}>{sort}</Text>
          <ChevronDown size={16} color="#888" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/barter/${item.id}`)}
            onWishlist={() =>
              setWishlist((w) => ({ ...w, [item.id]: !w[item.id] }))
            }
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>No items found.</Text>}
      />
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [
              { scale: fabAnim },
              {
                translateY: fabAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [80, 0],
                }),
              },
            ],
            shadowOpacity: Platform.OS === "ios" ? 0.25 : 0.2,
          },
        ]}
        accessible
        accessibilityLabel="Post your good"
      >
        <TouchableOpacity
          style={styles.fabBtn}
          onPress={() => router.push("/barter/create")}
          activeOpacity={0.85}
        >
          <Plus size={28} color="#fff" />
          <Text style={styles.fabText}>Post Your Good</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: "#f5f5f5" },
  hero: {
    height: 200,
    width: width,
    position: "relative",
    marginBottom: 10,
  },
  heroImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 16,
  },
  heroContent: {
    position: "absolute",
    top: "50%",
    left: 20,
    transform: [{ translateY: -50 }],
    zIndex: 1,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: 16,
  },
  catScroll: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  catRow: {
    alignItems: "center",
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  catChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  catText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  catTextActive: {
    color: "#fff",
  },
  filterBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sortText: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Add padding for the FAB
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: "relative",
  },
  imageWrap: { position: "relative" },
  image: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  badge: {
    position: "absolute",
    left: 10,
    top: 10,
    backgroundColor: "#FF9800",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 2,
    zIndex: 2,
  },
  info: { padding: 12 },
  title: { fontWeight: "bold", fontSize: 15, marginBottom: 4, color: "#222" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: {
    marginLeft: 2,
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 13,
  },
  userBadge: { backgroundColor: "#eaf3ff", borderRadius: 8, padding: 3 },
  cta: {
    marginTop: 4,
    backgroundColor: "#FF6600",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 8,
  },
  ctaText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FF6600",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    marginTop: 4,
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    paddingVertical: 20,
    color: "#888",
  },
});
