import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useStore, Friend, Challenge } from '../store/useStore';

interface CreateChallengeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ visible, onClose }) => {
  const { friends, addChallenge } = useStore();
  const [name, setName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const toggleFriend = (id: string) => {
    setSelectedFriends(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    const participants = friends.filter(f => selectedFriends.includes(f.id));

    const newChallenge: Challenge = {
      id: Date.now().toString(),
      name: name.trim(),
      participants,
      createdAt: new Date().toISOString(),
    };

    addChallenge(newChallenge);
    setName('');
    setSelectedFriends([]);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>New Challenge</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X color="#A0A0B0" size={20} />
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Challenge Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 30 Days of Code"
              placeholderTextColor="#606070"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Add Friends</Text>
            <View style={styles.friendsList}>
              {friends.map(friend => {
                const isSelected = selectedFriends.includes(friend.id);
                return (
                  <Pressable 
                    key={friend.id} 
                    style={[styles.friendItem, isSelected && styles.friendItemSelected]}
                    onPress={() => toggleFriend(friend.id)}
                  >
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendEmoji}>{friend.emoji}</Text>
                      <Text style={styles.friendName}>{friend.username}</Text>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Check color="#FFF" size={14} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
            
            <Pressable 
              style={[styles.submitButton, !name.trim() && styles.submitButtonDisabled]} 
              onPress={handleCreate}
              disabled={!name.trim()}
            >
              <Text style={styles.submitText}>Create Challenge</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: '#1A1A24',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
    backgroundColor: '#2A2A35',
    borderRadius: 20,
  },
  label: {
    color: '#A0A0B0',
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#0A0A0F',
    borderRadius: 16,
    padding: 16,
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter',
    borderWidth: 1,
    borderColor: '#2A2A35',
    marginBottom: 24,
  },
  friendsList: {
    gap: 12,
    marginBottom: 24,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A35',
  },
  friendItemSelected: {
    borderColor: '#7B2FFF',
    backgroundColor: '#7B2FFF20',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  friendEmoji: {
    fontSize: 24,
  },
  friendName: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2A2A35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#7B2FFF',
    borderColor: '#7B2FFF',
  },
  submitButton: {
    backgroundColor: '#7B2FFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '700',
  }
});
