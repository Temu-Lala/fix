import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function EditProfile() {
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane@example.com");
  const [phone, setPhone] = useState("+1234567890");
  const [skills, setSkills] = useState("Guitar, Gardening");
  const [assets, setAssets] = useState("Bike, Books");

  const handleSave = () => {
    // TODO: Save logic
    Alert.alert("Profile Saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <TextInput
        placeholder="Skills (comma separated)"
        value={skills}
        onChangeText={setSkills}
        style={styles.input}
      />
      <TextInput
        placeholder="Assets (comma separated)"
        value={assets}
        onChangeText={setAssets}
        style={styles.input}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
});
