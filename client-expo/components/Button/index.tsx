import {
  StyleSheet,
  Pressable,
  PressableProps,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Text from '../Text';
import { COLORS, FONT_SIZE, SURFACE_COLORS } from '../../constants/styles';
import { FontAwesome } from '@expo/vector-icons';
interface IButtonProps extends PressableProps {
  title: string;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  startIcon?: keyof typeof FontAwesome.glyphMap;
  startIconStyle?: StyleProp<TextStyle>;
  endIcon?: keyof typeof FontAwesome.glyphMap;
  endIconStyle?: StyleProp<TextStyle>;
}

const CustomButton = ({
  title,
  isLoading,
  startIcon,
  startIconStyle,
  endIcon,
  endIconStyle,
  style = {},
  ...props
}: IButtonProps) => {
  return (
    <Pressable style={[styles.button, style]} {...props}>
      {startIcon && <FontAwesome style={[styles.startIcon, startIconStyle]} name={startIcon} />}
      <Text style={styles.buttonText}>{title}</Text>
      {isLoading && <ActivityIndicator color={SURFACE_COLORS.SUCCESS} />}
      {endIcon && <FontAwesome style={[styles.endIcon, endIconStyle]} name={endIcon} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  startIcon: {
    marginRight: 4,
    fontSize: 16,
    color: 'white',
  },
  endIcon: {
    color: 'white',
    fontSize: 16,
  },
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
