import React, { useMemo } from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { BORDERS_COLORS } from '../../constants/styles';

type PosterProps = {
  url: string;
  width: number;
  height: number;
  style?: ImageStyle;
};
const PosterImage = ({ url, width, height, style }: PosterProps) => {
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
    <Image
      style={[styles.poster, style]}
      source={{
        uri: url,
      }}
      resizeMode="stretch"
    />
  );
};
// <FastImage
//   style={styles.poster}
//   source={{
//     uri: url,
//     priority: FastImage.priority.high,
//   }}
//   resizeMode={FastImage.resizeMode.stretch}
// />;
export default PosterImage;
