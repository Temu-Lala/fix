import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const mockReputation = {
  rating: 4.8,
  trades: 12,
  feedback: [
    { id: "1", from: "Alice", comment: "Great to trade with!" },
    { id: "2", from: "Bob", comment: "Very reliable." },
  ],
};

export default function Reputation() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reputation</Text>
      <Text style={styles.score}>
        ⭐ {mockReputation.rating} ({mockReputation.trades} trades)
      </Text>
      <FlatList
        data={mockReputation.feedback}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.from}>{item.from}:</Text>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  score: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  row: { flexDirection: "row", marginBottom: 8 },
  from: { fontWeight: "bold", marginRight: 8 },
  comment: { flex: 1 },
});
