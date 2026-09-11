import 'package:flutter/material.dart';
import '../models/case_model.dart';
import '../models/payment_model.dart';
import '../models/court_date_model.dart';
import '../models/inquiry_model.dart';
import '../models/notification_model.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class DashboardProvider extends ChangeNotifier {
  List<CaseModel> _cases = [];
  List<PaymentModel> _payments = [];
  List<CourtDateModel> _courtDates = [];
  List<InquiryModel> _inquiries = [];
  List<NotificationModel> _notifications = [];
  bool _isLoading = false;

  List<CaseModel> get cases => _cases;
  List<PaymentModel> get payments => _payments;
  List<CourtDateModel> get courtDates => _courtDates;
  List<InquiryModel> get inquiries => _inquiries;
  List<NotificationModel> get notifications => _notifications;
  int get unreadNotificationCount => _notifications.where((n) => !n.isRead).length;
  bool get isLoading => _isLoading;

  Future<void> fetchDashboardData() async {
    _isLoading = true;
    notifyListeners();

    try {
      final casesData = await ApiService.get(ApiConfig.cases);
      if (casesData is List) {
        _cases = casesData.map((e) => CaseModel.fromJson(e)).toList();
      }

      final paymentsData = await ApiService.get(ApiConfig.payments);
      if (paymentsData is List) {
        _payments = paymentsData.map((e) => PaymentModel.fromJson(e)).toList();
      }

      final datesData = await ApiService.get(ApiConfig.courtDates);
      if (datesData is List) {
        _courtDates = datesData.map((e) => CourtDateModel.fromJson(e)).toList();
      }
    } catch (e) {
      debugPrint('Error fetching dashboard data: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchInquiries() async {
    try {
      final data = await ApiService.get(ApiConfig.inquiries);
      if (data is List) {
        _inquiries = data.map((e) => InquiryModel.fromJson(e)).toList();
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error fetching inquiries: $e');
    }
  }

  Future<void> createCase({
    required String title,
    required String description,
  }) async {
    await ApiService.post(ApiConfig.cases, {
      'title': title,
      'description': description,
    });
    await fetchDashboardData();
  }

  Future<void> updateCaseTitle({
    required String caseId,
    required String title,
    String? description,
  }) async {
    await ApiService.patch('${ApiConfig.cases}/$caseId', {
      'title': title,
      if (description != null) 'description': description,
    });
    await fetchDashboardData();
  }

  Future<void> createInquiry({
    required String name,
    required String email,
    required String message,
    String? phone,
    String? serviceNeeded,
  }) async {
    await ApiService.post(ApiConfig.inquiries, {
      'name': name,
      'email': email,
      'message': message,
      'phone': phone,
      'serviceNeeded': serviceNeeded,
    });
  }

  Future<List<dynamic>> fetchCaseTimeline(String caseId) async {
    try {
      final res = await ApiService.get('${ApiConfig.cases}/$caseId/timeline');
      if (res is List) return res;
    } catch (e) {
      debugPrint('Error fetching timeline: $e');
    }
    return [];
  }

  Future<void> addTimelineEvent({
    required String caseId,
    required String title,
    String? description,
    String? status,
    String? date,
  }) async {
    await ApiService.post('${ApiConfig.cases}/$caseId/timeline', {
      'title': title,
      if (description != null) 'description': description,
      if (status != null) 'status': status,
      if (date != null) 'date': date,
    });
  }

  Future<void> deleteTimelineEvent(String caseId, String timelineId) async {
    await ApiService.delete('${ApiConfig.cases}/$caseId/timeline/$timelineId');
  }

  Future<void> fetchNotifications() async {
    try {
      final res = await ApiService.get(ApiConfig.notifications);
      if (res is List) {
        _notifications = res.map((e) => NotificationModel.fromJson(e)).toList();
      } else if (res is Map && res['items'] is List) {
        _notifications = (res['items'] as List)
            .map((e) => NotificationModel.fromJson(e))
            .toList();
      }
      notifyListeners();
    } catch (e) {
      debugPrint('Error fetching notifications: $e');
    }
  }

  Future<void> markAllNotificationsRead() async {
    try {
      await ApiService.patch(ApiConfig.markNotificationsRead, {});
      await fetchNotifications();
    } catch (e) {
      debugPrint('Error marking notifications read: $e');
    }
  }

  Future<void> addCourtDate({
    required String caseId,
    required String location,
    required String date,
    String? description,
  }) async {
    await ApiService.post(ApiConfig.courtDates, {
      'caseId': caseId,
      'location': location,
      'date': date,
      if (description != null) 'description': description,
    });
    await fetchDashboardData();
  }
}
