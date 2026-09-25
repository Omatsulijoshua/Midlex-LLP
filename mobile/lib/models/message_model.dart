import 'user_model.dart';

class MessageModel {
  final String id;
  final String? content;
  final String? fileUrl;
  final String? caseId;
  final String? teamName;
  final String senderId;
  final UserModel? sender;
  final String? createdAt;

  MessageModel({
    required this.id,
    this.content,
    this.fileUrl,
    this.caseId,
    this.teamName,
    required this.senderId,
    this.sender,
    this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['id'] ?? '',
      content: json['content'],
      fileUrl: json['fileUrl'],
      caseId: json['caseId'],
      teamName: json['teamName'],
      senderId: json['senderId'] ?? '',
      sender: json['sender'] != null ? UserModel.fromJson(json['sender']) : null,
      createdAt: json['createdAt'],
    );
  }

  String get senderName => sender?.name ?? 'Legal Counsel';

  String get formattedTime {
    if (createdAt == null) return '';
    try {
      final dt = DateTime.parse(createdAt!).toLocal();
      return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return '';
    }
  }
}
