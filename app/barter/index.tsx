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
import { useTranslation } from "@/constants/translations";
import { useTheme } from "@/hooks/useTheme";

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
      <ImageBackground
        source={{ uri: product.image }}
        style={styles.image}
        imageStyle={{ borderRadius: 16 }}
      >
        <TouchableOpacity style={styles.heart} onPress={onWishlist}>
          <Heart
            size={20}
            color={product.wishlisted ? "#FF3366" : "#fff"}
            fill={product.wishlisted ? "#FF3366" : "none"}
          />
        </TouchableOpacity>
        {product.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </ImageBackground>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>Barter for</Text>
          <View style={styles.rating}>
            <Star size={14} color="#FFD700" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cta}>
          <Text style={styles.ctaText}>Barter Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function BarterFeed() {
  const router = useRouter();
  const { barters } = useBarterStore();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState("Newest");
  const [wishlist, setWishlist] = React.useState({});
  const fabAnim = React.useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const { colors } = useTheme();

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
          <View style={styles.heroSearchWrap}>
            <View style={styles.heroSearchBar}>
              <Text
                style={{ color: colors.textSecondary, fontSize: 16, flex: 1 }}
              >
                🔍
              </Text>
              <Text
                style={{ color: colors.textSecondary, fontSize: 16, flex: 8 }}
              >
                Search goods, services...
              </Text>
            </View>
          </View>
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
          <Filter size={18} color={colors.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortText}>{sort}</Text>
          <ChevronDown size={16} color={colors.textSecondary} />
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
  bg: {
    flex: 1,
    backgroundColor: "#f3f6fa",
  },
  hero: {
    width: "100%",
    height: width > 400 ? 220 : 180,
    justifyContent: "flex-end",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    padding: 24,
    alignItems: "center",
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  heroSubtitle: {
    color: "#f3f6fa",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSearchWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  heroSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: width - 64,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  catScroll: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  catRow: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f6fa",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  catChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  catText: {
    marginLeft: 6,
    color: "#333",
    fontWeight: "500",
  },
  catTextActive: {
    color: "#fff",
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f6fa",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterText: {
    color: "#007AFF",
    fontWeight: "bold",
    marginLeft: 6,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f6fa",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortText: {
    color: "#333",
    fontWeight: "bold",
    marginRight: 4,
  },
  list: {
    paddingBottom: 120,
    paddingTop: 8,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 8,
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
  image: { width: "100%", height: 120, borderRadius: 16 },
  heart: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    left: 12,
    top: 12,
    backgroundColor: "#FF9800",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  info: { padding: 12 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { color: "#007AFF", fontWeight: "bold" },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { marginLeft: 2, color: "#FFD700", fontWeight: "bold" },
  cta: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 8,
  },
  ctaText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    zIndex: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  fabBtn: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  fabText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  empty: { textAlign: "center", color: "#888", marginTop: 32 },
});
