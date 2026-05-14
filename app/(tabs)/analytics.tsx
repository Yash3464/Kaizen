import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeatmapCalendar } from '../../components/HeatmapCalendar';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>
        <HeatmapCalendar data={[]} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  scroll: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontFamily: 'Inter',
    fontWeight: '800',
  }
});
