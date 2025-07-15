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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Heart,
  Search,
  Star,
  PlusCircle,
  ListCheck,
} from "lucide-react-native";
import { useRouter } from "expo-router";

import { useTheme } from "@/hooks/useTheme";
import Theme from "@/constants/theme";
import { useTranslation } from "@/constants/translations";

// Sample category data — ideally comes from backend or constants
const categories = [
  {
    id: "1",
    nameKey: "appliances",
    iconUri: "https://cdn-icons-png.flaticon.com/512/3256/3256780.png",
  },
  {
    id: "2",
    nameKey: "plumbing",
    iconUri: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  },
  {
    id: "3",
    nameKey: "electrical",
    iconUri: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
  },
  {
    id: "4",
    nameKey: "carpentry",
    iconUri: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
  },
];

// Sample product data
const products = Array.from({ length: 10 }).map((_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  price: (Math.random() * 100 + 10).toFixed(2),
  rating: (Math.random() * 5).toFixed(1),
  imageUri: "https://cdn-icons-png.flaticon.com/512/3161/3161158.png",
}));

export default function MarketplaceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Filter products by search text (case insensitive)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const onCategoryPress = (categoryName: string) => {
    Alert.alert(t("categories"), `${t(categoryName)}`);
    // You can add category filtering logic here
  };

  const onProductPress = (id: string) => {
    router.push(`/marketplace/${id}`);
  };

  const onSellYourItemsPress = () => {
    Alert.alert(t("sellYourItems"), "Navigate to Sell Your Items screen");
    // Implement navigation
  };

  const onMyListingsPress = () => {
    Alert.alert(t("myListings"), "Navigate to My Listings screen");
    // Implement navigation
  };

  const onAddNewListingPress = () => {
    Alert.alert(t("addNewListing"), "Navigate to Add New Listing screen");
    // Implement navigation
  };

  const renderCategory = ({ item }: { item: (typeof categories)[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: colors.card }]}
      key={item.id}
      activeOpacity={0.7}
      onPress={() => onCategoryPress(item.nameKey)}
    >
      <Image source={{ uri: item.iconUri }} style={styles.categoryIcon} />
      <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
        {t(item.nameKey)}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }: { item: (typeof products)[0] }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.card }]}
      onPress={() => onProductPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUri }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: colors.error }]}>
          ${item.price}
        </Text>
        <View style={styles.ratingRow}>
          <Star size={14} color="#FFD700" />
          <Text style={[styles.productRating, { color: colors.textSecondary }]}>
            {item.rating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("marketplace")}
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert(t("savedFixers"), "Go to favorites")}
          >
            <Heart size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Search
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder={t("searchProducts")}
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("categories")}
          </Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderCategory}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Products */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("browseProducts")}
          </Text>
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderProduct}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <Text style={{ color: colors.textSecondary, padding: 20 }}>
              {t("error")}: {t("noItemsFound") || "No items found"}
            </Text>
          )}
        </View>

        {/* Sell Your Items Banner */}
        <TouchableOpacity
          style={[styles.banner, { backgroundColor: colors.secondary }]}
          onPress={onSellYourItemsPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.bannerText, { color: colors.text }]}>
            {t("sellYourItems")}
          </Text>
        </TouchableOpacity>

        {/* My Listings & Add New Listing Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={onMyListingsPress}
            activeOpacity={0.7}
          >
            <ListCheck size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              {t("myListings")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={onAddNewListingPress}
            activeOpacity={0.7}
          >
            <PlusCircle size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              {t("addNewListing")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Theme.spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Theme.spacing.l,
    alignItems: "center",
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
  },
  searchContainer: {
    flexDirection: "row",
    marginHorizontal: Theme.spacing.l,
    marginBottom: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.s,
    borderWidth: 1,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.s,
    fontSize: Theme.fontSize.m,
  },
  searchIcon: {
    marginLeft: Theme.spacing.s,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: Theme.fontSize.l,
    fontWeight: Theme.fontWeight.semiBold,
    marginHorizontal: Theme.spacing.l,
    marginBottom: Theme.spacing.m,
  },
  categoriesList: {
    paddingLeft: Theme.spacing.l,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: Theme.spacing.m,
    padding: Theme.spacing.s,
    borderRadius: Theme.borderRadius.m,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.m,
    backgroundColor: "#ddd",
  },
  categoryText: {
    marginTop: Theme.spacing.s,
    fontSize: Theme.fontSize.s,
  },
  horizontalList: {
    paddingLeft: Theme.spacing.l,
  },
  productCard: {
    marginRight: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    width: 160,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: Theme.borderRadius.s,
  },
  productInfo: {
    marginTop: Theme.spacing.s,
  },
  productName: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.medium,
  },
  productPrice: {
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Theme.spacing.xs,
  },
  productRating: {
    marginLeft: Theme.spacing.xs,
    fontSize: Theme.fontSize.s,
  },
  banner: {
    marginHorizontal: Theme.spacing.l,
    padding: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
  },
  bannerText: {
    fontWeight: Theme.fontWeight.semiBold,
    fontSize: Theme.fontSize.m,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: Theme.spacing.l,
    marginBottom: Theme.spacing.xl,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.s,
    paddingHorizontal: Theme.spacing.m,
    borderRadius: Theme.borderRadius.m,
    borderWidth: 1,
    borderColor: Theme.colors?.primary || "#007AFF",
  },
  actionButtonText: {
    marginLeft: Theme.spacing.s,
    fontSize: Theme.fontSize.m,
    fontWeight: Theme.fontWeight.semiBold,
  },
});
