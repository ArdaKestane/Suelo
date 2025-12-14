import { Colors } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Text as SvgText, TextPath } from 'react-native-svg';

// SVG Component for the white halo
const SubtractSvg = ({ width, height }: { width: number; height: number }) => (
  <Svg
    width='100%'
    height='100%'
    viewBox='0 0 110 68'
    fill='none'
    preserveAspectRatio='none'
  >
    <Path d='M110 0C83.5 0 107 67 55 67C3 67 26.5 0 0 0H110Z' fill='white' />
  </Svg>
);

// Curved Text Component
const CurvedLabel = ({
  label,
  width,
  height,
  color,
}: {
  label: string;
  width: number;
  height: number;
  color: string;
}) => {
  const pathId = `curve_${label.replace(/\s+/g, '')}`;

  return (
    <Svg
      width={width}
      height={height}
      viewBox='0 0 100 100'
      style={{ position: 'absolute', top: 4, left: 0 }}
    >
      <Defs>
        <Path id={pathId} d='M 20 50 A 35 35 0 0 0 80 50' />
      </Defs>
      <SvgText
        fill={color}
        fontSize='10'
        fontWeight='semibold'
        textAnchor='middle'
        letterSpacing='1'
      >
        <TextPath href={`#${pathId}`} startOffset='50%'>
          {label}
        </TextPath>
      </SvgText>
    </Svg>
  );
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const TAB_COUNT = 5;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const TAB_BAR_HEIGHT = 42;
  const TAB_WIDTH = width / TAB_COUNT;

  // Responsive dimensions
  // Original SVG Ratio: 110/67 = ~1.64
  const SVG_WIDTH = 110;
  const SVG_HEIGHT = 67;
  const RATIO = SVG_HEIGHT / SVG_WIDTH;

  const HALO_WIDTH = Math.round(TAB_WIDTH * 1.2); // Allow overlap for "dip" effect
  const HALO_HEIGHT = Math.round(HALO_WIDTH * RATIO); // Maintain exact SVG aspect ratio
  const CIRCLE_SIZE = Math.round(HALO_WIDTH * 0.55); // Half of halo width

  const BUBBLE_OFFSET = (HALO_HEIGHT - CIRCLE_SIZE) / 2;
  const BUBBLE_OFFSET_QR = BUBBLE_OFFSET + 2;
  const bubblePosition = useSharedValue(state.index);

  React.useEffect(() => {
    bubblePosition.value = withSpring(state.index, {
      damping: 40,
      stiffness: 200,
    });
  }, [state.index]);

  const inputRange = state.routes.map((_, i) => i);
  const outputRange = state.routes.map((_, i) => {
    return Math.round(i * TAB_WIDTH + TAB_WIDTH / 2 - HALO_WIDTH / 2);
  });

  const activeRoute = state.routes[state.index];
  const activeOptions = descriptors[activeRoute.key].options;
  const activeLabel =
    activeOptions.tabBarLabel !== undefined
      ? activeOptions.tabBarLabel
      : activeOptions.title !== undefined
      ? activeOptions.title
      : activeRoute.name;
  const isActiveQrTab = activeRoute.name === 'qr' || activeLabel === 'QR';

  const animatedHaloHeight = useSharedValue(HALO_HEIGHT);

  React.useEffect(() => {
    animatedHaloHeight.value = withSpring(
      isActiveQrTab ? HALO_HEIGHT * 1.1 : HALO_HEIGHT * 1.05,
      {
        damping: 40,
        stiffness: 200,
      }
    );
  }, [isActiveQrTab, HALO_HEIGHT]);

  const bubbleStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      bubblePosition.value,
      inputRange,
      outputRange
    );

    return {
      transform: [{ translateX }],
      height: animatedHaloHeight.value,
    };
  });

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* Background container */}
      <View
        style={{
          height: TAB_BAR_HEIGHT + insets.bottom,
          backgroundColor: Colors.light.primary,
          borderTopWidth: 0,
        }}
      >
        {/* Animated Halo Indicator */}
        <Animated.View
          pointerEvents='none'
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              width: HALO_WIDTH,
              // height is now controlled by animated style
              zIndex: 1,
            },
            bubbleStyle,
          ]}
        >
          {/* The white halo shape */}
          <SubtractSvg width={HALO_WIDTH} height={HALO_HEIGHT} />

          {/* The colored circle indicator */}
          <View
            style={{
              position: 'absolute',
              top: isActiveQrTab ? BUBBLE_OFFSET_QR : BUBBLE_OFFSET, // Centered vertically in the halo (adjusted slightly up for visual balance)
              left: (HALO_WIDTH - CIRCLE_SIZE) / 2,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              backgroundColor: Colors.light.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </Animated.View>

        {/* Tab Buttons Container */}
        <View
          style={{
            flexDirection: 'row',
            height: TAB_BAR_HEIGHT,
            paddingBottom: 0, // Insets handled by parent container height
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isQrTab = route.name === 'qr' || label === 'QR';

            return (
              <AnimatedTouchableOpacity
                key={route.key}
                accessibilityRole='button'
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  marginTop: isQrTab
                    ? TAB_BAR_HEIGHT * 0.4
                    : isFocused
                    ? TAB_BAR_HEIGHT * 0.1
                    : TAB_BAR_HEIGHT * 0.35,
                }}
              >
                <View style={{ marginBottom: isFocused ? 0 : 0 }}>
                  {options.tabBarIcon &&
                    options.tabBarIcon({
                      focused: isFocused,
                      color: isFocused ? '#FFFFFF' : '#8E8E93',
                      size: 20,
                    })}
                </View>
                {!isQrTab && (
                  <>
                    {!isFocused ? (
                      <Text
                        style={{
                          fontSize: 9,
                          color: '#8E8E93',
                          marginTop: TAB_BAR_HEIGHT * 0.08,
                          fontWeight: '500',
                        }}
                      >
                        {typeof label === 'string' ? label : ''}
                      </Text>
                    ) : (
                      <View
                        style={{
                          position: 'absolute',
                          width: HALO_WIDTH,
                          height: HALO_WIDTH,
                          top: -HALO_WIDTH * 0.25,
                          pointerEvents: 'none',
                        }}
                      >
                        <CurvedLabel
                          label={typeof label === 'string' ? label : ''}
                          width={HALO_WIDTH}
                          height={HALO_WIDTH}
                          color='#FFFFFF'
                        />
                      </View>
                    )}
                  </>
                )}
              </AnimatedTouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
