import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Linking from 'expo-linking';
import {
  Clock,
  Compass,
  MapPin,
  NavArrowRight,
  Search,
  Shop,
  Xmark,
} from 'iconoir-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock store data
const stores = [
  {
    id: '1',
    name: 'Suelo Downtown',
    address: '123 Market St, San Francisco, CA',
    distance: '0.2 mi',
    status: 'Open',
    closingTime: '8:00 PM',
    phone: '(415) 555-0123',
    coordinates: { x: '40%', y: '30%' },
  },
  {
    id: '2',
    name: 'Suelo Mission District',
    address: '456 Valencia St, San Francisco, CA',
    distance: '1.5 mi',
    status: 'Open',
    closingTime: '9:00 PM',
    phone: '(415) 555-0456',
    coordinates: { x: '60%', y: '50%' },
  },
  {
    id: '3',
    name: 'Suelo Hayes Valley',
    address: '789 Hayes St, San Francisco, CA',
    distance: '2.1 mi',
    status: 'Busy',
    closingTime: '7:00 PM',
    phone: '(415) 555-0789',
    coordinates: { x: '20%', y: '60%' },
  },
  {
    id: '4',
    name: 'Suelo North Beach',
    address: '101 Columbus Ave, San Francisco, CA',
    distance: '3.4 mi',
    status: 'Closed',
    closingTime: '6:00 PM',
    phone: '(415) 555-0101',
    coordinates: { x: '70%', y: '20%' },
  },
  {
    id: '5',
    name: 'Suelo Marina',
    address: '202 Chestnut St, San Francisco, CA',
    distance: '4.0 mi',
    status: 'Open',
    closingTime: '8:30 PM',
    phone: '(415) 555-0202',
    coordinates: { x: '30%', y: '10%' },
  },
];

export default function StoresScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<(typeof stores)[0] | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get('window');

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps://maps.apple.com/?daddr=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
      default: `https://maps.google.com/?daddr=${encodedAddress}`,
    });
    
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Failed to open maps:', err)
      );
    }
  };

  const renderStoreItem = ({ item }: { item: (typeof stores)[0] }) => (
    <TouchableOpacity
      style={[styles.storeCard, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
    >
      <View style={styles.storeHeader}>
        <View style={styles.storeTitleRow}>
          <Text style={[styles.storeName, { color: colors.text }]}>
            {item.name}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'Open'
                    ? colors.success + '20'
                    : item.status === 'Busy'
                    ? colors.warning + '20'
                    : colors.error + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === 'Open'
                      ? colors.success
                      : item.status === 'Busy'
                      ? colors.warning
                      : colors.error,
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Text style={[styles.storeDistance, { color: colors.primary }]}>
          {item.distance}
        </Text>
      </View>

      <View style={styles.storeDetails}>
        <View style={styles.detailRow}>
          <MapPin width={16} height={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.address}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Clock width={16} height={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            Closes at {item.closingTime}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => openDirections(item.address)}
        >
          <Compass width={18} height={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>
            Directions
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <NavArrowRight width={20} height={20} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Map Placeholder */}
      <View style={[styles.mapContainer, { height: height * 0.6 }]}>
        <View style={[styles.mapPlaceholder, { backgroundColor: '#E5E0D6' }]}>
          {/* Simulated Map Markers */}
          {stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={[
                styles.mapMarker,
                {
                  left: store.coordinates.x as any as string,
                  top: store.coordinates.y as any as string,
                  backgroundColor:
                    selectedStore?.id === store.id
                      ? colors.accentDark
                      : colors.primary,
                } as any,
              ]}
              onPress={() => setSelectedStore(store)}
              activeOpacity={0.8}
            >
              <Shop width={16} height={16} color="#FFF" />
            </TouchableOpacity>
          ))}
          {/* User Location Marker */}
          <View
            style={[
              styles.userMarker,
              { left: '50%', top: '40%', borderColor: colors.surface },
            ]}
          >
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#4285F4' }} />
          </View>

          {/* Store Info Popup */}
          {selectedStore && (
            <>
              <TouchableOpacity
                style={styles.popupBackdrop}
                activeOpacity={1}
                onPress={() => setSelectedStore(null)}
              />
              <View
                style={[
                  styles.storePopup,
                  {
                    backgroundColor: colors.surface,
                    top: insets.top + 80,
                    alignSelf: 'center',
                    width: Math.min(width * 0.85, 320),
                  },
                ]}
              >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedStore(null)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Xmark width={18} height={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={[styles.popupName, { color: colors.text }]}>
                {selectedStore.name}
              </Text>
              <View
                style={[
                  styles.popupStatusBadge,
                  {
                    backgroundColor:
                      selectedStore.status === 'Open'
                        ? colors.success + '20'
                        : selectedStore.status === 'Busy'
                        ? colors.warning + '20'
                        : colors.error + '20',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.popupStatusText,
                    {
                      color:
                        selectedStore.status === 'Open'
                          ? colors.success
                          : selectedStore.status === 'Busy'
                          ? colors.warning
                          : colors.error,
                    },
                  ]}
                >
                  {selectedStore.status}
                </Text>
              </View>
              <View style={styles.popupDetails}>
                <View style={styles.popupDetailRow}>
                  <MapPin width={14} height={14} color={colors.textSecondary} />
                  <Text
                    style={[styles.popupDetailText, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {selectedStore.address}
                  </Text>
                </View>
                <View style={styles.popupDetailRow}>
                  <Clock width={14} height={14} color={colors.textSecondary} />
                  <Text
                    style={[styles.popupDetailText, { color: colors.textSecondary }]}
                  >
                    Closes at {selectedStore.closingTime}
                  </Text>
                </View>
                <Text style={[styles.popupDistance, { color: colors.primary }]}>
                  {selectedStore.distance} away
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.popupButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  openDirections(selectedStore.address);
                  setSelectedStore(null);
                }}
              >
                <Compass width={16} height={16} color={colors.surface} />
                <Text style={[styles.popupButtonText, { color: colors.surface }]}>
                  Get Directions
                </Text>
              </TouchableOpacity>
            </View>
            </>
          )}
        </View>

        {/* Floating Search Bar */}
        <View
          style={[
            styles.searchWrapper,
            { top: insets.top + 16, width: width - 32 },
          ]}
        >
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Search width={20} height={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Find a store..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </View>

      {/* Store List */}
      <View
        style={[
          styles.listContainer,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        <View style={styles.listHandle} />
        <Text style={[styles.listTitle, { color: colors.text }]}>
          Nearby Stores ({filteredStores.length})
        </Text>
        <FlatList
          data={filteredStores}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 50 + insets.bottom + 20,
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    position: 'relative',
  },
  mapMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  userMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(66, 133, 244, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  listHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D7CCC8',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  storeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeTitleRow: {
    flex: 1,
    marginRight: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  storeDistance: {
    fontSize: 14,
    fontWeight: '600',
  },
  storeDetails: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  storePopup: {
    position: 'absolute',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.08)',
    zIndex: 1001,
  },
  popupName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    paddingRight: 32,
  },
  popupStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  popupStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  popupDetails: {
    gap: 8,
    marginBottom: 12,
  },
  popupDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  popupDetailText: {
    fontSize: 12,
    flex: 1,
  },
  popupDistance: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  popupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  popupButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  popupBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
});
