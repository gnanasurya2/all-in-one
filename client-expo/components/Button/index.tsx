import {
  Button,
  ButtonProps,
  StyleSheet,
  View,
  Pressable,
  PressableProps,
  ActivityIndicator,
} from 'react-native';
import Text from '../Text';
import { COLORS, FONT_SIZE, SURFACE_COLORS } from '../../constants/styles';

interface IButtonProps extends PressableProps {
  title: string;
  isLoading?: boolean;
}

const CustomButton = ({ title, isLoading, ...props }: IButtonProps) => {
  return (
    <Pressable style={styles.button} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
      {isLoading && <ActivityIndicator color={SURFACE_COLORS.SUCCESS} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    width: 150,
    backgroundColor: COLORS.PRIMARY,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZE.H4,
  },
});
export default CustomButton;
