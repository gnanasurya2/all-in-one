import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  cancelAnimation,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Particle from './particle';
import {getRandomValues, pickRandomItem} from './utils';
import {GRADIENT_COLORS} from '../../constants/styles';

export interface ConfettiRef {
  start: () => void;
  pause: () => void;
  reset: () => void;
}

interface ConfettiProps {
  children: React.ReactNode;
  particleCount?: number;
  duration?: number;
  type?: 'EXPLOSION' | 'FALL';
}

interface Particle {
  id: number;
  initialY: number;
  swingX: number;
  initialX: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  size: number;
  color: string;
  isCircle: boolean;
  opacity: number;
}

interface LayoutProps {
  width: number;
  height: number;
}

const PARTICLE_COUNT = 100;
const DURATION = 3000;

const Confetti = forwardRef<ConfettiRef, ConfettiProps>(
  (
    {
      children,
      particleCount = PARTICLE_COUNT,
      duration = DURATION,
      type = 'EXPLOSION',
    },
    ref,
  ) => {
    const animationValue = useSharedValue(0);
    const [particles, setParticles] = useState<Array<Particle>>([]);
    const [wrapperLayout, setWrapperLayout] = useState<LayoutProps>({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      animationValue.value = 0;
      setParticles(
        Array.from({length: particleCount}, (_, idx) => ({
          id: idx,
          initialY: getRandomValues(-400, type === 'FALL' ? -20 : -200),
          initialX:
            getRandomValues(
              type === 'EXPLOSION' ? 0.1 : 0,
              type === 'EXPLOSION' ? 0.9 : 1,
            ) * wrapperLayout.width,
          swingX: getRandomValues(-30, 30),
          rotateX: getRandomValues(0.2, 1),
          rotateY: getRandomValues(0.2, 1),
          rotateZ: getRandomValues(0.2, 1),
          size: getRandomValues(5, 15),
          color: pickRandomItem(GRADIENT_COLORS),
          isCircle: getRandomValues(0, 1) > 0.5,
          opacity: getRandomValues(0.3, 1),
        })),
      );
    }, [particleCount, wrapperLayout, animationValue, type]);

    useImperativeHandle(ref, () => ({
      start: () => {
        if (type === 'FALL') {
          animationValue.value = withTiming(1, {duration}, () => {
            animationValue.value = 0;
          });
        } else {
          animationValue.value = withSequence(
            withTiming(0.5, {duration: duration * 0.4}),
            withTiming(1, {duration: duration * 0.6}, () => {
              animationValue.value = 0;
            }),
          );
        }
      },
      pause: () => {
        cancelAnimation(animationValue);
      },
      reset: () => {
        animationValue.value = 0;
      },
    }));

    return (
      <View
        style={
          type === 'EXPLOSION'
            ? styles.explosionConfettiView
            : styles.fallConfettiView
        }
        onLayout={event =>
          setWrapperLayout({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }>
        {particles.map(ele => {
          return (
            <Particle
              key={ele.id}
              initialY={ele.initialY}
              initialX={ele.initialX}
              rotateX={ele.rotateX}
              rotateY={ele.rotateY}
              rotateZ={ele.rotateZ}
              swingX={ele.swingX}
              color={ele.color}
              size={ele.size}
              isCircle={ele.isCircle}
              maxY={wrapperLayout.height + 400}
              maxX={wrapperLayout.width}
              opacity={ele.opacity}
              type={type}
              animationValue={animationValue}
            />
          );
        })}
        <View
          style={
            type === 'EXPLOSION'
              ? styles.explosionConfettiChildren
              : styles.fallConfettiChildren
          }>
          {children}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  fallConfettiView: {
    overflow: 'hidden',
  },
  explosionConfettiView: {},
  fallConfettiChildren: {},
  explosionConfettiChildren: {zIndex: 2},
});
export default Confetti;
