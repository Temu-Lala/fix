import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+1234567890",
  skills: ["Guitar", "Gardening"],
  assets: ["Bike", "Books"],
};

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mockUser.name}</Text>
      <Text style={styles.label}>Email: {mockUser.email}</Text>
      <Text style={styles.label}>Phone: {mockUser.phone}</Text>
      <Text style={styles.section}>Skills:</Text>
      {mockUser.skills.map((skill) => (
        <Text key={skill} style={styles.item}>
          {skill}
        </Text>
      ))}
      <Text style={styles.section}>Assets:</Text>
      {mockUser.assets.map((asset) => (
        <Text key={asset} style={styles.item}>
          {asset}
        </Text>
      ))}
      <Button title="Edit Profile" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  item: { fontSize: 16, marginLeft: 12, marginBottom: 4 },
});
