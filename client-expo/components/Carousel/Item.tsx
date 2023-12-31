import Animated, { SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { BORDERS_COLORS, SURFACE_COLORS } from '../../constants/styles';
import Text from '../Text';
import { Dimensions, StyleSheet, View, useWindowDimensions } from 'react-native';

const { width } = Dimensions.get('window');
const Item = ({
  id,
  title,
  description,
  price,
  x,
  index,
  size,
  spacer,
}: {
  id: number;
  title: string;
  description: string;
  price: string;
  x: SharedValue<number>;
  size: number;
  spacer: number;
  index: number;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [(index - 2) * size, (index - 1) * size, index * size],
      [0.8, 1, 0.8]
    );
    return {
      transform: [{ scale }],
    };
  });

  if (!description) {
    return <View style={{ width: spacer }} key={index} />;
  }
  return (
    <Animated.View style={[styles.wrapper, animatedStyle, { width: size }]}>
      <Text style={{ color: 'white' }}>{title}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: SURFACE_COLORS.PRIMARY,
    borderWidth: 1,
    borderColor: BORDERS_COLORS.PRIMARY,
    height: 150,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Item;
