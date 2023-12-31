import Animated, {
  Extrapolate,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

const Dot = ({ x, index, size }: { x: SharedValue<number>; index: number; size: number }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [(index - 1) * size, index * size, (index + 1) * size],
      [10, 20, 10],
      Extrapolate.CLAMP
    );
    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * size, index * size, (index + 1) * size],
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );
    return {
      width: widthAnimation,
      opacity: opacityAnimation,
    };
  });
  return <Animated.View style={[styles.dots, animatedStyle]} />;
};

const styles = StyleSheet.create({
  dots: {
    height: 10,
    backgroundColor: 'orange',
    marginHorizontal: 10,
    borderRadius: 5,
  },
});

export default Dot;
