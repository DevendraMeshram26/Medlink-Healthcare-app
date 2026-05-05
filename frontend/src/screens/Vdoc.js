import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, Bubble, InputToolbar, Send } from "react-native-gifted-chat";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import { IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { theme } from "../config/theme";

const CHAT_STORAGE_KEY = "@vdoc_chat_history";

/**
 * Virtual Doctor chat screen.
 * Uses GiftedChat with teal palette. Chat history persists via AsyncStorage.
 */
const Vdoc = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);

  /** Load saved chat history on mount */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Restore Date objects (they get stringified in JSON)
          const restored = parsed.map((m) => ({
            ...m,
            createdAt: new Date(m.createdAt),
          }));
          setMessages(restored);
        } else {
          // First time — send initial greeting
          myPrompt("hey");
        }
      } catch {
        myPrompt("hey");
      }
    };
    loadHistory();
  }, []);

  /** Save chat history whenever messages change */
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const myPrompt = (text) => {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY || ""}`,
      },
    };
    const data = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are Dr. AI, a friendly medical assistant on the Medlink app. Follow these rules strictly:\n\n1. Keep responses SHORT and scannable (max 150 words)\n2. Use this structure for symptom queries:\n   - Likely Condition: (1 line)\n   - Severity: Mild/Moderate/Severe\n   - Quick Relief: 2-3 bullet points\n   - See a Doctor if: (1 line condition)\n   - Specialist: type of doctor\n3. For diet/medication queries, give 3-5 concise bullet points\n4. Never use asterisks (**) for formatting. Use dashes (-) for lists\n5. Always end with a brief reassuring line\n6. If symptoms sound serious, prioritize recommending a doctor visit\n7. Never diagnose definitively - use phrases like 'this could be' or 'commonly associated with'",
        },
        {
          role: "user",
          content: `${text}`,
        },
      ],
      temperature: 0.7,
      stream: false,
    };

    if (!process.env.EXPO_PUBLIC_GROQ_API_KEY) {
      alert(
        "Groq API is not configured. Please add EXPO_PUBLIC_GROQ_API_KEY to your .env file."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .post(url, data, config)
      .then((res) => {
        let result = res.data.choices[0]["message"]["content"];

        let my_value = [
          {
            _id: uuidv4(),
            text: result,
            createdAt: new Date(),
            user: {
              _id: 1,
              name: "Dr. AI",
              avatar: require("../../assets/svg/docAvatar.png"),
            },
          },
        ];

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, my_value)
        );
        setLoading(false);
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message || "Something went wrong.");
        setLoading(false);
      });
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    myPrompt(messages[0]?.text);
  }, []);

  /** Clear chat history */
  const handleClearChat = () => {
    Alert.alert("Clear Chat", "Are you sure you want to clear all messages?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
          setMessages([]);
          myPrompt("hey");
        },
      },
    ]);
  };

  /** Custom chat bubble styling */
  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radii.lg,
          paddingVertical: 2,
          paddingHorizontal: 4,
        },
        left: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          paddingVertical: 2,
          paddingHorizontal: 4,
          borderWidth: 1,
          borderColor: "#E2E8F0",
        },
      }}
      textStyle={{
        right: {
          fontFamily: theme.typography.fontFamilies.regular,
          fontSize: theme.typography.sizes.base,
          color: "#FFFFFF",
          lineHeight: 22,
        },
        left: {
          fontFamily: theme.typography.fontFamilies.regular,
          fontSize: theme.typography.sizes.base,
          color: theme.colors.textPrimary,
          lineHeight: 22,
        },
      }}
    />
  );

  /** Custom input toolbar */
  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={{ alignItems: "center" }}
    />
  );

  /** Custom send button */
  const renderSend = (props) => (
    <Send {...props} containerStyle={styles.sendButton}>
      <IconButton icon="send" iconColor={theme.colors.primary} size={24} />
    </Send>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Chat Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerDot} />
            <View>
              <Text style={styles.headerTitle}>Dr. AI Assistant</Text>
              <Text style={styles.headerSubtitle}>
                {isLoading ? "Typing..." : "Online"}
              </Text>
            </View>
          </View>
          <IconButton
            icon="delete-outline"
            iconColor={theme.colors.textMuted}
            size={22}
            onPress={handleClearChat}
          />
        </View>

        <GiftedChat
          isTyping={isLoading}
          messages={messages}
          onSend={(messages) => onSend(messages)}
          showUserAvatar
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          placeholder="Type a message..."
          user={{
            _id: 2,
            avatar: require("../../assets/svg/userAvatar.png"),
            name: "user",
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerDot: {
    width: 10,
    height: 10,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.success,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
});

export default Vdoc;
