import { View, StyleSheet } from 'react-native';
import Text from '../../components/Text';

const ListViewScreen = () => {
  return (
    <View style={styles.wrapper}>
      <Text>ListViewScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default ListViewScreen;
