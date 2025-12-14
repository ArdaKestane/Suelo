import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Circle } from 'iconoir-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock product data (in real app, fetch from API)
const getProduct = (id: string) => {
  const products = [
    {
      id: '1',
      name: 'Caffè Latte',
      category: 'Hot Coffee',
      price: 45,
      description: 'Rich, full-bodied espresso with steamed milk. Our signature latte combines perfectly pulled espresso shots with silky steamed milk, creating a smooth and creamy coffee experience.',
      allergies: ['Milk'],
      ingredients: ['Espresso', 'Steamed Milk'],
      calories: 190,
      caffeine: '150mg',
      image: null,
    },
    {
      id: '2',
      name: 'Cappuccino',
      category: 'Hot Coffee',
      price: 42,
      description: 'Espresso with steamed milk foam. The perfect balance of espresso, steamed milk, and a thick layer of foam.',
      allergies: ['Milk'],
      ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
      calories: 120,
      caffeine: '150mg',
      image: null,
    },
    {
      id: '3',
      name: 'Caramel Frappuccino',
      category: 'Cold Coffee',
      price: 55,
      description: 'Blended coffee with caramel syrup and whipped cream. A sweet and refreshing cold coffee treat.',
      allergies: ['Milk', 'Soy'],
      ingredients: ['Coffee', 'Milk', 'Caramel Syrup', 'Whipped Cream'],
      calories: 380,
      caffeine: '90mg',
      image: null,
    },
    {
      id: '4',
      name: 'Mocha',
      category: 'Hot Coffee',
      price: 48,
      description: 'Espresso with chocolate and steamed milk. A perfect blend of coffee and chocolate.',
      allergies: ['Milk'],
      ingredients: ['Espresso', 'Chocolate', 'Steamed Milk'],
      calories: 290,
      caffeine: '175mg',
      image: null,
    },
    {
      id: '5',
      name: 'Iced Americano',
      category: 'Cold Coffee',
      price: 38,
      description: 'Espresso shots with cold water over ice. Simple, strong, and refreshing.',
      allergies: [],
      ingredients: ['Espresso', 'Water', 'Ice'],
      calories: 15,
      caffeine: '150mg',
      image: null,
    },
    {
      id: '6',
      name: 'Green Tea Latte',
      category: 'Tea',
      price: 40,
      description: 'Matcha green tea with steamed milk. A smooth and earthy tea experience.',
      allergies: ['Milk'],
      ingredients: ['Matcha Green Tea', 'Steamed Milk'],
      calories: 240,
      caffeine: '80mg',
      image: null,
    },
  ];
  return products.find(p => p.id === id) || products[0];
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const product = getProduct(id || '1');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft width={24} height={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Product Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceSecondary }]}>
            <Circle width={80} height={80} color={colors.primary} strokeWidth={3} />
          </View>
        </View>

        {/* Product Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
          <Text style={[styles.productCategory, { color: colors.textSecondary }]}>{product.category}</Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>{product.price}₺</Text>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>

          {/* Nutrition Info */}
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>Calories</Text>
              <Text style={[styles.nutritionValue, { color: colors.text }]}>{product.calories}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={[styles.nutritionLabel, { color: colors.textSecondary }]}>Caffeine</Text>
              <Text style={[styles.nutritionValue, { color: colors.text }]}>{product.caffeine}</Text>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.divider} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredients</Text>
          <Text style={[styles.ingredients, { color: colors.textSecondary }]}>
            {product.ingredients.join(', ')}
          </Text>

          {/* Allergies */}
          {product.allergies.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.allergiesContainer}>
                {/* <AlertTriangle width={20} height={20} color={colors.warning} /> */}
                <View style={styles.allergiesContent}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Allergens</Text>
                  <Text style={[styles.allergies, { color: colors.textSecondary }]}>
                    Contains: {product.allergies.join(', ')}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            // TODO: Add to cart functionality
          }}
        >
          <Text style={[styles.addToCartText, { color: colors.surface }]}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E0D6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 16,
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E0D6',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 16,
  },
  nutritionItem: {
    flex: 1,
  },
  nutritionLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  ingredients: {
    fontSize: 16,
    lineHeight: 24,
  },
  allergiesContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  allergiesContent: {
    flex: 1,
  },
  allergies: {
    fontSize: 16,
    lineHeight: 24,
  },
  addToCartButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

