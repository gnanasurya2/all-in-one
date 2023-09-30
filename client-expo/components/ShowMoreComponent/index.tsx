import React, {useMemo, useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, TextStyle} from 'react-native';
import Text from '../Text';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
interface ShowMoreProps {
  children: string;
  textLimit: number;
  style: TextStyle;
}
const ShowMore = ({children, textLimit, style}: ShowMoreProps) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const [textLength, setTextLength] = useState(0);
  const height = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    if (height.value) {
      return {
        height: withTiming(height.value),
      };
    }
    return {};
  });

  useEffect(() => {
    height.value = isShowMore ? textLength + 30 : 100;
  }, [isShowMore]);

  const shortText = useMemo(() => {
    if (children.length > textLimit && textLength) {
      return children.substring(0, textLimit) + '...';
    }
    return children;
  }, [children, textLimit, textLength]);

  return (
    <View>
      <Pressable
        onPress={() => {
          setIsShowMore(prev => !prev);
        }}>
        <Animated.Text
          style={[style, animatedStyles]}
          onTextLayout={event => {
            if (!textLength) {
              setTextLength(Math.ceil(event.nativeEvent.lines[event.nativeEvent.lines.length - 1].y));
            }
          }}>
          {isShowMore ? children : shortText}
        </Animated.Text>
        <View style={styles.dottedWrapper}>{isShowMore ? null : <Text>...</Text>}</View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  dottedWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShowMore;
