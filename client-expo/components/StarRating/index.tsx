import React, { useState, useMemo } from 'react';
import { StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

function customRound(number: number) {
  const floorNumber = Math.floor(number);
  if (number >= floorNumber && number < floorNumber + 0.25) {
    return floorNumber;
  } else if (number >= floorNumber + 0.25 && number < floorNumber + 0.75) {
    return floorNumber + 0.5;
  } else {
    return floorNumber + 1;
  }
}

interface IStarRatingProps {
  maxRating?: number;
  size?: number;
  onChange: (value: number) => void;
  value: number;
}

const StarRating = ({ maxRating = 5, size = 40, onChange, value }: IStarRatingProps) => {
  const numberOfStars = useMemo(() => new Array(maxRating).fill(1), [maxRating]);

  const { width } = useWindowDimensions();
  const gesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((event) => {
      //TODO: Clamp the starting and ending empty while calculating the rating.
      onChange(customRound((event.absoluteX / width) * 5));
    });
  return (
    <GestureDetector gesture={gesture}>
      <Pressable style={styles.wrapper}>
        {numberOfStars.map((_, index) => (
          <FontAwesome
            key={index}
            size={size}
            color={'yellow'}
            onPress={(event) => {
              onChange(index + (event.nativeEvent.locationX < size * 0.5 ? 0.5 : 1));
            }}
            name={
              index < value
                ? Math.floor(value) === index && value !== index
                  ? 'star-half-full'
                  : 'star'
                : 'star-o'
            }
          />
        ))}
      </Pressable>
    </GestureDetector>
  );
};

export default StarRating;
const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginVertical: 20,
  },
});
