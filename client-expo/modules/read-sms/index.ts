import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReadSms.web.ts
// and on native platforms to ReadSms.ts
import ReadSmsModule from './src/ReadSmsModule';
import ReadSmsView from './src/ReadSmsView';
import { ChangeEventPayload, ReadSmsViewProps } from './src/ReadSms.types';

// Get the native constant value.
export const PI = ReadSmsModule.PI;

export function hello(): string {
  return ReadSmsModule.hello();
}

export async function setValueAsync(value: string) {
  return await ReadSmsModule.setValueAsync(value);
}

const emitter = new EventEmitter(ReadSmsModule ?? NativeModulesProxy.ReadSms);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ReadSmsView, ReadSmsViewProps, ChangeEventPayload };
