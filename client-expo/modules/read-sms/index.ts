import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ReadSms.web.ts
// and on native platforms to ReadSms.ts
import ReadSmsModule from './src/ReadSmsModule';
import { ChangeEventPayload, Message, ReadSmsViewProps } from './src/ReadSms.types';

export function readLastNSMS(numberOfMessages = 10): Array<Message> {
  return ReadSmsModule.readLastNSMS(numberOfMessages);
}

export function requestSMSPermission() {
  return ReadSmsModule.requestSMSPermission();
}

export function readLastSMS() {
  return ReadSmsModule.readLastSMS();
}

export function hello(): string {
  return ReadSmsModule.hello();
}


export {  ReadSmsViewProps, ChangeEventPayload,Message };
