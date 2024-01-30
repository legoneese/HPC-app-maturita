import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Animated, Easing } from 'react-native';
import React, {useState, useEffect, useRef } from 'react'
import Plants from './screens/Plants';
import Slider from '@react-native-community/slider'



export default function App() {
  return (
    <View style={styles.container}>
      <Plants/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
