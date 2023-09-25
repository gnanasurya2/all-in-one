import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {BORDERS_COLORS} from '../../constants/styles';

type PosterProps = {
  url: string;
  width: number;
  height: number;
};
const PosterImage = ({url, width, height}: PosterProps) => {
  const styles = useMemo(() => {
    return StyleSheet.create({
      poster: {
        width,
        height,
        borderWidth: 1,
        borderColor: BORDERS_COLORS.PRIMARY,
      },
    });
  }, [width, height]);
  return (
    <FastImage
      style={styles.poster}
      source={{
        uri: url,
        priority: FastImage.priority.high,
      }}
      resizeMode={FastImage.resizeMode.stretch}
    />
  );
};

export default PosterImage;
