import * as React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { useTranslation } from "@/constants/translations";
import { useTheme } from "@/hooks/useTheme";

const mockHistory = [
  { id: "1", title: "Bike for Books", status: "Completed", rating: 5 },
  { id: "2", title: "Guitar Lessons", status: "Pending", rating: null },
];

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Completed"
      ? "#4CAF50"
      : status === "Pending"
      ? "#FFA500"
      : "#888";
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{status}</Text>
    </View>
  );
}

export default function BarterHistory() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={styles.bg}>
      <Text style={styles.title}>{t("tradeHistory")}</Text>
      <FlatList
        data={mockHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.deal}>{item.title}</Text>
            <StatusBadge status={item.status} />
            {item.rating ? (
              <View style={styles.ratingRow}>
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} color="#FFD700" />
                ))}
              </View>
            ) : null}
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
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  deal: {
    flex: 2,
    fontSize: 16,
    color: "#333",
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
