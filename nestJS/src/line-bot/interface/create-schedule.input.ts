export interface CreateScheduleInput {
  weekday: number;

  hour: number;

  minute: number;

  message: string;

  description: string;

  category: string;

  handler: (input: any) => Promise<void>;
}
