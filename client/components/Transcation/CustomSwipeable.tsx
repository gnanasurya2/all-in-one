import React, { useCallback } from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {SURFACE_COLORS, TEXT_COLORS} from '../../constants/styles';
interface RightActionProps {
  progress: SharedValue<number>;
  onRightActionPressed: () => void;
}

const RightAction = ({progress, onRightActionPressed}: RightActionProps) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            progress.get(),
            [0, -100],
            [-30, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      style={styles.rightWrapper}
      onPress={onRightActionPressed}>
      <Animated.Text style={[styles.text, animatedStyles]}>Edit</Animated.Text>
    </TouchableOpacity>
  );
};
const renderRightActions = ({
  progress,
  onRightActionPressed,
}: {
  progress: SharedValue<number>;
  onRightActionPressed: () => void;
}) => (
  <RightAction
    progress={progress}
    onRightActionPressed={onRightActionPressed}
  />
);

interface LeftActionProps {
  progress: SharedValue<number>;
  onLeftActionPressed: () => void;
}

const LeftAction = ({progress, onLeftActionPressed}: LeftActionProps) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            progress.get(),
            [0, 100],
            [-30, 0],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            progress.get(),
            [0, 100],
            [0.6, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <TouchableOpacity style={styles.leftWrapper} onPress={onLeftActionPressed}>
      <Animated.Text style={[styles.text, animatedStyles]}>
        Delete
      </Animated.Text>
    </TouchableOpacity>
  );
};
const renderLeftActions = ({
  progress,
  onLeftActionPressed,
}: {
  progress: SharedValue<number>;
  onLeftActionPressed: () => void;
}) => (
  <LeftAction progress={progress} onLeftActionPressed={onLeftActionPressed} />
);

const CustomSwipeable = ({
  children,
  containerStyle,
  onLeftActionPressed,
  onRightActionPressed,
}: {
  children: React.ReactNode;
  containerStyle: StyleProp<ViewStyle>;
  onRightActionPressed: () => void;
  onLeftActionPressed: () => void;
}) => {
  const handleRightActions = useCallback(
    (_: SharedValue<number>, progress: SharedValue<number>) =>
      renderRightActions({progress, onRightActionPressed}),
    [onRightActionPressed],
  );

  const handleLeftActions = useCallback(
    (_: SharedValue<number>, progress: SharedValue<number>) =>
      renderLeftActions({progress, onLeftActionPressed}),
    [onLeftActionPressed],
  );

  return (
    <Swipeable
      containerStyle={containerStyle}
      friction={3}
      renderRightActions={handleRightActions}
      renderLeftActions={handleLeftActions}>
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  leftWrapper: {
    backgroundColor: SURFACE_COLORS.ERROR,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  rightWrapper: {
    backgroundColor: SURFACE_COLORS.INFORMATION,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    borderTopRightRadius: 11,
    borderBottomRightRadius: 11,
  },
  text: {
    color: TEXT_COLORS.HEADING,
    fontWeight: '600',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});

export default CustomSwipeable;
