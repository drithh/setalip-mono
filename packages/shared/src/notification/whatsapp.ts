import axios, { AxiosResponse, AxiosError } from 'axios';
import { NotificationService, SendNotification } from '#dep/notification/index';
import { env } from '#dep/env';
import { injectable } from 'inversify';

interface PostBody {
  secret: string;
  account: string;
  recipient: string;
  type: string;
  message: string;
}

interface SuccessResponse {
  status: 200;
  message: 'WhatsApp message has been queued for sending!';
  data: false;
}
interface ErrorResponse {
  status: 400;
  message: 'Invalid Parameters!';
  data: false;
}
@injectable()
export class WhatsappNotificationService implements NotificationService {
  async sendNotification({ message, recipient }: SendNotification) {
    try {
      const result = await this.sendWhatsappMessage({
        secret: env.WHAPIFY_SECRET,
        account: env.WHAPIFY_ACCOUNT,
        recipient: recipient,
        type: 'text',
        message: message,
      });
      console.log('result: ', result);
      return { result: 'Notification sent' };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async sendWhatsappMessage(body: PostBody): Promise<any> {
    try {
      const response: AxiosResponse<SuccessResponse | ErrorResponse> =
        await axios.post('https://whapify.id/api/send/whatsapp', null, {
          params: body,
        });

      if (response.data.status === 400) {
        console.error('Error:', response.data.message);
        throw new Error(response.data.message);
      }

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
