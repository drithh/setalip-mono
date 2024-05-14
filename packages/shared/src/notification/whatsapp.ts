import axios, { AxiosResponse, AxiosError } from 'axios';
import { NotificationService } from '#dep/notification/index';
import { env } from '#dep/env';
import { injectable } from 'inversify';

interface Chat {
  secret: string;
  account: string;
  recipient: string;
  type: string;
  message: string;
}
@injectable()
export class WhatsappNotificationService implements NotificationService {
  async sendNotification(message: string, recipient: string) {
    try {
      const result = await this.sendWhatsappMessage({
        secret: env.WHAPIFY_SECRET,
        account: env.WHAPIFY_ACCOUNT,
        recipient: recipient,
        type: 'text',
        message: message,
      });
      console.log(result);
      return { result: 'Notification sent' };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async sendWhatsappMessage(chat: Chat): Promise<any> {
    try {
      const response: AxiosResponse<any> = await axios.post(
        'https://whapify.id/api/send/whatsapp',
        chat
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError<any> = error;
        if (axiosError.response) {
          console.error('Response error:', axiosError.response.data);
        } else {
          console.error('Request error:', axiosError.message);
        }
      } else {
        console.error('Non-Axios error:', (error as Error).message); // Cast error to Error
      }
      throw error;
    }
  }
}
