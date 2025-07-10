import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Video, 
  Phone,
  MicOff,
  VideoOff
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/constants/translations';
import Theme from '@/constants/theme';
import MessageBubble from '@/components/MessageBubble';
import Button from '@/components/Button';
import { fixers } from '@/mocks/fixers';

// Mock messages
const mockMessages = [
  {
    id: '1',
    text: "Hi there! How can I help you today?",
    isUser: false,
    timestamp: "10:30 AM",
  },
  {
    id: '2',
    text: "My refrigerator is making a strange noise. Can you help?",
    isUser: true,
    timestamp: "10:32 AM",
  },
  {
    id: '3',
    text: "I'd be happy to help! Could you describe the noise in more detail?",
    isUser: false,
    timestamp: "10:33 AM",
  },
  {
    id: '4',
    text: "It's like a buzzing sound that happens every few minutes.",
    isUser: true,
    timestamp: "10:35 AM",
  },
  {
    id: '5',
    text: "That could be several things. Would you be able to send a short video with the sound?",
    isUser: false,
    timestamp: "10:36 AM",
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<'video' | 'voice'>('voice');
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  // Find fixer by id
  const fixer = fixers.find(f => f.id === id);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate fixer response
    setTimeout(() => {
      const fixerResponse = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for the information. I'll check this issue for you.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => [...prev, fixerResponse]);
    }, 1000);
  };
  
  const handleAttachment = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newMessage = {
        id: Date.now().toString(),
        text: "Here's an image of the issue.",
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attachments: [result.assets[0].uri],
      };
      
      setMessages([...messages, newMessage]);
    }
  };
  
  const startRecording = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice Recording', 'Voice recording is not available on web platform');
      return;
    }
    
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone permission to record voice messages');
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };
  
  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        const newMessage = {
          id: Date.now().toString(),
          text: "🎵 Voice message",
          isUser: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          voiceNote: uri,
        };
        
        setMessages([...messages, newMessage]);
      }
      
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };
  
  const handleVoicePress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleVideoCall = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Video Call', 'Video calls are not available on web platform');
      return;
    }
    setCallType('video');
    setShowCallModal(true);
  };
  
  const handleVoiceCall = () => {
    if (Platform.OS === 'web') {
      Alert.alert('Voice Call', 'Voice calls are not available on web platform');
      return;
    }
    setCallType('voice');
    setShowCallModal(true);
  };
  
  const startCall = () => {
    setShowCallModal(false);
    setIsInCall(true);
    
    // Simulate call duration
    setTimeout(() => {
      setIsInCall(false);
      setIsMuted(false);
      setIsVideoOff(false);
    }, 30000); // Auto end call after 30 seconds for demo
  };
  
  const endCall = () => {
    setIsInCall(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: fixer?.name || 'Chat',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleVoiceCall}
              >
                <Phone size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleVideoCall}
              >
                <Video size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              isUser={item.isUser}
              timestamp={item.timestamp}
              attachments={item.attachments}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={handleAttachment}
          >
            <Paperclip size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          {message.trim() === '' ? (
            <TouchableOpacity 
              style={[styles.micButton, isRecording && { backgroundColor: colors.error }]}
              onPress={handleVoicePress}
            >
              <Mic size={24} color={isRecording ? colors.white : colors.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={handleSend}
            >
              <Send size={24} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
      
      {/* Call Modal */}
      <Modal
        visible={showCallModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCallModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.callModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.callModalTitle, { color: colors.text }]}>
              {callType === 'video' ? 'Video Call' : 'Voice Call'}
            </Text>
            <Text style={[styles.callModalSubtitle, { color: colors.textSecondary }]}>
              Call {fixer?.name}?
            </Text>
            
            <View style={styles.callModalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowCallModal(false)}
                variant="outline"
                style={styles.callModalButton}
              />
              <Button
                title="Call"
                onPress={startCall}
                style={styles.callModalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* In Call Overlay */}
      {isInCall && (
        <Modal visible={isInCall} transparent animationType="fade">
          <View style={styles.callOverlay}>
            <View style={styles.callContent}>
              <Text style={styles.callTitle}>
                {callType === 'video' ? 'Video Call' : 'Voice Call'}
              </Text>
              <Text style={styles.callSubtitle}>{fixer?.name}</Text>
              
              <View style={styles.callControls}>
                <TouchableOpacity 
                  style={[styles.callControlButton, isMuted && { backgroundColor: colors.error }]}
                  onPress={toggleMute}
                >
                  {isMuted ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
                </TouchableOpacity>
                
                {callType === 'video' && (
                  <TouchableOpacity 
                    style={[styles.callControlButton, isVideoOff && { backgroundColor: colors.error }]}
                    onPress={toggleVideo}
                  >
                    {isVideoOff ? <VideoOff size={24} color="white" /> : <Video size={24} color="white" />}
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.callControlButton, { backgroundColor: colors.error }]}
                  onPress={endCall}
                >
                  <Phone size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: Theme.spacing.m,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    padding: Theme.spacing.m,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.m,
    borderTopWidth: 1,
  },
  attachButton: {
    marginRight: Theme.spacing.s,
  },
  input: {
    flex: 1,
    borderRadius: Theme.borderRadius.l,
    paddingHorizontal: Theme.spacing.m,
    paddingVertical: Theme.spacing.s,
    maxHeight: 100,
    fontSize: Theme.fontSize.m,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.s,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.s,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callModal: {
    width: '80%',
    borderRadius: Theme.borderRadius.l,
    padding: Theme.spacing.xl,
    alignItems: 'center',
  },
  callModalTitle: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '600' as any,
    marginBottom: Theme.spacing.s,
  },
  callModalSubtitle: {
    fontSize: Theme.fontSize.m,
    marginBottom: Theme.spacing.xl,
  },
  callModalButtons: {
    flexDirection: 'row',
    gap: Theme.spacing.m,
  },
  callModalButton: {
    flex: 1,
  },
  callOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callContent: {
    alignItems: 'center',
  },
  callTitle: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '600' as any,
    color: 'white',
    marginBottom: Theme.spacing.s,
  },
  callSubtitle: {
    fontSize: Theme.fontSize.l,
    color: 'white',
    marginBottom: Theme.spacing.xxl,
  },
  callControls: {
    flexDirection: 'row',
    gap: Theme.spacing.l,
  },
  callControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});