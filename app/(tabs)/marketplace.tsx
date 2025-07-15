import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, Search, Star, PlusCircle, ShoppingCart, Package } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import Theme from "@/constants/theme";
import { useTranslation } from "@/constants/translations";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  imageUri: string;
  description: string;
  inStock: boolean;
  categoryId: string;
}

// Define allowed translation keys for t()
type TranslationKey =
  | "all"
  | "appliances"
  | "plumbing"
  | "electrical"
  | "carpentry"
  | "marketplace"
  | "favorites"
  | "comingSoon"
  | "cart"
  | "itemsInCart"
  | "searchProducts"
  | "browseProducts"
  | "reviews"
  | "inStock"
  | "outOfStock"
  | "addToCart"
  | "addedToCart"
  | "productAddedToCart"
  | "alreadyInCart"
  | "productAlreadyInCart"
  | "loadMore";

const categories: { id: string; nameKey: TranslationKey; iconUri: string }[] = [
  { id: "0", nameKey: "all", iconUri: "https://cdn-icons-png.flaticon.com/512/3081/3081950.png" },
  { id: "1", nameKey: "appliances", iconUri: "https://cdn-icons-png.flaticon.com/512/3256/3256780.png" },
  { id: "2", nameKey: "plumbing", iconUri: "https://cdn-icons-png.flaticon.com/512/892/892458.png" },
  { id: "3", nameKey: "electrical", iconUri: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png" },
  { id: "4", nameKey: "carpentry", iconUri: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png" },
];

const allProducts: Product[] = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
  rating: parseFloat((Math.random() * 5).toFixed(1)),
  imageUri: `https://picsum.photos/200/200?random=${i + 1}`,
  description: `Premium ${categories[(i % 4) + 1].nameKey} product designed for durability and performance.`,
  inStock: Math.random() > 0.2,
  categoryId: categories[(i % 4) + 1].id,
}));

