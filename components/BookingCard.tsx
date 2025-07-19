import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function BarterCard({ barter, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: barter.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{barter.title}</Text>
        <Text style={styles.desc}>{barter.description}</Text>
        <Text style={styles.user}>By {barter.user.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: { width: 80, height: 80 },
  info: { flex: 1, padding: 12 },
  title: { fontWeight: "bold", fontSize: 16 },
  desc: { color: "#555", marginVertical: 4 },
  user: { color: "#888", fontSize: 12 },
});
