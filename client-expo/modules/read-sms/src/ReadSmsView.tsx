import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ReadSmsViewProps } from './ReadSms.types';

const NativeView: React.ComponentType<ReadSmsViewProps> =
  requireNativeViewManager('ReadSms');

export default function ReadSmsView(props: ReadSmsViewProps) {
  return <NativeView {...props} />;
}
