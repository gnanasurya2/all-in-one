import {FONT_FAMILY, TEXT_COLORS} from '../../constants/styles';
import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface RecentSearch {
  id: string;
  title: string;
  type: string;
  time: number;
}

interface RecentlySearchedProps {
  data: RecentSearch;
  onPress: () => void;
}

const RecentlySearched = ({data, onPress}: RecentlySearchedProps) => {
  return (
    <Pressable style={styles.wrapper} onPress={onPress}>
      <Text style={styles.title} numberOfLines={1}>
        {data.title}
      </Text>
      <MaterialCommunityIcons
        name="arrow-top-right"
        size={32}
        color={TEXT_COLORS.BODY_L2}
        style={styles.icon}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 32,
    fontFamily: FONT_FAMILY.GT_WALSHEIM_PRO_BOLD,
    color: TEXT_COLORS.BODY_L2,
    width: 90,
  },
  icon: {paddingTop: 8},
});
export default RecentlySearched;
