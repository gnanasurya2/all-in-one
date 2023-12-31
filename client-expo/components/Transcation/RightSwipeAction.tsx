import { TouchableOpacity, StyleSheet, Animated } from 'react-native';

const RightSwipeActions = ({ progress, dragX }: { dragX: any; progress: any }) => {
  const trans = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [-20, -40],
  });
  const scale = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });
  return (
    <TouchableOpacity style={styles.wrapper}>
      <Animated.Text
        style={[
          styles.text,
          { transform: [{ translateX: trans }, { scale }, { rotateZ: '180deg' }] },
        ]}
      >
        Delete
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  text: {
    color: '#1b1a17',
    fontWeight: '600',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});
export default RightSwipeActions;
