import * as React from 'react';

import { ReadSmsViewProps } from './ReadSms.types';

export default function ReadSmsView(props: ReadSmsViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
