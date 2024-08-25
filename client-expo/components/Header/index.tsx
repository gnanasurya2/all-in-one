import { SURFACE_COLORS, TEXT_COLORS, FONT_FAMILY } from '@constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import Text from '@components/Text';
import { router } from 'expo-router';
import { View, Pressable, StyleSheet } from 'react-native';

const Header = ({ title }: { title: string }) => {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={() => {
          router.back();
        }}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="white" />
      </Pressable>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: SURFACE_COLORS.TERTIARY,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  headerText: {
    color: TEXT_COLORS.HEADING,
    fontSize: 18,
    fontFamily: FONT_FAMILY.HELVETICA_ROUNDED,
    marginLeft: 16,
  },
});

export default Header;
