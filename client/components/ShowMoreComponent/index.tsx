import React, {useMemo, useState} from 'react';
import {View, StyleSheet, Pressable, TextStyle} from 'react-native';
import Text from '../Text';
interface ShowMoreProps {
  children: string;
  textLimit: number;
  style: TextStyle;
}
const ShowMore = ({children, textLimit, style}: ShowMoreProps) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const [textLength, setTextLength] = useState(0);

  const shortText = useMemo(() => {
    console.log('inside', textLength);
    if (children.length > textLimit && textLength) {
      return children.substring(0, textLimit) + '...';
    }
    return children;
  }, [children, textLimit, textLength]);

  return (
    <View>
      <Pressable onPress={() => setIsShowMore(prev => !prev)}>
        <Text
          style={[style]}
          onTextLayout={event => {
            console.log(event.nativeEvent.lines[event.nativeEvent.lines.length - 1].y);
            if (!textLength) {
              setTextLength(Math.ceil(event.nativeEvent.lines[event.nativeEvent.lines.length - 1].y));
            }
          }}>
          {isShowMore ? children : shortText}
        </Text>
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
