import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CoffeeCup, Star, Trophy, User } from 'iconoir-react-native';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock consumption data
const consumptionData = [
  {
    id: '1',
    name: 'Caffè Latte',
    count: 24,
    image: require('@/assets/images/coffee/latte.jpg'),
  },
  {
    id: '2',
    name: 'Cappuccino',
    count: 18,
    image: require('@/assets/images/coffee/cappuccino.jpg'),
  },
  {
    id: '3',
    name: 'Iced Americano',
    count: 12,
    image: require('@/assets/images/coffee/iced-americano.jpg'),
  },
  {
    id: '4',
    name: 'Mocha',
    count: 8,
    image: require('@/assets/images/coffee/mocha.jpg'),
  },
  {
    id: '5',
    name: 'Caramel Frappuccino',
    count: 5,
    image: require('@/assets/images/coffee/caramel-frappuccino.jpg'),
  },
];

const totalCoffees = consumptionData.reduce((acc, item) => acc + item.count, 0);
const favoriteDrink = consumptionData.reduce((prev, current) =>
  prev.count > current.count ? prev : current
);

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');

  // Calculate max count for progress bars
  const maxCount = Math.max(...consumptionData.map((d) => d.count));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100, // Space for tab bar
        }}
      >
        {/* Header Section */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              paddingTop: insets.top + 20,
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <User width={40} height={40} color={colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                Coffee Lover
              </Text>
              <Text style={[styles.userLevel, { color: colors.textSecondary }]}>
                Gold Member
              </Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <CoffeeCup
                  width={24}
                  height={24}
                  color={colors.primary}
                  strokeWidth={2}
                />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {totalCoffees}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Coffees
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Trophy
                  width={24}
                  height={24}
                  color={colors.primary}
                  strokeWidth={2}
                />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                Top 1%
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Drinker Rank
              </Text>
            </View>
          </View>
        </View>

        {/* Favorite Drink Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Favorite
          </Text>
          <View
            style={[
              styles.favoriteCard,
              { backgroundColor: colors.primary },
            ]}
          >
            <Image source={favoriteDrink.image} style={styles.favoriteImage} />
            <View style={styles.favoriteInfo}>
              <View style={styles.favoriteHeader}>
                <Star
                  width={20}
                  height={20}
                  color={colors.surface}
                  fill={colors.surface}
                />
                <Text style={[styles.favoriteLabel, { color: colors.surface }]}>
                  Most Ordered
                </Text>
              </View>
              <Text style={[styles.favoriteName, { color: colors.surface }]}>
                {favoriteDrink.name}
              </Text>
              <Text style={[styles.favoriteCount, { color: colors.surface }]}>
                {favoriteDrink.count} times ordered
              </Text>
            </View>
          </View>
        </View>

        {/* Consumption History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Consumption History
          </Text>
          {consumptionData.map((item) => (
            <View
              key={item.id}
              style={[styles.historyItem, { backgroundColor: colors.surface }]}
            >
              <Image source={item.image} style={styles.historyImage} />
              <View style={styles.historyContent}>
                <View style={styles.historyHeader}>
                  <Text style={[styles.historyName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.historyCount, { color: colors.primary }]}
                  >
                    {item.count}
                  </Text>
                </View>
                {/* Progress Bar */}
                <View
                  style={[
                    styles.progressBarBg,
                    { backgroundColor: colors.surfaceSecondary },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${(item.count / maxCount) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  favoriteCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  favoriteLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favoriteName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  favoriteCount: {
    fontSize: 14,
    opacity: 0.9,
  },
  historyItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  historyImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
