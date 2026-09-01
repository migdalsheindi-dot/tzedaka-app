import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2F6FED',
        tabBarInactiveTintColor: '#9AA4BF',
        tabBarStyle: {
          borderTopColor: '#EAEDF5',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Donar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="impact"
        options={{
          title: 'Mi Impacto',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
