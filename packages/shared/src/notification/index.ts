export * from '#dep/notification/whatsapp';
import { PromiseResult } from '#dep/types/index';
import { LocationFacilities } from '../db';
import {
  SelectAgenda,
  SelectClass,
  SelectClassType,
  SelectCredit,
  SelectDepositAccount,
  SelectLocation,
  SelectPackage,
  SelectPackageTransaction,
} from '../repository';

export enum NotificationType {
  OtpSent,
  UserResetPassword,
  UserBookedAgenda,
  AdminCancelledUserAgenda,
  UserBoughtPackage,
  AdminConfirmedUserPackage,
  AdminDeletedAgenda,
  UserBookingLessThan2Hours,
}

interface OtpSentPayload {
  type: NotificationType.OtpSent;
  otp: string;
}

interface UserResetPasswordPayload {
  type: NotificationType.UserResetPassword;
  resetPasswordLink: string;
}

interface UserBookedAgendaPayload {
  type: NotificationType.UserBookedAgenda;
  date: SelectAgenda['time'];
  class: SelectClass['name'];
  duration: SelectClass['duration'];
  location: SelectLocation['name'];
  facility: LocationFacilities['name'];
}

interface AdminCancelledUserAgendaPayload {
  type: NotificationType.AdminCancelledUserAgenda;
  date: SelectAgenda['time'];
  class: SelectClass['name'];
  location: SelectLocation['name'];
  facility: LocationFacilities['name'];
}

interface UserBoughtPackagePayload {
  type: NotificationType.UserBoughtPackage;
  package: SelectPackage['name'];
  price: SelectPackageTransaction['amount_paid'];
  deposit_account_bank_name: SelectDepositAccount['bank_name'];
  deposit_account_name: SelectDepositAccount['name'];
  deposit_account_account_number: SelectDepositAccount['account_number'];
}

interface AdminConfirmedUserPackagePayload {
  type: NotificationType.AdminConfirmedUserPackage;
  package: SelectPackage['name'];
  class_type: SelectClassType['type'];
  credit: SelectCredit['amount'];
  status: 'completed';
  expired_at: SelectCredit['expired_at'];
}

interface AdminDeletedAgendaPayload {
  type: NotificationType.AdminDeletedAgenda;
  date: SelectAgenda['time'];
  class: SelectClass['name'];
  location: SelectLocation['name'];
  is_refund: boolean;
}

interface UserBookingLessThan2HoursPayload {
  type: NotificationType.UserBookingLessThan2Hours;
  date: SelectAgenda['time'];
  class: SelectClass['name'];
  location: SelectLocation['name'];
  facility: LocationFacilities['name'];
}

export type NotificationPayload =
  | OtpSentPayload
  | UserResetPasswordPayload
  | UserBookedAgendaPayload
  | AdminCancelledUserAgendaPayload
  | UserBoughtPackagePayload
  | AdminConfirmedUserPackagePayload
  | AdminDeletedAgendaPayload
  | UserBookingLessThan2HoursPayload;

export interface SendNotification {
  payload: NotificationPayload;
  recipient: string;
}

export interface NotificationService {
  sendNotification(data: SendNotification): PromiseResult<string, Error>;
  sendInvoice(data: SendNotification): PromiseResult<string, Error>;
}
