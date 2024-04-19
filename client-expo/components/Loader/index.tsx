import { SURFACE_COLORS } from '@constants/styles';
import {
  Canvas,
  Circle,
  Fill,
  Group,
  SkPoint,
  useCanvasRef,
  vec,
} from '@shopify/react-native-skia';
import React, { useEffect, useState } from 'react';
import { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

type RingProps = {
  size: number;
  color: string;
  origin: SkPoint;
};
const Ring = ({ size, color, origin }: RingProps) => {
  const r = useSharedValue(size);

  useEffect(() => {
    r.value = withRepeat(
      withSequence(
        withTiming(size * 0.6, { duration: 1000 }),
        withTiming(size, { duration: 1000 })
      ),
      -1
    );
  }, [r, size]);

  return <Circle c={origin} r={r} color={color} />;
};

const Loader = () => {
  const strokeWidth = 4;
  const ref = useCanvasRef();
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);
  const canvasCenter = vec(canvasWidth / 4, canvasHeight / 2);
  return (
    <Canvas
      style={{ flex: 1, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}
      ref={ref}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setCanvasWidth(width);
        setCanvasHeight(height);
      }}
    >
      <Group transform={[{ translateX: canvasCenter.x, translateY: 1000 }]}>
        <Fill color={SURFACE_COLORS.PAGE} />
        <Group color="lightblue" style="stroke" strokeWidth={strokeWidth}>
          <Ring size={24} color="#00e0ff" origin={canvasCenter} />
          <Ring size={16} color="#40dfff" origin={canvasCenter} />
          <Ring size={6} color="#80ddff" origin={canvasCenter} />
        </Group>
      </Group>
    </Canvas>
  );
};

export default Loader;
