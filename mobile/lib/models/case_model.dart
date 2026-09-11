import 'user_model.dart';
import 'document_model.dart';
import 'message_model.dart';
import 'court_date_model.dart';

class CaseModel {
  final String id;
  final String title;
  final String description;
  final String status; // OPEN, IN_PROGRESS, COMPLETED, CLOSED
  final String clientId;
  final String? lawyerId;
  final UserModel? client;
  final UserModel? lawyer;
  final List<DocumentModel> documents;
  final List<MessageModel> messages;
  final List<CourtDateModel> courtDates;
  final String? createdAt;

  final String? customSuitNumber;
  final String? customCourt;
  final String? customLitigationTeam;

  CaseModel({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.clientId,
    this.lawyerId,
    this.client,
    this.lawyer,
    this.documents = const [],
    this.messages = const [],
    this.courtDates = const [],
    this.createdAt,
    this.customSuitNumber,
    this.customCourt,
    this.customLitigationTeam,
  });

  String get suitNumber {
    if (customSuitNumber != null && customSuitNumber!.isNotEmpty) {
      return customSuitNumber!;
    }
    return '';
  }

  String get courtName {
    if (customCourt != null && customCourt!.isNotEmpty) {
      return customCourt!;
    }
    if (courtDates.isNotEmpty && courtDates.first.location.isNotEmpty) {
      return courtDates.first.location;
    }
    return '';
  }

  String get litigationTeam {
    if (customLitigationTeam != null && customLitigationTeam!.isNotEmpty) {
      return customLitigationTeam!;
    }
    if (lawyer != null && lawyer!.name.isNotEmpty) {
      return lawyer!.name;
    }
    return '';
  }

  factory CaseModel.fromJson(Map<String, dynamic> json) {
    return CaseModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'OPEN',
      clientId: json['clientId'] ?? '',
      lawyerId: json['lawyerId'],
      client: json['client'] != null ? UserModel.fromJson(json['client']) : null,
      lawyer: json['lawyer'] != null ? UserModel.fromJson(json['lawyer']) : null,
      documents: (json['documents'] as List<dynamic>?)
              ?.map((e) => DocumentModel.fromJson(e))
              .toList() ??
          [],
      messages: (json['messages'] as List<dynamic>?)
              ?.map((e) => MessageModel.fromJson(e))
              .toList() ??
          [],
      courtDates: (json['courtDates'] as List<dynamic>?)
              ?.map((e) => CourtDateModel.fromJson(e))
              .toList() ??
          [],
      createdAt: json['createdAt'],
      customSuitNumber: json['suitNumber'] ?? json['suitNo'],
      customCourt: json['court'] ?? json['courtName'],
      customLitigationTeam: json['litigationTeam'] ?? json['team'],
    );
  }
}
