import React from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";

const mockWallet = {
  credits: 120,
  transactions: [
    { id: "1", type: "Earned", amount: 50, desc: "Barter with Alice" },
    { id: "2", type: "Spent", amount: -30, desc: "Barter with Bob" },
    { id: "3", type: "Earned", amount: 100, desc: "Barter with Charlie" },
  ],
};

export default function Wallet() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <Text style={styles.credits}>Barter Credits: {mockWallet.credits}</Text>
      <FlatList
        data={mockWallet.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.txnRow}>
            <Text style={styles.txnType}>{item.type}</Text>
            <Text style={styles.txnAmount}>
              {item.amount > 0 ? "+" : ""}
              {item.amount}
            </Text>
            <Text style={styles.txnDesc}>{item.desc}</Text>
          </View>
        )}
        style={styles.txnList}
      />
      <Button title="Add/Withdraw Credits" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  credits: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  txnList: { marginBottom: 16 },
  txnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  txnType: { fontWeight: "bold", width: 80 },
  txnAmount: { width: 60, textAlign: "right" },
  txnDesc: { flex: 1, marginLeft: 8 },
});
