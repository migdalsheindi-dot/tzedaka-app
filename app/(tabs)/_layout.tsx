import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useIsWide } from '../../components/layout';
import { colors, fonts } from '../../theme';

export default function TabsLayout() {
  const { isWide } = useIsWide();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // En desktop la navegación va arriba (como un sitio web); en móvil, abajo.
        tabBarPosition: isWide ? 'top' : 'bottom',
        tabBarActiveTintColor: colors.navy700,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: isWide ? 14 : 11 },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderBottomColor: colors.border,
          height: isWide ? 56 : undefined,
        },
        tabBarItemStyle: isWide ? { maxWidth: 180 } : undefined,
        tabBarLabelPosition: isWide ? 'beside-icon' : 'below-icon',
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Donar',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="impact"
        options={{
          title: 'Mi Impacto',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
