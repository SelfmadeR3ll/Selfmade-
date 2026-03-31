import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { VitaBubble } from '../../components/VitaBubble';

function TabIcon({ name, focused, color }: { name: any; focused: boolean; color: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      {focused && (
        <View
          style={{
            position: 'absolute',
            top: -8,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: Colors.primary,
          }}
        />
      )}
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            title: 'Health',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="vita"
          options={{
            title: 'Vita AI',
            tabBarIcon: ({ focused, color }) => (
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: Colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                  shadowColor: Colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="sparkles" size={24} color="#fff" />
              </View>
            ),
            tabBarLabel: () => null,
          }}
        />
        <Tabs.Screen
          name="money"
          options={{
            title: 'Money',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                name={focused ? 'wallet' : 'wallet-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ focused, color }) => (
              <TabIcon
                name={focused ? 'grid' : 'grid-outline'}
                focused={focused}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      {/* VitaBubble rendered on top of all tabs */}
      <VitaBubble />
    </>
  );
}
