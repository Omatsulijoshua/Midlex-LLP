import 'user_model.dart';

class DocumentModel {
  final String id;
  final String name;
  final String url;
  final String type;
  final String caseId;
  final String uploadedById;
  final UserModel? uploadedBy;
  final String? createdAt;

  DocumentModel({
    required this.id,
    required this.name,
    required this.url,
    required this.type,
    required this.caseId,
    required this.uploadedById,
    this.uploadedBy,
    this.createdAt,
  });

  factory DocumentModel.fromJson(Map<String, dynamic> json) {
    return DocumentModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      url: json['url'] ?? '',
      type: json['type'] ?? 'DOC',
      caseId: json['caseId'] ?? '',
      uploadedById: json['uploadedById'] ?? '',
      uploadedBy: json['uploadedBy'] != null ? UserModel.fromJson(json['uploadedBy']) : null,
      createdAt: json['createdAt'],
    );
  }
}
