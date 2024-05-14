export * from '#dep/notification/whatsapp';
import { PromiseResult } from '#dep/types/index';

export interface SendNotification {
  message: string;
  recipient: string;
}

export interface NotificationService {
  sendNotification(data: SendNotification): PromiseResult<string, Error>;
}
