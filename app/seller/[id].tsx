import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList, TextInput, Animated, Modal, Pressable } from "react-native";
// @ts-expect-error: lucide-react-native types may be missing
import { MessageCircle, Star, UserPlus, Flag, Check, AlertCircle, Pencil } from "lucide-react-native";
import { useTheme } from "@/hooks/useTheme";

// Add types
interface Review {
  id: string;
  user: string;
  rating: number;
  text: string;
  avatar: string;
}
interface Seller {
  name: string;
  avatar: string;
  cover: string;
  contact: string;
  rating: number;
  products: number;
  followers: number;
  reviews: number;
  bio: string;
  productList: { id: string; name: string; image: string; price: number }[];
  reviewList: Review[];
}

const mockSellers: { [key: string]: Seller } = {
  "kitchenpro-store": {
    name: "KitchenPro Store",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    cover: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    contact: "support@kitchenpro.com",
    rating: 4.9,
    products: 120,
    followers: 2345,
    reviews: 128,
    bio: "We provide premium kitchen appliances and accessories for modern homes. Trusted by thousands of customers.",
    productList: [
      { id: "1", name: "Smart Blender", image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308", price: 499.99 },
      { id: "2", name: "Juicer Pro", image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca", price: 299.99 },
      { id: "3", name: "Coffee Maker", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", price: 199.99 },
    ],
    reviewList: [
      { id: "r1", user: "Alice", rating: 5, text: "Great seller! Fast shipping.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { id: "r2", user: "Bob", rating: 4, text: "Product as described.", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    ],
  },
  // Add more sellers as needed
};

export default function SellerProfileScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const seller: Seller = mockSellers[id as string] || mockSellers["kitchenpro-store"];

  // Follow/Report state
  const [isFollowing, setIsFollowing] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [followAnim] = useState(new Animated.Value(1));
  const [reportAnim] = useState(new Animated.Value(1));
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(seller.reviewList);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [addAnim] = useState(new Animated.Value(1));
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleChat = () => {
    router.push(`/chat/${id}`);
  };
  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
    } else {
      Animated.sequence([
        Animated.timing(followAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
        Animated.timing(followAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
      ]).start(() => setIsFollowing(true));
    }
  };
  const handleReport = () => {
    if (isReported) {
      setIsReported(false);
      setReportReason(null);
    } else {
      setReportModalVisible(true);
    }
  };
  const handleSelectReportReason = (reason: string) => {
    setReportReason(reason);
    setIsReported(true);
    setReportModalVisible(false);
  };
  const handleProductPress = (pid: string) => {
    router.push(`/marketplace/${pid}`);
  };
  const handleAddReview = () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    Animated.sequence([
      Animated.timing(addAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(addAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setReviews([
        {
          id: `r${reviews.length + 1}`,
          user: "You",
          rating: reviewRating,
          text: reviewText,
          avatar: "https://randomuser.me/api/portraits/men/99.jpg",
        },
        ...reviews,
      ]);
      setReviewText("");
      setReviewRating(0);
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}> 
      {/* Report Reason Modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setReportModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Report Seller</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Why are you reporting this seller?</Text>
            {['Spam', 'Inappropriate', 'Fraud', 'Other'].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.modalReasonBtn}
                onPress={() => handleSelectReportReason(reason)}
              >
                <Text style={styles.modalReasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setReportModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {/* Cover Image (no edit button) */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: seller.cover }} style={styles.cover} />
      </View>
      {/* Avatar and Actions */}
      <View style={styles.avatarRow}>
        <Image source={{ uri: seller.avatar }} style={styles.avatar} />
        <View style={styles.actionBtns}>
          <Animated.View style={{ transform: [{ scale: followAnim }] }}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                isFollowing ? styles.actionBtnFollowingOutlined : styles.actionBtnFollowingSolid,
              ]}
              onPress={handleFollow}
              activeOpacity={0.8}
            >
              {isFollowing ? <Check size={18} color={colors.primary} /> : <UserPlus size={18} color="#fff" />}
              <Text style={isFollowing ? styles.actionBtnFollowingText : styles.actionBtnText}>
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: reportAnim }] }}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                isReported ? styles.actionBtnReportedOutlined : styles.actionBtnReportedSolid,
              ]}
              onPress={handleReport}
              activeOpacity={0.8}
            >
              <Flag size={18} color={isReported ? '#FFA500' : '#fff'} />
              <Text style={isReported ? styles.actionBtnReportedText : styles.actionBtnText}>
                {isReported ? "Reported" : "Report"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          {/* Chat Button in action row, blue color */}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnChat, { backgroundColor: colors.primary }]}
            onPress={handleChat}
            activeOpacity={0.85}
          >
            <MessageCircle size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Name, Stats, Bio */}
      <Text style={[styles.name, { color: colors.text }]}>{seller.name}</Text>
      <View style={styles.statsRow}>
        <Text style={styles.stat}><Star size={14} color="#FFD700" /> {seller.rating}</Text>
        <Text style={styles.stat}>{seller.followers} Followers</Text>
        <Text style={styles.stat}>{reviews.length} Reviews</Text>
      </View>
      <Text style={[styles.bio, { color: colors.textSecondary }]}>{seller.bio}</Text>
      {/* Products */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Products</Text>
      <FlatList
        data={seller.productList}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.productCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => handleProductPress(item.id)} activeOpacity={0.88}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfoBox}>
              <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>ETB {item.price.toFixed(2)}</Text>
              <View style={styles.productRatingRow}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.productRatingText, { color: colors.textSecondary }]}>4.8</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* Add Review Section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Review</Text>
      <Animated.View style={[styles.addReviewBox, { backgroundColor: colors.card, transform: [{ scale: addAnim }] }]}> 
        <Image source={{ uri: "https://randomuser.me/api/portraits/men/99.jpg" }} style={styles.reviewAvatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                <Star size={22} color={reviewRating >= star ? colors.primary : colors.border} fill={reviewRating >= star ? colors.primary : 'none'} style={{ marginRight: 2 }} />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={[styles.addReviewInput, { color: colors.text }]}
            placeholder="Write a review..."
            placeholderTextColor={colors.textSecondary}
            value={reviewText}
            onChangeText={setReviewText}
            multiline
          />
        </View>
        <TouchableOpacity style={[styles.addReviewBtn, { backgroundColor: colors.primary }]} onPress={handleAddReview}>
          <Text style={styles.addReviewBtnText}>Post</Text>
        </TouchableOpacity>
      </Animated.View>
      {/* Reviews */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Reviews</Text>
      {(showAllReviews ? reviews : reviews.slice(0, 5)).map((r: Review, idx) => (
        <Animated.View key={r.id} style={[styles.reviewRow, { opacity: 1 - (idx * 0.04) }]}> 
          <Image source={{ uri: r.avatar }} style={styles.reviewAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.reviewUser, { color: colors.text }]}>{r.user}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Star size={13} color="#FFD700" fill="#FFD700" />
              <Text style={styles.reviewRating}>{r.rating}</Text>
            </View>
            <Text style={[styles.reviewText, { color: colors.textSecondary }]}>{r.text}</Text>
          </View>
        </Animated.View>
      ))}
      {reviews.length > 5 && !showAllReviews && (
        <TouchableOpacity style={styles.seeMoreBtn} onPress={() => setShowAllReviews(true)}>
          <Text style={styles.seeMoreBtnText}>See More Reviews</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 32,
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
  },
  cover: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    marginBottom: -40,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  editCoverBtn: {
    position: 'absolute',
    top: 16,
    right: 18,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#4A80F0',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 20,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "90%",
    marginTop: -40,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  actionBtns: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  actionBtnFollowing: {
    backgroundColor: '#27ae60',
  },
  actionBtnReported: {
    backgroundColor: '#FFA500',
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 6,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 2,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 18,
    marginBottom: 6,
  },
  stat: {
    fontSize: 14,
    color: "#4A80F0",
    fontWeight: "600",
  },
  bio: {
    fontSize: 15,
    marginVertical: 10,
    textAlign: "center",
    width: "90%",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 16,
    alignSelf: "flex-start",
  },
  productList: {
    paddingLeft: 16,
    paddingBottom: 8,
  },
  productCard: {
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
    width: 140,
    shadowColor: '#4A80F0',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 8,
    borderWidth: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F0F4FF',
  },
  productInfoBox: {
    alignItems: 'center',
    width: '100%',
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
    minHeight: 36,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#4A80F0",
    marginBottom: 2,
  },
  productRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  productRatingText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
    fontWeight: '500',
  },
  addReviewBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addReviewInput: {
    flex: 1,
    fontSize: 14,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    minHeight: 36,
    maxHeight: 80,
  },
  addReviewBtn: {
    backgroundColor: '#4A80F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-end',
  },
  addReviewBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    marginLeft: 16,
    marginRight: 16,
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
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 18,
    alignSelf: "center",
  },
  chatBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  topChatRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    zIndex: 10,
  },
  topChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#4A80F0',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  topChatBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.2,
  },
  seeMoreBtn: {
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  seeMoreBtnText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  actionBtnChat: {
    backgroundColor: '#4A80F0',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    shadowColor: '#4A80F0',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  actionBtnEdit: {
    backgroundColor: '#4A80F0',
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    shadowColor: '#4A80F0',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  actionBtnUnfollow: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#4A80F0',
  },
  actionBtnUnreport: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#FFA500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalReasonBtn: {
    width: '100%',
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalReasonText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 16,
  },
  modalCancelBtn: {
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  modalCancelText: {
    color: '#888',
    fontWeight: '500',
    fontSize: 15,
  },
  actionBtnFollowingSolid: {
    backgroundColor: '#4A80F0',
  },
  actionBtnFollowingOutlined: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1.5,
    borderColor: '#4A80F0',
  },
  actionBtnFollowingText: {
    color: '#4A80F0',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
  actionBtnReportedSolid: {
    backgroundColor: '#FFA500',
  },
  actionBtnReportedOutlined: {
    backgroundColor: '#FFF7E6',
    borderWidth: 1.5,
    borderColor: '#FFA500',
  },
  actionBtnReportedText: {
    color: '#FFA500',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 6,
  },
}); 