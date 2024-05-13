export * from '#dep/notification/whatsapp';

export type PromiseResult<Result, Error> = Promise<
  | {
      result: Result;
      error: undefined;
    }
  | {
      result: undefined;
      error: Error;
    }
>;

export interface NotificationService {
  sendNotification(
    message: string,
    recipient: string
  ): PromiseResult<string, Error>;
}
