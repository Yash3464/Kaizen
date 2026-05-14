import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, X, CircleEllipsis } from 'lucide-react-native';
import { DayStatus } from '../store/useStore';

interface StatusSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (status: DayStatus) => void;
  habitName: string;
  dateStr: string;
}

export const StatusSelectionModal: React.FC<StatusSelectionModalProps> = ({ 
  visible, onClose, onSelect, habitName, dateStr 
}) => {
  const displayDate = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.dropdown}>
          <View style={styles.header}>
            <Text style={styles.title}>{habitName}</Text>
            <Text style={styles.subtitle}>{displayDate}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            <Pressable 
              style={styles.optionItem} 
              onPress={() => onSelect('completed')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#00E67620' }]}>
                <Check color="#00E676" size={16} />
              </View>
              <Text style={styles.optionText}>Completed</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable 
              style={styles.optionItem} 
              onPress={() => onSelect('missed')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FF3B3020' }]}>
                <X color="#FF3B30" size={16} />
              </View>
              <Text style={styles.optionText}>Missed</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable 
              style={styles.optionItem} 
              onPress={() => onSelect('other')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FFD60020' }]}>
                <CircleEllipsis color="#FFD600" size={16} />
              </View>
              <Text style={styles.optionText}>Other...</Text>
            </Pressable>
            
            <View style={styles.divider} />
            
            <Pressable 
              style={styles.optionItem} 
              onPress={() => onSelect('none')}
            >
              <View style={styles.iconBox} />
              <Text style={[styles.optionText, { color: '#606070' }]}>Clear Status</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dropdown: {
    width: '80%',
    backgroundColor: '#1A1A24',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A35',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A0A0B0',
    fontSize: 12,
    fontFamily: 'Inter',
  },
  optionsContainer: {
    gap: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A35',
    marginHorizontal: 8,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '500',
  }
});