export default function MarketplaceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [cart, setCart] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [fadeAnim] = useState(new Animated.Value(0));
  const perPage = 6;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPage(1);
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredProducts = allProducts
    .filter((p) =>
      (selectedCategory === "0" || p.categoryId === selectedCategory) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()))
    )
    .slice(0, page * perPage);

  const onLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const onProductPress = (id: string) => {
    router.push(`/marketplace/${id}`);
  };

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
      Alert.alert(t("addedToCart"), t("productAddedToCart"));
    } else {
      Alert.alert(t("alreadyInCart"), t("productAlreadyInCart"));
    }
  };

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        {
          backgroundColor: selectedCategory === item.id ? colors.primary : colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => {
        setSelectedCategory(item.id);
        setPage(1);
      }}
    >
      <Image source={{ uri: item.iconUri }} style={styles.categoryIcon as any} />
      <Text
        style={[
          styles.categoryText,
          { color: selectedCategory === item.id ? "#fff" : colors.text },
        ]}
      >
        {t(item.nameKey)}
      </Text>
    </TouchableOpacity>
  );

  const CARD_GAP = 8; // px
  const CARD_WIDTH = (Dimensions.get('window').width - Theme.spacing.l * 2 - CARD_GAP) / 2;

  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    const scaleAnim = new Animated.Value(1);
    const isLastInRow = (index + 1) % 2 === 0;

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{
        transform: [{ scale: scaleAnim }],
        opacity: fadeAnim,
        width: CARD_WIDTH,
        marginRight: isLastInRow ? 0 : CARD_GAP,
        marginBottom: CARD_GAP,
      }}>
        <TouchableOpacity
          style={[
            styles.productCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={() => onProductPress(item.id)}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={0.92}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.imageUri }}
              style={styles.productImage as any}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => Alert.alert(t("favorites"), t("comingSoon"))}
            >
              <Heart size={18} color={colors.textSecondary} fill={cart.includes(item.id) ? colors.primary : 'none'} />
            </TouchableOpacity>
          </View>
          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
            <Text style={[styles.productPrice, { color: colors.primary }]}>ETB {item.price.toFixed(2)}</Text>
            <View style={styles.ratingRow}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.productRating}>{item.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.stockRow}>
              <Package size={14} color={item.inStock ? colors.success : colors.error} />
              <Text style={[styles.stockStatus, { color: item.inStock ? colors.success : colors.error }]}>
                {item.inStock ? t("inStock") : t("outOfStock")}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                { backgroundColor: item.inStock ? colors.primary : '#eee', opacity: item.inStock ? 1 : 0.5 },
              ]}
              onPress={() => item.inStock && addToCart(item.id)}
              disabled={!item.inStock}
            >
              <PlusCircle size={16} color="#fff" style={styles.addToCartIcon as any} />
              <Text style={styles.addToCartText}>{t("addToCart")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }] as any}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }] as any}>
              {t("marketplace")}
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => Alert.alert(t("favorites"), t("comingSoon"))}>
                <Heart size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert(t("cart"), `${cart.length} ${t("itemsInCart")}`)}
                style={styles.cartButton}
              >
                <ShoppingCart size={24} color={colors.text} />
                {cart.length > 0 && (
                  <View style={[styles.cartBadge, { backgroundColor: colors.error }] as any}>
                    <Text style={styles.cartCount as any}>{cart.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.searchContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ] as any}
          >
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon as any} />
            <TextInput
              placeholder={t("searchProducts")}
              placeholderTextColor={colors.textSecondary}
              style={[styles.searchInput, { color: colors.text }] as any}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={renderCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer as any}
          />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }] as any}>
              {t("browseProducts")}
            </Text>
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={renderProduct}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.column as any}
              contentContainerStyle={{ paddingHorizontal: 16 } as any}
            />
            {filteredProducts.length < allProducts.filter(p => selectedCategory === "0" || p.categoryId === selectedCategory).length && (
              <TouchableOpacity
                onPress={onLoadMore}
                style={[styles.loadMoreButton, { backgroundColor: colors.primary }] as any}
              >
                <Text style={styles.loadMoreText as any}>{t("loadMore")}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: Theme.spacing.xxl }} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    padding: Theme.spacing.s,
    alignItems: "center" as const,
  },
  headerActions: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: Theme.spacing.l,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: "bold" as const,
    letterSpacing: 0.,
  },
  cartButton: {
    position: "relative" as const,
    padding: Theme.spacing.s,
  },
  cartBadge: {
    position: "absolute" as const,
    top: -5,
    right: -5,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  cartCount: {
    color: "#fff",
    fontSize: Theme.fontSize.xs,
    fontWeight: "bold" as const,
  },
  searchContainer: {
    flexDirection: "row" as const,
    marginHorizontal: Theme.spacing.l,
    marginBottom: Theme.spacing.m,
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.m,
    borderWidth: 1,
    alignItems: "center" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.s,
    fontSize: Theme.fontSize.m,
  },
  searchIcon: {
    marginLeft: Theme.spacing.s,
  },
  categoryContainer: {
    paddingHorizontal: Theme.spacing.l,
    paddingVertical: Theme.spacing.s,
  },
  categoryButton: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: Theme.spacing.s,
    borderRadius: Theme.borderRadius.m,
    marginRight: Theme.spacing.s,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: Theme.spacing.xs,
  },
  categoryText: {
    fontSize: Theme.fontSize.s,
    fontWeight: "500" as const, // medium
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: "600" as const, // semiBold
    marginHorizontal: Theme.spacing.l,
    marginBottom: Theme.spacing.m,
  },
  column: {
    marginBottom: Theme.spacing.xs,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: Theme.spacing.xs,
  },
  productCard: {
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: "#fff",
    minHeight: 260,
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 16,
    padding: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  productInfo: {
    marginTop: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
    minHeight: 36,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E94E3C',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  productRating: {
    marginLeft: 4,
    fontSize: 13,
    color: '#888',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  addToCartIcon: {
    marginRight: 2,
  },
  loadMoreButton: {
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.l,
    alignItems: "center" as const,
    marginHorizontal: Theme.spacing.l,
    marginTop: Theme.spacing.m,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadMoreText: {
    color: "#fff",
    fontSize: Theme.fontSize.m,
    fontWeight: "600" as const, // semiBold
  },
});