import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Colors from '@/constants/colors';
import Theme from '@/constants/theme';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: string;
  attachments?: string[];
}

const { width } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = width * 0.75;

export default function MessageBubble({ 
  text, 
  isUser, 
  timestamp,
  attachments 
}: MessageBubbleProps) {
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.otherContainer
    ]}>
      {attachments && attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          {attachments.map((attachment, index) => (
            <Image 
              key={index}
              source={{ uri: attachment }}
              style={styles.attachment}
              resizeMode="cover"
            />
          ))}
        </View>
      )}
      
      <Text style={[
        styles.messageText,
        isUser ? styles.userText : styles.otherText
      ]}>
        {text}
      </Text>
      
      <Text style={[
        styles.timestamp,
        isUser ? styles.userTimestamp : styles.otherTimestamp
      ]}>
        {timestamp}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: MAX_BUBBLE_WIDTH,
    borderRadius: Theme.borderRadius.m,
    padding: Theme.spacing.m,
    marginBottom: Theme.spacing.m,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.primary,
  },
  otherContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.card,
  },
  messageText: {
    fontSize: Theme.fontSize.m,
    lineHeight: 22,
  },
  userText: {
    color: Colors.common.white,
  },
  otherText: {
    color: Colors.light.text,
  },
  timestamp: {
    fontSize: Theme.fontSize.xs,
    marginTop: Theme.spacing.xs,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  otherTimestamp: {
    color: Colors.light.textSecondary,
    alignSelf: 'flex-start',
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.s,
  },
  attachment: {
    width: 150,
    height: 150,
    borderRadius: Theme.borderRadius.s,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
});