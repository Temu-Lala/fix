import * as React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import { useTranslation } from "@/constants/translations";
import { useTheme } from "@/hooks/useTheme";

const mockMessages = [
  { id: "1", sender: "Alice", text: "Hi! Interested in your offer." },
  { id: "2", sender: "You", text: "Great! What do you have to trade?" },
];

export default function BarterChat() {
  const { t } = useTranslation();
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = React.useState(mockMessages);
  const [input, setInput] = React.useState("");
  const { colors, theme } = useTheme();

  const handleSend = () => {
    if (!input) return;
    setMessages([
      ...messages,
      { id: String(messages.length + 1), sender: "You", text: input },
    ]);
    setInput("");
  };

  return (
    <View key={theme} style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === "You" ? styles.myMsgWrap : styles.otherMsgWrap
            }
          >
            <Text
              style={item.sender === "You" ? styles.myMsg : styles.otherMsg}
            >
              <Text style={styles.sender}>{item.sender}: </Text>
              {item.text}
            </Text>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={{ paddingVertical: 12 }}
        inverted
      />
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder={t("typeMessage")}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          activeOpacity={0.85}
        >
          <Send size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f3f6fa",
    padding: 0,
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
  },
  myMsgWrap: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  otherMsgWrap: {
    alignItems: "flex-start",
    marginBottom: 8,
  },
  myMsg: {
    backgroundColor: "#e0f7fa",
    color: "#222",
    padding: 10,
    borderRadius: 16,
    maxWidth: "80%",
    fontSize: 15,
    overflow: "hidden",
  },
  otherMsg: {
    backgroundColor: "#fff",
    color: "#222",
    padding: 10,
    borderRadius: 16,
    maxWidth: "80%",
    fontSize: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sender: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f8fafd",
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
