import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import Text from '../Text';
import Item from './Item';
import { Dimensions, FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import Dot from './Dot';
import { useState } from 'react';

const data = [
  {
    id: 1,
    title: 'Apple Watch Series 7',
    description: 'The future of health is on your wrist',
    price: '$399',
  },
  {
    id: 2,
    title: 'AirPods Pro',
    description: 'Active noise cancellation for immersive sound',
    price: '$249',
  },
  {
    id: 3,
    title: 'AirPods Max',
    description: 'Effortless AirPods experience',
    price: '$549',
  },
];

const Carousel = () => {
  const x = useSharedValue(0);
  const [carouselData, seCarouselData] = useState([
    { key: 'spacer-left' },
    ...data,
    { key: 'spacer-right' },
  ]);

  const { width } = useWindowDimensions();
  const SIZE = width * 0.8;
  const SPACER = (width - SIZE) / 2;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <>
      <Animated.ScrollView
        style={{ height: 200 }}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={SIZE + SPACER}
        decelerationRate={'fast'}
        bounces={false}
        onScroll={onScroll}
        contentOffset={{ x: SPACER, y: 0 }}
      >
        {carouselData.map((item, index) => (
          <Item {...item} index={index} x={x} size={SIZE} spacer={SPACER} />
        ))}
      </Animated.ScrollView>
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <Dot index={index} key={index} x={x} size={SIZE} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Carousel;
