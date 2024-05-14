import { OtpService } from './../service/otp';
const TYPES = {
  Auth: Symbol.for('Auth'),
  NotificationService: Symbol.for('NotificationService'),
  Database: Symbol.for('Database'),
  UserRepository: Symbol.for('UserRepository'),
  AuthService: Symbol.for('AuthService'),
  OtpRepository: Symbol.for('OtpRepository'),
  OtpService: Symbol.for('OtpService'),
};

export { TYPES };
