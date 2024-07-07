import axios, { AxiosResponse, AxiosError } from 'axios';
import {
  NotificationPayload,
  NotificationService,
  NotificationType,
  SendNotification,
} from '#dep/notification/index';
import { env } from '#dep/env';
import { injectable } from 'inversify';
import { addMinutes, format } from 'date-fns';

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

const HEADER_MESSAGE = 'Pilates Reform Indonesia\n\n';
const FOOTER_MESSAGE =
  '\n\nJika Anda memiliki pertanyaan, silahkan hubungi admin\n\nPowered by Pilates Reform Indonesia';

const parseNotification = (payload: NotificationPayload) => {
  switch (payload.type) {
    case NotificationType.OtpSent:
      return (
        `${HEADER_MESSAGE}` +
        `Kode OTP Anda adalah ${payload.otp}\n\nJangan memberitahukan kode ini kepada siapapun. ` +
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
      const startTime = format(new Date(payload.date), 'HH:mm');
      const endDate = addMinutes(payload.date, payload.duration);
      const endTime = format(endDate, 'HH:mm');
      return (
        `${HEADER_MESSAGE}` +
        `Booking kelas berhasil, Detail:\n` +
        `Kelas: ${payload.class}\n` +
        `Tanggal: ${format(new Date(payload.date), 'eeee, dd/MM/yyyy')}\n` +
        `Waktu: ${startTime} - ${endTime}\n` +
        `Lokasi: ${payload.location} - ${payload.facility}` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.AdminCancelledUserAgenda:
      return (
        `${HEADER_MESSAGE}` +
        `Booking kelas dibatalkan, Detail:\n` +
        `Kelas: ${payload.class}\n` +
        `Tanggal: ${format(new Date(payload.date), 'eeee, dd/MM/yyyy')}\n` +
        `Lokasi: ${payload.location} - ${payload.facility}` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.UserBoughtPackage:
      return (
        `${HEADER_MESSAGE}` +
        `Transaksi pembelian paket ${payload.package} berhasil dibuat.\n\n` +
        `Silahkan melakukan pembayaran pada:\n` +
        `Bank: ${payload.deposit_account_bank_name}\n` +
        `Atas Nama: ${payload.deposit_account_name}\n` +
        `Nomor Rekening: ${payload.deposit_account_account_number}\n` +
        `${FOOTER_MESSAGE}`
      );
    case NotificationType.AdminConfirmedUserPackage:
      return (
        `${HEADER_MESSAGE}` +
        `Pembelian paket telah dikonfirmasi\n ` +
        `Status transaksi: ${payload.status}\n ` +
        `Paket: ${payload.package} (${payload.class_type})\n` +
        `Jumlah Session ${payload.credit} sesi\n` +
        `Paket kadaluarsa: ${payload.expired_at ? format(new Date(payload.expired_at), 'eeee, dd/MM/yyyy') : 'Tidak terbatas'}` +
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
