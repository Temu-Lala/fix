import React, { useState, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Heart, Star, MessageCircle, ShoppingCart, CreditCard, User } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Mock product data (replace with real data fetching in production)
const mockProducts = [
  {
    id: "1",
    name: "Premium Smart Blender 2024",
    price: 499.99,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    ],
    description:
      "This premium smart blender features a powerful motor, touch controls, and a sleek design. Perfect for smoothies, soups, and more. 2-year warranty included.",
    rating: 4.7,
    reviewsCount: 128,
    inStock: true,
    seller: {
      name: "KitchenPro Store",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      contact: "support@kitchenpro.com",
      rating: 4.9,
      products: 120,
    },
  },
  // ...add more mock products as needed
];

const mockReviews = [
  {
    id: "r1",
    user: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Amazing blender! Super powerful and easy to clean.",
    date: "2024-05-01",
  },
  {
    id: "r2",
    user: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    text: "Works well, but a bit noisy.",
    date: "2024-04-28",
  },
  {
    id: "r3",
    user: "Cathy",
    avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    rating: 5,
    text: "Best kitchen purchase this year!",
    date: "2024-04-20",
  },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);
  const [buyAnim] = useState(new Animated.Value(1));
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(mockReviews);
  const scrollRef = useRef<FlatList>(null);

  // Find the product by id (mock for now)
  const product = mockProducts.find((p) => p.id === id) || mockProducts[0];
  const sellerId = product.seller.name.toLowerCase().replace(/\s+/g, '-');

  const handleAddToCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1200);
    Alert.alert("Added to Cart", "Product has been added to your cart.");
  };

  const handleContactSeller = () => {
    router.push(`/chat/${sellerId}`);
  };
  const handleSellerProfile = () => {
    router.push(`/seller/${sellerId}`);
  };
  const handleBuyNow = () => {
    router.push(`/checkout/${product.id}`);
  };

  const handleAddReview = () => {
    if (!reviewText.trim()) return;
    setReviews([
      {
        id: `r${reviews.length + 1}`,
        user: "You",
        avatar: "https://randomuser.me/api/portraits/men/99.jpg",
        rating: 5,
        text: reviewText,
        date: new Date().toISOString().slice(0, 10),
      },
      ...reviews,
    ]);
    setReviewText("");
    Alert.alert("Thank you!", "Your review has been added.");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <FlatList
          ref={scrollRef}
          data={product.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => `img${i}`}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => setSelectedImage(index)}
            >
              <Image
                source={{ uri: item }}
                style={[
                  styles.productImage,
                  selectedImage === index && { borderColor: colors.primary, borderWidth: 2 },
                ]}
              />
            </TouchableOpacity>
          )}
          onMomentumScrollEnd={e => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setSelectedImage(idx);
          }}
          style={styles.carousel}
        />
        {/* Image indicators */}
        <View style={styles.indicatorRow}>
          {product.images.map((_, i) => (
            <View
              key={i}
              style={[styles.indicator, selectedImage === i && { backgroundColor: colors.primary }]}
            />
          ))}
        </View>

        {/* Product Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.card }]}> 
          <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>ETB {product.price.toFixed(2)}</Text>
            <View style={styles.ratingBox}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{product.rating} ({product.reviewsCount})</Text>
            </View>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>
          <View style={styles.stockRow}>
            <Text style={[styles.stock, { color: product.inStock ? colors.success : colors.error }]}> 
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </View>
        </View>

        {/* Seller Info */}
        <View style={[styles.sellerBox, { backgroundColor: colors.card }]}> 
          <TouchableOpacity onPress={handleSellerProfile}>
            <Image source={{ uri: product.seller.avatar }} style={styles.sellerAvatar} />
            <Text style={[styles.sellerName, { color: colors.text }]}>{product.seller.name}</Text>
          </TouchableOpacity>
          <Text style={[styles.sellerMeta, { color: colors.textSecondary }]}>Rating: {product.seller.rating} | Products: {product.seller.products}</Text>
          <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primary }]} onPress={handleContactSeller}>
            <MessageCircle size={18} color="#fff" />
            <Text style={styles.contactBtnText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: cartAdded ? colors.success : colors.primary }]}
            onPress={handleAddToCart}
            activeOpacity={0.85}
          >
            <ShoppingCart size={20} color="#fff" />
            <Text style={styles.actionBtnText}>{cartAdded ? "Added" : "Add to Cart"}</Text>
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ scale: buyAnim }] }}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
              onPress={handleBuyNow}
              activeOpacity={0.85}
            >
              <CreditCard size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Buy Now</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Reviews Section */}
        <View style={[styles.reviewsBox, { backgroundColor: colors.card }]}> 
          <Text style={[styles.reviewsTitle, { color: colors.text }]}>Reviews</Text>
          <FlatList
            data={reviews}
            keyExtractor={r => r.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[styles.reviewUser, { color: colors.text }]}>{item.user}</Text>
                    <Star size={13} color="#FFD700" fill="#FFD700" style={{ marginLeft: 4 }} />
                    <Text style={styles.reviewRating}>{item.rating}</Text>
                  </View>
                  <Text style={[styles.reviewText, { color: colors.textSecondary }]}>{item.text}</Text>
                  <Text style={styles.reviewDate}>{item.date}</Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
            style={{ marginBottom: 8 }}
          />
          {/* Add Review */}
          <View style={styles.addReviewBox}>
            <Image source={{ uri: "https://randomuser.me/api/portraits/men/99.jpg" }} style={styles.reviewAvatar} />
            <TextInput
              style={[styles.addReviewInput, { color: colors.text }]}
              placeholder="Write a review..."
              placeholderTextColor={colors.textSecondary}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />
            <TouchableOpacity style={[styles.addReviewBtn, { backgroundColor: colors.primary }]} onPress={handleAddReview}>
              <Text style={styles.addReviewBtnText}>Post</Text>
            </TouchableOpacity>
          </View>
    </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  carousel: {
    width: SCREEN_WIDTH,
    height: 260,
    backgroundColor: "#fff",
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: 260,
    resizeMode: "cover",
    borderRadius: 0,
  },
  indicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 3,
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A80F0",
    marginRight: 12,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  stock: {
    fontSize: 14,
    fontWeight: "600",
  },
  sellerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  sellerMeta: {
    fontSize: 13,
    color: "#888",
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A80F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  contactBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginBottom: 12,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A80F0",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  reviewsBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  reviewUser: {
    fontWeight: "600",
    fontSize: 14,
    color: "#222",
  },
  reviewRating: {
    fontSize: 13,
    color: "#FFD700",
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  addReviewBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    padding: 8,
  },
  addReviewInput: {
    flex: 1,
    fontSize: 14,
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    minHeight: 36,
    maxHeight: 80,
  },
  addReviewBtn: {
    backgroundColor: "#4A80F0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-end",
  },
  addReviewBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
