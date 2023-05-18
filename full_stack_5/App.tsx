import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {ScreenHabits} from "./screens/ScreenHabits";

export default function App() {
  return (
    <View style={styles.appContainer}>
      <StatusBar style="auto" hidden={false} />
      <ScreenHabits/>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
      flex: 1,
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: '#8a2be2',
  }
});
