import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import { useRouter } from 'expo-router';
import {
  Circle,
  CoffeeCup,
  FilterList,
  FireFlame,
  Leaf,
  Search,
  SnowFlake,
} from 'iconoir-react-native';
import { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Filter types
type FilterType = 'All' | 'Hot' | 'Cold' | 'Spicy' | 'Seasonal';

const FILTERS: { type: FilterType; icon: any; key: string }[] = [
  { type: 'All', icon: FilterList, key: 'common.all' },
  { type: 'Hot', icon: CoffeeCup, key: 'common.hot' },
  { type: 'Cold', icon: SnowFlake, key: 'common.cold' },
  { type: 'Spicy', icon: FireFlame, key: 'common.spicy' },
  { type: 'Seasonal', icon: Leaf, key: 'common.seasonal' },
];

// Mock product data
const products = [
  {
    id: '1',
    name: 'Caffè Latte',
    category: 'Hot Coffee',
    price: 45,
    description: 'Rich, full-bodied espresso with steamed milk',
    allergies: ['Milk'],
    image: require('@/assets/images/coffee/latte.jpg'),
    tags: ['Hot'],
  },
  {
    id: '2',
    name: 'Cappuccino',
    category: 'Hot Coffee',
    price: 42,
    description: 'Espresso with steamed milk foam',
    allergies: ['Milk'],
    image: require('@/assets/images/coffee/cappuccino.jpg'),
    tags: ['Hot'],
  },
  {
    id: '3',
    name: 'Caramel Frappuccino',
    category: 'Cold Coffee',
    price: 55,
    description: 'Blended coffee with caramel syrup and whipped cream',
    allergies: ['Milk', 'Soy'],
    image: require('@/assets/images/coffee/caramel-frappuccino.jpg'),
    tags: ['Cold', 'Seasonal'],
  },
  {
    id: '4',
    name: 'Mocha',
    category: 'Hot Coffee',
    price: 48,
    description: 'Espresso with chocolate and steamed milk',
    allergies: ['Milk'],
    image: require('@/assets/images/coffee/mocha.jpg'),
    tags: ['Hot'],
  },
  {
    id: '5',
    name: 'Iced Americano',
    category: 'Cold Coffee',
    price: 38,
    description: 'Espresso shots with cold water over ice',
    allergies: [],
    image: require('@/assets/images/coffee/iced-americano.jpg'),
    tags: ['Cold'],
  },
  {
    id: '6',
    name: 'Green Tea Latte',
    category: 'Tea',
    price: 40,
    description: 'Matcha green tea with steamed milk',
    allergies: ['Milk'],
    image: require('@/assets/images/coffee/matcha-latte.jpg'),
    tags: ['Hot', 'Seasonal'],
  },
  {
    id: '7',
    name: 'Spicy Pumpkin Latte',
    category: 'Specialty',
    price: 52,
    description: 'Espresso with pumpkin spice and chili hint',
    allergies: ['Milk'],
    image: null,
    tags: ['Hot', 'Spicy', 'Seasonal'],
  },
];

export default function MenuScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'All' || product.tags.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const renderProduct = ({ item }: { item: (typeof products)[0] }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: colors.surface }]}
      onPress={() =>
        router.push({ pathname: '/product/[id]', params: { id: item.id } })
      }
    >
      <View
        style={[
          styles.productImagePlaceholder,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        {item.image ? (
          <Image source={item.image} style={styles.productImage} />
        ) : (
          <Circle
            width={32}
            height={32}
            color={colors.primary}
            strokeWidth={2}
          />
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.productCategory, { color: colors.textSecondary }]}>
          {item.category}
        </Text>
        <Text style={[styles.productPrice, { color: colors.primary }]}>
          {item.price}₺
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, paddingTop: insets.top },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('menu.title')}</Text>
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Search width={20} height={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={t('menu.searchPlaceholder')}
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTERS.map((filter) => {
            const Icon = filter.icon || Circle;
            const isActive = activeFilter === filter.type;
            const iconColor = isActive ? colors.surface : colors.textSecondary;

            return (
              <TouchableOpacity
                key={filter.type}
                style={[
                  styles.filterChip,
                  isActive
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() => setActiveFilter(filter.type)}
              >
                <Icon
                  width={16}
                  height={16}
                  color={iconColor}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.filterText,
                    isActive
                      ? { color: colors.surface }
                      : { color: colors.textSecondary },
                  ]}
                >
                  {t(filter.key)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 50 + insets.bottom + 20 }, // TabBar height + Safe Area + Extra padding
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('menu.noProducts')}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    paddingBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
