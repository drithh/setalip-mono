export * from '#dep/notification/whatsapp';
import { PromiseResult } from '#dep/types/index';
export interface NotificationService {
  sendNotification(
    message: string,
    recipient: string
  ): PromiseResult<string, Error>;
}
