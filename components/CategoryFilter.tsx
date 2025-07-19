import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

const categories = [
  { key: "all", label: "All" },
  { key: "goods", label: "Goods" },
  { key: "services", label: "Services" },
];

export default function CategoryFilter({
  selected,
  onSelect,
  style,
}: {
  selected: string;
  onSelect: (key: string) => void;
  style?: ViewStyle;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scroll, style]}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.key}
          style={[styles.chip, selected === cat.key && styles.chipActive]}
          onPress={() => onSelect(cat.key)}
        >
          <Text
            style={[styles.text, selected === cat.key && styles.textActive]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 8, paddingHorizontal: 8, backgroundColor: "#fff" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  chipActive: { backgroundColor: "#007AFF" },
  text: { color: "#333", fontWeight: "500" },
  textActive: { color: "#fff" },
});
