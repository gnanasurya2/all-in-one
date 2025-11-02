import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export type Message = {
  smsId: number;
  date: string;
  body: string;
  address: string;
};

export interface Spec extends TurboModule {
  hasSmsPermission(): boolean;
  requestSmsPermission(): void;
  readSms(timeStamp: number, addressList: Array<string>): Array<Message>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeReadSms') as Spec;
