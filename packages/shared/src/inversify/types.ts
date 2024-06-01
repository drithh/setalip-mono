import { OtpService } from './../service/otp';
const TYPES = {
  Auth: Symbol.for('Auth'),
  NotificationService: Symbol.for('NotificationService'),
  Database: Symbol.for('Database'),
  UserRepository: Symbol.for('UserRepository'),
  AuthService: Symbol.for('AuthService'),
  OtpRepository: Symbol.for('OtpRepository'),
  OtpService: Symbol.for('OtpService'),
  ResetPasswordRepository: Symbol.for('ResetPasswordRepository'),
  ResetPasswordService: Symbol.for('ResetPasswordService'),
  LocationRepository: Symbol.for('LocationRepository'),
  LocationService: Symbol.for('LocationService'),
  PackageRepository: Symbol.for('PackageRepository'),
  PackageService: Symbol.for('PackageService'),
  ClassTypeRepository: Symbol.for('ClassTypeRepository'),
  ClassTypeService: Symbol.for('ClassTypeService'),
  UserService: Symbol.for('UserService'),
};

export { TYPES };
