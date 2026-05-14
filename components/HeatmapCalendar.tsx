import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface HeatmapCalendarProps {
  data: { date: string, count: number }[]; // date format 'YYYY-MM-DD'
  colorBase?: string;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ 
  data, 
  colorBase = '#7B2FFF' 
}) => {
  // Mock generating 52 weeks of data
  // In a real implementation, we would map the 'data' array to the actual grid cells
  
  const generateGrid = () => {
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Randomize intensity for demonstration
        const intensity = Math.random();
        let opacity = 0.1; // Level 0
        if (intensity > 0.8) opacity = 1; // Level 4
        else if (intensity > 0.6) opacity = 0.7; // Level 3
        else if (intensity > 0.4) opacity = 0.4; // Level 2
        
        days.push(
          <View 
            key={`${w}-${d}`} 
            style={[
              styles.cell, 
              { backgroundColor: opacity > 0.1 ? colorBase : '#1A1A24', opacity: opacity > 0.1 ? opacity : 1 }
            ]} 
          />
        );
      }
      weeks.push(
        <View key={`week-${w}`} style={styles.weekCol}>
          {days}
        </View>
      );
    }
    return weeks;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consistency Map</Text>
      <View style={styles.gridContainer}>
        {generateGrid()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0F',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A1A24',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  weekCol: {
    marginRight: 4,
  },
  cell: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginBottom: 4,
  }
});
