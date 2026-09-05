import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConfig {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3001';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3001';
    }
    return 'http://localhost:3001';
  }

  // Auth
  static String get login => '$baseUrl/auth/login';
  static String get register => '$baseUrl/auth/register';
  static String get me => '$baseUrl/auth/me';
  static String get forgotPassword => '$baseUrl/auth/forgot-password';

  // Cases
  static String get cases => '$baseUrl/cases';
  static String caseDetail(String id) => '$baseUrl/cases/$id';

  // Documents
  static String get documents => '$baseUrl/documents';

  // Messages
  static String get messages => '$baseUrl/messages';

  // Payments
  static String get payments => '$baseUrl/payments';
  static String get paymentAccounts => '$baseUrl/payment-accounts';

  // Inquiries
  static String get inquiries => '$baseUrl/inquiries';

  // Court Dates
  static String get courtDates => '$baseUrl/court-dates';

  // Users
  static String get users => '$baseUrl/users';
  static String get lawyers => '$baseUrl/users/lawyers';
}
