import { HeaderPattern } from '@/components/ui/HeaderPattern';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/use-translation';
import {
  Bell,
  CreditCard,
  Gift,
  Medal,
  Settings
} from 'iconoir-react-native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const MAX_DRINK_PROGRESS = 10;

// The height of the rewards section to be collapsed
const REWARDS_SECTION_HEIGHT = 130;
// The height of the fixed header part (headerTop + padding)
const FIXED_HEADER_HEIGHT = 56 + 4 + 20; // 56(headerTop) + 4(marginBottom) + 20(paddingBottom)

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const userName = 'Arda';
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [starBalance, setStarBalance] = useState(14);
  const [freeDrinks, setFreeDrinks] = useState(2);
  const [drinkProgress, setDrinkProgress] = useState(5);

  const waveAnim = useSharedValue(0);
  const currentProgress = useSharedValue(drinkProgress);
  const scrollY = useSharedValue(0);
  const screenHeight = Dimensions.get('window').height;

  // The initial Y position of the sheet container's top edge relative to the screen top
  const initialSheetTop =
    insets.top + FIXED_HEADER_HEIGHT + REWARDS_SECTION_HEIGHT;

  // This is the padding applied to the top of the ScrollView content.
  // We match this to the Rewards Section height so the content starts below it.
  const CONTENT_START_PADDING = REWARDS_SECTION_HEIGHT;

  // The distance the sheet needs to travel up to reach its collapsed state (just below fixed header)
  const MAX_COLLAPSE_DISTANCE = REWARDS_SECTION_HEIGHT;

  useEffect(() => {
    if (drinkProgress === 0) {
      currentProgress.value = withTiming(0, {
        duration: 2000,
        easing: Easing.inOut(Easing.cubic),
      });
    } else {
      currentProgress.value = withTiming(drinkProgress, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    }
  }, [drinkProgress]);

  useEffect(() => {
    waveAnim.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // --- Cup Animation Props (Unchanged) ---
  const animatedProps = useAnimatedProps(() => {
    const progress = currentProgress.value;
    const minH = 2375;
    const maxH = 6750;
    const range = maxH - minH;
    const height = minH + (progress / MAX_DRINK_PROGRESS) * range;
    const hRatio = Math.min(Math.max((height - minH) / range, 0), 1);
    const topLeftX = 1200;
    const topRightX = 4650;
    const bottomLeftX = 1750;
    const bottomRightX = 4100;
    const currentLeftX = bottomLeftX + (topLeftX - bottomLeftX) * hRatio;
    const currentRightX = bottomRightX + (topRightX - bottomRightX) * hRatio;
    const width = currentRightX - currentLeftX;
    const phase = waveAnim.value * Math.PI * 2;
    const progressRatio = progress / MAX_DRINK_PROGRESS;
    const amplitude = 550 * Math.min(progressRatio, 1);
    let path = ``;
    for (let i = 0; i <= 40; i++) {
      const normalizedX = i / 40;
      const x = currentLeftX + width * normalizedX;
      const waveY =
        height +
        amplitude *
          (Math.sin(normalizedX * 2 * Math.PI + phase) * 0.8 +
            Math.sin(normalizedX * 3 * Math.PI - phase * 0.5) * 0.2);
      if (i === 0) path = `M ${x} ${waveY}`;
      else path += ` L ${x} ${waveY}`;
    }
    const cornerRadius = 0;
    path += ` L ${bottomRightX} ${minH + cornerRadius}`;
    path += ` Q ${bottomRightX} ${minH} ${bottomRightX - cornerRadius} ${minH}`;
    path += ` L ${bottomLeftX + cornerRadius} ${minH}`;
    path += ` Q ${bottomLeftX} ${minH} ${bottomLeftX} ${minH + cornerRadius}`;
    path += ` Z`;
    return { d: path };
  });
  // -------------------------------------

  useEffect(() => {
    if (drinkProgress >= MAX_DRINK_PROGRESS) {
      const timer = setTimeout(() => {
        setFreeDrinks((prev) => prev + 1);
        setDrinkProgress(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [drinkProgress]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.value = event.contentOffset.y;
    },
  });

  // 1. Rewards Section Fade Animation
  const rewardsSectionAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    // The scroll value must be between 0 and MAX_COLLAPSE_DISTANCE for fading.
    // When scrollY is 0, we see the rewards. When scrollY is MAX_COLLAPSE_DISTANCE, it's covered/faded.
    const clampedScrollY = Math.min(
      Math.max(scrollY.value, 0),
      MAX_COLLAPSE_DISTANCE
    );

    // Opacity interpolates from 1 (clampedScrollY = 0) to 0 (clampedScrollY = MAX_COLLAPSE_DISTANCE)
    const opacity = 1 - clampedScrollY / MAX_COLLAPSE_DISTANCE;

    return {
      opacity: opacity,
      transform: [{ translateY: -clampedScrollY * 0.5 }],
    };
  });

  // 2. Sheet Container Movement Animation (Clamped to stop at collapsed position)
  const bottomSheetAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    // We keep the sheet fixed at its position below the header.
    // Any "movement" is just the content scrolling up.
    // If we wanted elastic pull-down, we could add logic here, but for now fixed is fine.

    return {
      // The sheet container is positioned right below the fixed header
      top: insets.top + FIXED_HEADER_HEIGHT,
      height: screenHeight - insets.top - FIXED_HEADER_HEIGHT,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <HeaderPattern height={screenHeight} color='rgba(255, 255, 255, 0.15)' />
      {/* Fixed Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.greeting, { color: colors.surface }]}>
            {t('home.welcome')} {userName.toUpperCase()}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Bell width={24} height={24} color={colors.surface} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Settings width={24} height={24} color={colors.surface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Star Rewards Section - Fades out as sheet scrolls up */}
        <Animated.View
          style={[styles.rewardsSection, rewardsSectionAnimatedStyle]}
        >
          <View style={styles.starBalance}>
            <Text style={[styles.freeDrinkText, { color: colors.surface }]}>
              {t('home.freeDrinks')}
            </Text>
            <View
              style={[
                styles.freeDrinkCountContainer,
                { backgroundColor: colors.starBackground },
              ]}
            >
              <Text style={[styles.freeDrinkCount, { color: colors.star }]}>
                {freeDrinks}
              </Text>
            </View>
          </View>
          {/* Middle: Cup with Progress */}
          <View style={styles.progressContainer}>
            <Svg
              width={100}
              height={110}
              viewBox='0 200 585 400'
              style={styles.cupSvg}
            >
              <G transform='translate(0,1024) scale(0.1, -0.1)'>
                <AnimatedPath
                  animatedProps={animatedProps}
                  fill={colors.surface}
                />
              </G>
              <G
                transform='translate(0,1024) scale(0.1,-0.1)'
                fill={colors.surface}
                stroke='none'
              >
                <Path d='M1533 7780 c-17 -10 -37 -28 -43 -40 -6 -12 -48 -128 -92 -258 -44 -130 -84 -245 -89 -254 -7 -13 -22 -18 -55 -18 -55 0 -99 -22 -117 -58 -7 -15 -38 -102 -67 -194 -66 -205 -68 -198 71 -198 l99 0 0 -35 c0 -20 7 -95 15 -168 8 -73 23 -229 35 -347 37 -393 50 -524 65 -665 9 -77 31 -302 50 -500 19 -198 39 -403 45 -455 6 -52 19 -189 30 -305 11 -115 27 -275 35 -355 8 -80 21 -219 30 -310 8 -91 27 -280 40 -420 14 -140 34 -345 45 -455 11 -110 25 -217 30 -237 22 -76 103 -157 179 -178 49 -14 2123 -14 2172 0 51 14 98 48 136 98 50 65 52 77 93 527 11 121 27 283 35 360 8 77 21 211 30 298 8 86 22 226 30 310 8 83 31 314 50 512 38 390 37 381 65 660 11 105 24 240 29 300 10 105 49 502 91 915 11 107 25 252 32 323 l11 127 97 0 c138 0 136 -7 70 198 -29 92 -60 179 -67 194 -18 37 -62 58 -121 58 l-49 0 -21 63 c-57 173 -107 305 -123 328 -10 15 -36 35 -56 45 -36 18 -84 19 -883 25 l-845 6 -95 25 c-52 14 -152 42 -222 62 l-128 36 -302 0 c-282 0 -305 -1 -335 -20z m712 -80 c420 -118 325 -110 1231 -110 816 0 843 -1 864 -40 9 -16 120 -329 120 -337 0 -2 -691 -3 -1535 -3 -844 0 -1535 1 -1535 3 0 19 160 480 172 495 8 9 83 12 312 12 270 0 308 -2 371 -20z m2388 -572 c14 -11 97 -246 97 -277 0 -8 -491 -12 -1805 -13 -1198 -2 -1805 0 -1805 7 0 25 83 262 97 277 15 17 109 18 1708 18 1337 0 1695 -3 1708 -12z m-103 -408 c0 -22 -13 -174 -30 -338 -16 -163 -37 -369 -45 -457 -9 -88 -23 -221 -30 -295 -8 -74 -19 -187 -25 -250 -5 -63 -17 -182 -25 -265 -8 -82 -21 -220 -30 -305 -8 -85 -19 -198 -25 -250 -5 -52 -17 -167 -25 -255 -9 -88 -23 -227 -31 -310 -8 -82 -17 -172 -19 -200 -20 -216 -37 -392 -50 -515 -8 -80 -29 -282 -45 -448 -25 -260 -33 -309 -51 -338 -27 -44 -74 -79 -124 -93 -52 -14 -2054 -15 -2105 -1 -46 13 -103 61 -123 103 -17 35 -32 149 -67 522 -11 121 -25 256 -30 300 -5 44 -12 107 -15 140 -8 100 -33 358 -76 785 -22 223 -44 455 -50 515 -10 117 -59 615 -84 855 -8 80 -24 240 -35 355 -46 480 -70 722 -74 753 l-5 32 1610 0 1609 0 0 -40z' />
              </G>
            </Svg>
            <Text style={[styles.progressText, { color: colors.surface }]}>
              {drinkProgress}/{MAX_DRINK_PROGRESS}
            </Text>
          </View>

          <View style={styles.badgesContainer}>
            <Text style={[styles.badgesLabel, { color: colors.surface }]}>
              {t('home.rewards')}
            </Text>
            <View
              style={[
                styles.badgeIcon,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Medal
                width={24}
                height={24}
                strokeWidth={2}
                color={colors.badge}
              />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Modal Sheet - Animated ScrollView */}
      <Animated.ScrollView
        style={[
          styles.bottomSheetContainer,
          bottomSheetAnimatedStyle,
          {
            // Background should be transparent so we can see through the spacer
            backgroundColor: 'transparent',
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Padding at the top of the content: This empty space is what the sheet scrolls up through */}
        <View
          style={{
            height: CONTENT_START_PADDING,
            backgroundColor: 'transparent',
          }}
        />

        {/* WRAPPER FOR SOLID CONTENT */}
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            minHeight: screenHeight - insets.top - FIXED_HEADER_HEIGHT, // Ensure it covers the screen
            paddingBottom: insets.bottom + 80, // Bottom safe area + Tab bar height
          }}
        >
          {/* Sheet Handle - Positioned immediately after the padding */}
          <View
            style={[
              styles.contentHandleWrapper,
              { backgroundColor: 'transparent' },
            ]}
          >
            <View
              style={[styles.sheetHandle, { backgroundColor: colors.divider }]}
            />
          </View>

          {/* Membership Card - Main Content Starts Here */}
          <View
            style={[
              styles.membershipCard,
              { backgroundColor: colors.surface, marginTop: 0 },
            ]}
          >
            <View
              style={[
                styles.membershipChip,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[styles.membershipChipText, { color: colors.surface }]}
              >
                {t('home.sueloMember')}
              </Text>
            </View>
            <Text
              style={[styles.cardSubtitle, { color: colors.textSecondary }]}
            >
              {t('home.cardDescription')}
            </Text>
            <View style={styles.accountBalanceRow}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <CreditCard width={32} height={32} color={colors.primary} />
              </View>
              <View style={styles.balanceInfo}>
                <Text
                  style={[styles.balanceLabel, { color: colors.textSecondary }]}
                >
                  {t('home.accountBalance')}
                </Text>
                <Text style={[styles.balanceAmount, { color: colors.text }]}>
                  200₺
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.addMoneyButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.addMoneyText, { color: colors.surface }]}>
                {t('home.addMoney')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Innovative Discover Section */}
          <View style={styles.discoverSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('home.discover')}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.discoverScroll}
              snapToInterval={260 + 20} // card width + gap
              decelerationRate='fast'
            >
              {[
                {
                  id: 1,
                  name: 'Cappuccino',
                  price: '85₺',
                  tag: t('home.trending'),
                  image: require('../../assets/images/coffee/cappuccino.jpg'),
                },
                {
                  id: 2,
                  name: 'Iced Americano',
                  price: '75₺',
                  tag: t('home.new'),
                  image: require('../../assets/images/coffee/iced-americano.jpg'),
                },
                {
                  id: 3,
                  name: 'Flat White',
                  price: '90₺',
                  tag: '',
                  image: require('../../assets/images/coffee/flat-white.jpg'),
                },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  style={[
                    styles.discoverCard,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  {/* Top Image Section */}
                  <View style={styles.discoverImageContainer}>
                    <Image
                      source={item.image}
                      style={styles.discoverImage}
                      resizeMode='cover'
                    />
                    {/* Overlapping Badge */}
                    {item.tag ? (
                      <View
                        style={[
                          styles.tagBadge,
                          { backgroundColor: '#ffffff' },
                        ]}
                      >
                        <Text style={[styles.tagText, { color: colors.text }]}>
                          {item.tag}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Content Section */}
                  <View style={styles.discoverCardContent}>
                    <View style={styles.discoverCardFooter}>
                      <View>
                        <Text
                          style={[styles.discoverName, { color: colors.text }]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.discoverPrice,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {item.price}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Campaigns Section */}
          <View style={styles.campaignsSection}>
            <View
              style={[styles.campaignCard, { backgroundColor: colors.primary }]}
            >
              <Gift width={32} height={32} color={colors.star} />
              <Text style={[styles.campaignTitle, { color: colors.surface }]}>
                {t('home.specialOffer')}
              </Text>
              <Text
                style={[styles.campaignDescription, { color: colors.surface }]}
              >
                {t('home.specialOfferDescription')}
              </Text>
              <TouchableOpacity
                style={[
                  styles.campaignButton,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[styles.campaignButtonText, { color: colors.primary }]}
                >
                  {t('home.learnMore')}
                </Text>
              </TouchableOpacity>
            </View>

           
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    height: 56,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  rewardsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    height: REWARDS_SECTION_HEIGHT,
  },
  starBalance: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 14,
  },
  starBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  freeDrinkText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
  },
  freeDrinkCountContainer: {
    marginTop: 14,
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  freeDrinkCount: {
    fontSize: 28,
    fontWeight: '500',
  },
  progressContainer: {
    overflow: 'hidden',
  },
  cupSvg: {
    margin: 0,
    padding: 0,
    marginBottom: 0,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 20,
  },
  badgesContainer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 14,
  },
  badgesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 0,
  },
  badgeIcon: {
    marginTop: 14,
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    overflow: 'hidden',
  },
  contentHandleWrapper: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
    width: '100%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  membershipCard: {
    marginHorizontal: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  membershipChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 12,
  },
  membershipChipText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  accountBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
  },
  addMoneyButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  addMoneyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  discoverSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  discoverScroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  discoverCard: {
    width: 260,
    height: 340,
    borderRadius: 32,
    marginRight: 20,
    // iOS Shadow Properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    // Android Shadow Property
    elevation: 12,
  },
  discoverImageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  discoverImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 20,
    left: 20, // Overlap left side
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    zIndex: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  discoverCardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
  },
  discoverCardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  discoverName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  discoverPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  campaignsSection: {
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  campaignCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  campaignTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  campaignDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  campaignButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  campaignButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
