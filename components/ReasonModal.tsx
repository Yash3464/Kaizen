import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface ReasonModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  habitName: string;
}

export const ReasonModal: React.FC<ReasonModalProps> = ({ visible, onClose, onSubmit, habitName }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason.trim());
      setReason('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Marked as 'Other'</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X color="#A0A0B0" size={20} />
            </Pressable>
          </View>
          
          <Text style={styles.subtitle}>
            Why did you miss <Text style={styles.highlight}>{habitName}</Text> today?
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="e.g. Traveling, sick, rest day..."
            placeholderTextColor="#606070"
            value={reason}
            onChangeText={setReason}
            autoFocus
            multiline
          />
          
          <Pressable 
            style={[styles.submitButton, !reason.trim() && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={!reason.trim()}
          >
            <Text style={styles.submitText}>Save Reason</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    width: '100%',
    backgroundColor: '#1A1A24',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    color: '#A0A0B0',
    fontSize: 16,
    fontFamily: 'Inter',
    marginBottom: 20,
    lineHeight: 24,
  },
  highlight: {
    color: '#FFF',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0A0A0F',
    borderRadius: 12,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    borderWidth: 1,
    borderColor: '#2A2A35',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: '#7B2FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '700',
  }
});
