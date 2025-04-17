export interface CreateScheduleInput {
  weekday: number;

  hour: number;

  minute: number;

  message: string;

  description: string;

  category: string;

  resultSendWeekday?: number;
  resultSendHour?: number;
  resultSendMinute?: number;
  function: Promise<void>;
}
