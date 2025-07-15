import React, { useState } from 'react';
import { View, Modal, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '@/hooks/useTheme';

interface ChapaPaymentProps {
  url: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChapaPayment({ url, visible, onClose, onSuccess }: ChapaPaymentProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);

  // Chapa success/cancel URLs (customize as needed)
  const successUrl = 'https://api.chapa.co/v1/success';
  const cancelUrl = 'https://api.chapa.co/v1/cancel';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>Chapa Payment</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.webviewBox}>
          {loading && <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />}
          <WebView
            source={{ uri: url }}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={navState => {
              if (navState.url.startsWith(successUrl)) {
                onSuccess();
                onClose();
              } else if (navState.url.startsWith(cancelUrl)) {
                onClose();
              }
            }}
            style={styles.webview}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: '#F0F4FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF4',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#E8ECF4',
    borderRadius: 8,
  },
  closeBtnText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 15,
  },
  webviewBox: {
    flex: 1,
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    zIndex: 2,
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 