import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Heart, X } from "lucide-react-native";
import { useTranslation } from "@/constants/translations";
import { useTheme } from "@/hooks/useTheme";

const mockWishlist = [
  { id: "1", title: "Tablet", type: "goods" },
  { id: "2", title: "Cooking Lessons", type: "services" },
];

export default function Wishlist() {
  const { t } = useTranslation();
  const { colors, theme } = useTheme();
  const [wishlist, setWishlist] = React.useState(mockWishlist);
  const removeItem = (id: string) =>
    setWishlist(wishlist.filter((item) => item.id !== id));
  return (
    <View key={theme} style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={styles.title}>{t("wishlist")}</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Heart
              size={22}
              color={colors.primary}
              style={{ marginRight: 10 }}
            />
            <Text style={styles.item}>
              {item.title} ({item.type})
            </Text>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeItem(item.id)}
            >
              <X size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f3f6fa",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#222",
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  item: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  removeBtn: {
    backgroundColor: "#FF3366",
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
