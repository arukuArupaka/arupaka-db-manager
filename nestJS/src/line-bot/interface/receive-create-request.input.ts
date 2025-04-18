export interface ReceivedCreateRequestInput {
  weekday: number;

  hour: number;

  minute: number;

  message: string;

  description: string;

  category: string;

  resultSendWeekday?: number;

  resultSendHour?: number;

  resultSendMinute?: number;
}
