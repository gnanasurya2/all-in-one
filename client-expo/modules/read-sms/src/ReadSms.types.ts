export type ChangeEventPayload = {
  value: string;
};

export type ReadSmsViewProps = {
  name: string;
};

export type Message = {
  smsId: number;
  date:number;
  body: string;
  address: string;
}