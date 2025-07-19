import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export default function Verify() {
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }
    // TODO: Verification logic
    Alert.alert("Verified!", "Your account is now active.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Account</Text>
      <TextInput
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="number-pad"
      />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
});
