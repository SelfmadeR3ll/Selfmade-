import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={Colors.bg} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/onboard" />
          <Stack.Screen name="(auth)/signin" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="screens/workout"
            options={{ presentation: 'card', animation: 'slide_from_bottom' }}
          />
          <Stack.Screen name="screens/food" />
          <Stack.Screen name="screens/sleep" />
          <Stack.Screen name="screens/mood" />
          <Stack.Screen name="screens/water" />
          <Stack.Screen name="screens/grocery" />
          <Stack.Screen name="screens/meals" />
          <Stack.Screen name="screens/calendar" />
          <Stack.Screen name="screens/goals" />
          <Stack.Screen name="screens/games" />
          <Stack.Screen name="screens/wearables" />
          <Stack.Screen name="screens/photos" />
          <Stack.Screen name="screens/bills" />
          <Stack.Screen name="screens/profile" />
          <Stack.Screen name="screens/settings" />
          <Stack.Screen name="screens/referral" />
          <Stack.Screen name="screens/billing" options={{ presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
});
