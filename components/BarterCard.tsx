import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Barter } from "@/types/barter";

interface BarterCardProps {
  barter: Barter;
  onPress: () => void;
}

export default function BarterCard({ barter, onPress }: BarterCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: barter.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {barter.title}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {barter.description}
        </Text>
        <Text style={styles.user}>By {barter.user.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: "100%", height: 120 },
  info: { padding: 12 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  desc: { color: "#555", marginBottom: 4 },
  user: { color: "#888", fontSize: 12 },
});
