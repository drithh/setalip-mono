import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface AgendaBookings {
  agenda_id: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  status: "booked" | "cancelled" | "checked_in" | "no_show";
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface Agendas {
  class_id: number;
  coach_id: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  location_facility_id: number;
  time: Date;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface Carousels {
  created_at: Generated<Date>;
  id: Generated<number>;
  image_url: string;
  title: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface ClassAssets {
  class_id: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  name: string;
  type: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  url: string;
}

export interface Classes {
  class_type_id: number;
  created_at: Generated<Date>;
  description: string;
  duration: number;
  id: Generated<number>;
  name: string;
  slot: number;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface ClassLocations {
  class_id: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  location_id: number;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface ClassTypes {
  id: Generated<number>;
  type: string;
}

export interface Coaches {
  created_at: Generated<Date>;
  id: Generated<number>;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface CreditTransactions {
  agenda_booking_id: Generated<number | null>;
  amount: number;
  class_type_id: number;
  created_at: Generated<Date>;
  credit_transaction_id: Generated<number | null>;
  expired_at: Generated<Date | null>;
  id: Generated<number>;
  note: string;
  type: "credit" | "debit";
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
  user_package_id: Generated<number | null>;
}

export interface DepositAccounts {
  account_number: string;
  bank_name: string;
  created_at: Generated<Date>;
  id: Generated<number>;
  name: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface FlashSales {
  created_at: Generated<Date>;
  discount: number;
  expired_at: Date;
  id: Generated<number>;
  name: string;
  type: "fixed" | "percentage";
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface FrequentlyAskedQuestions {
  answer: string;
  created_at: Generated<Date>;
  id: Generated<number>;
  question: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface LocationAssets {
  created_at: Generated<Date>;
  id: Generated<number>;
  location_id: number;
  name: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  url: string;
}

export interface LocationFacilities {
  capacity: number;
  created_at: Generated<Date>;
  deleted_at: Generated<Date | null>;
  id: Generated<number>;
  image_url: Generated<string | null>;
  location_id: number;
  name: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface LocationOperationalHours {
  closing_time: string;
  created_at: Generated<Date>;
  day_of_week: number;
  id: Generated<number>;
  location_id: number;
  opening_time: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface Locations {
  address: string;
  created_at: Generated<Date>;
  deleted_at: Generated<Date | null>;
  email: string;
  id: Generated<number>;
  link_maps: string;
  name: string;
  phone_number: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface LoyaltyRewards {
  created_at: Generated<Date>;
  credit: number;
  description: string;
  id: Generated<number>;
  name: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface LoyaltyShops {
  created_at: Generated<Date>;
  description: string;
  id: Generated<number>;
  image_url: Generated<string | null>;
  name: string;
  price: Generated<number | null>;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface LoyaltyTransactions {
  amount: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  loyalty_reward_id: Generated<number | null>;
  loyalty_shop_id: Generated<number | null>;
  note: string;
  type: "credit" | "debit";
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface Otp {
  created_at: Generated<Date>;
  expired_at: Date;
  id: Generated<number>;
  otp: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface Packages {
  class_type_id: number;
  created_at: Generated<Date>;
  credit: number;
  id: Generated<number>;
  is_active: Generated<number>;
  loyalty_points: number;
  name: string;
  one_time_only: number;
  price: number;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  valid_for: number;
}

export interface PackageTransactions {
  amount_paid: number;
  created_at: Generated<Date>;
  deposit_account_id: Generated<number | null>;
  discount: Generated<number | null>;
  id: Generated<number>;
  package_id: number;
  status: "completed" | "failed" | "pending";
  unique_code: number;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
  user_package_id: Generated<number | null>;
  voucher_id: Generated<number | null>;
}

export interface ResetPassword {
  created_at: Generated<Date>;
  expired_at: Date;
  id: Generated<number>;
  token: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface Reviews {
  created_at: Generated<Date>;
  id: Generated<number>;
  is_show: Generated<number>;
  rating: number;
  review: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface Statistics {
  created_at: Generated<Date>;
  id: Generated<number>;
  name: string;
  point: number;
  role: "coach" | "user";
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
}

export interface UserPackages {
  created_at: Generated<Date>;
  credit: number;
  expired_at: Date;
  id: Generated<number>;
  package_id: number;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface Users {
  address: string;
  created_at: Generated<Date>;
  date_of_birth: Date;
  email: string;
  hashed_password: string;
  id: Generated<number>;
  location_id: Generated<number | null>;
  name: string;
  phone_number: string;
  referral_id: Generated<number | null>;
  role: "admin" | "coach" | "owner" | "user";
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  verified_at: Generated<Date | null>;
}

export interface UserSessions {
  created_at: Generated<Date>;
  expires_at: Date;
  id: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: number;
}

export interface Vouchers {
  code: string;
  created_at: Generated<Date>;
  discount: number;
  expired_at: Date;
  id: Generated<number>;
  type: "fixed" | "percentage";
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  user_id: Generated<number | null>;
}

export interface WebSettings {
  created_at: Generated<Date>;
  id: Generated<number>;
  key: string;
  updated_at: Generated<Date>;
  updated_by: Generated<number>;
  value: string;
}

export interface DB {
  agenda_bookings: AgendaBookings;
  agendas: Agendas;
  carousels: Carousels;
  class_assets: ClassAssets;
  class_locations: ClassLocations;
  class_types: ClassTypes;
  classes: Classes;
  coaches: Coaches;
  credit_transactions: CreditTransactions;
  deposit_accounts: DepositAccounts;
  flash_sales: FlashSales;
  frequently_asked_questions: FrequentlyAskedQuestions;
  location_assets: LocationAssets;
  location_facilities: LocationFacilities;
  location_operational_hours: LocationOperationalHours;
  locations: Locations;
  loyalty_rewards: LoyaltyRewards;
  loyalty_shops: LoyaltyShops;
  loyalty_transactions: LoyaltyTransactions;
  otp: Otp;
  package_transactions: PackageTransactions;
  packages: Packages;
  reset_password: ResetPassword;
  reviews: Reviews;
  statistics: Statistics;
  user_packages: UserPackages;
  user_sessions: UserSessions;
  users: Users;
  vouchers: Vouchers;
  web_settings: WebSettings;
}
