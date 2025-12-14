import { Tabs } from 'expo-router';
import React from 'react';

import { CustomTabBar } from '@/components/CustomTabBar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import { Book, CoffeeCup, QrCode, Shop, User } from 'iconoir-react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <CoffeeCup width={28} height={28} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t('tabs.menu'),
          tabBarIcon: ({ color }) => <Book width={28} height={28} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="qr"
        options={{
          title: t('tabs.qr'),
          tabBarIcon: ({ color }) => <QrCode width={28} height={28} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: t('tabs.stores'),
          tabBarIcon: ({ color }) => <Shop width={28} height={28} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <User width={28} height={28} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
