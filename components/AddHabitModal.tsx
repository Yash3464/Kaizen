import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Habit } from '../store/useStore';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (habit: Habit) => void;
}

const COLORS = ['#00D4FF', '#00E676', '#FF3B30', '#FFD600', '#FF2D55', '#AF52DE', '#FF9500'];
const EMOJIS = ['📚', '💪', '💧', '🏃‍♂️', '🧘‍♀️', '🍎', '💻', '🛌'];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleAdd = () => {
    if (!name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: name.trim(),
      emoji: selectedEmoji,
      color: selectedColor,
      streak: 0,
      history: {}
    };

    onAdd(newHabit);
    setName('');
    setSelectedEmoji(EMOJIS[0]);
    setSelectedColor(COLORS[0]);
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
            <Text style={styles.title}>New Habit</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X color="#A0A0B0" size={20} />
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read 10 pages"
              placeholderTextColor="#606070"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Select Emoji</Text>
            <View style={styles.row}>
              {EMOJIS.map(emoji => (
                <Pressable 
                  key={emoji} 
                  style={[styles.emojiOption, selectedEmoji === emoji && styles.selectedOption]}
                  onPress={() => setSelectedEmoji(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Select Color</Text>
            <View style={styles.row}>
              {COLORS.map(color => (
                <Pressable 
                  key={color} 
                  style={[
                    styles.colorOption, 
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            
            <Pressable 
              style={[styles.submitButton, !name.trim() && styles.submitButtonDisabled]} 
              onPress={handleAdd}
              disabled={!name.trim()}
            >
              <Text style={styles.submitText}>Create Habit</Text>
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A0A0F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A35',
  },
  selectedOption: {
    borderColor: '#FFF',
    backgroundColor: '#2A2A35',
  },
  emojiText: {
    fontSize: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#FFF',
    transform: [{ scale: 1.1 }],
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
