import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface ParticleProps {
  initialX: number;
  initialY: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  swingX: number;
  size: number;
  animationValue: SharedValue<number>;
  maxY: number;
  maxX: number;
  color: string;
  isCircle: boolean;
  opacity: number;
  type: 'EXPLOSION' | 'FALL';
}

const Particle = ({
  initialX,
  initialY,
  rotateX,
  rotateY,
  rotateZ,
  animationValue,
  maxY,
  maxX,
  size,
  color,
  isCircle,
  swingX,
  opacity,
  type,
}: ParticleProps) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity:
        type === 'FALL'
          ? opacity
          : interpolate(
              animationValue.value,
              [0, 0.8, 1],
              [opacity, opacity, 0],
            ),

      transform: [
        {
          translateY:
            type === 'FALL'
              ? interpolate(
                  animationValue.value,
                  [0, 1],
                  [initialY, maxY],
                  Extrapolation.CLAMP,
                )
              : interpolate(
                  animationValue.value,
                  [0, 0.5, 1],
                  [30, initialY, 300 - initialY],
                  Extrapolation.CLAMP,
                ),
        },
        {
          translateX:
            type === 'FALL'
              ? interpolate(
                  animationValue.value,
                  [0, 0.5, 0.8, 1],
                  [initialX, initialX + swingX, initialX - swingX, initialX],
                )
              : interpolate(
                  animationValue.value,
                  [0, 0.5, 0.8, 1],
                  [maxX / 2, initialX + swingX, initialX - swingX, initialX],
                ),
        },
        {
          rotateX:
            interpolate(animationValue.value, [0, 1], [0, rotateX * 360 * 20]) +
            'deg',
        },
        {
          rotateY:
            interpolate(animationValue.value, [0, 1], [0, rotateY * 360 * 10]) +
            'deg',
        },
        {
          rotateZ:
            interpolate(animationValue.value, [0, 1], [0, rotateZ * 360 * 4]) +
            'deg',
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        animatedStyles,
        {
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: isCircle ? '50%' : '0%',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 1,
  },
});
export default Particle;
