import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  NotificationPayload,
  NotificationService,
  NotificationType,
  SendNotification,
} from '#dep/notification/index';
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

const HEADER_MESSAGE = 'Pilates Reform Indonesia\n';
const FOOTER_MESSAGE = '\n\nPowered by Pilates Reform Indonesia';

const parseNotification = (payload: NotificationPayload) => {
  switch (payload.type) {
    case NotificationType.OtpSent:
      return (
        `${HEADER_MESSAGE}` +
        `Kode OTP Anda adalah ${payload.otp}. Jangan memberitahukan kode ini kepada siapapun.` +
        `Jika Anda tidak meminta kode ini, abaikan pesan ini.` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.UserResetPassword:
      return (
        `${HEADER_MESSAGE}` +
        `Silahkan klik link berikut untuk mereset password Anda: ${payload.resetPasswordLink}` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.UserBookedAgenda:
      return (
        `${HEADER_MESSAGE}` +
        `Anda telah berhasil melakukan booking kelas pada tanggal ${payload.date}, ` +
        `kelas ${payload.class} dengan durasi ${payload.duration} menit` +
        `di lokasi ${payload.location} pada ruangan ${payload.facility} ` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.AdminCancelledUserAgenda:
      return (
        `${HEADER_MESSAGE}` +
        `Admin telah membatalkan booking kelas Anda pada tanggal ${payload.date}, ` +
        `kelas ${payload.class}` +
        `di lokasi ${payload.location} pada ruangan ${payload.facility} ` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.UserBoughtPackage:
      return (
        `${HEADER_MESSAGE}` +
        `Anda telah berhasil melakukan pembelian paket ${payload.package} ` +
        `Silahkan melakukan pembayaran ke ${payload.deposit_account_bank_name} atas nama ${payload.deposit_account_name}` +
        `dengan nomor rekening ${payload.deposit_account_account_number}` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.AdminConfirmedUserPackage:
      return (
        `${HEADER_MESSAGE}` +
        `Admin telah mengkonfirmasi pembelian paket ${payload.package} ` +
        `dengan tipe kelas ${payload.class_type} sebesar ${payload.credit} kredit` +
        `status pembelian: ${payload.status} ` +
        `expired at: ${payload.expired_at}` +
        `${FOOTER_MESSAGE}`
      );
    default:
      return 'Unknown notification!';
  }
};

@injectable()
export class WhatsappNotificationService implements NotificationService {
  async sendNotification({ payload, recipient }: SendNotification) {
    const message = parseNotification(payload);
    try {
      const result = await this.sendWhatsappMessage({
        secret: env.WHAPIFY_SECRET,
        account: env.WHAPIFY_ACCOUNT,
        recipient: recipient,
        type: 'text',
        message: message,
      });
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
