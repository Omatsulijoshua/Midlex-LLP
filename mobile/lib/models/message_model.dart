import 'user_model.dart';

class MessageModel {
  final String id;
  final String? content;
  final String? fileUrl;
  final String caseId;
  final String senderId;
  final UserModel? sender;
  final String? createdAt;

  MessageModel({
    required this.id,
    this.content,
    this.fileUrl,
    required this.caseId,
    required this.senderId,
    this.sender,
    this.createdAt,
  });

  factory MessageModel.fromJson(Map<String, dynamic> json) {
    return MessageModel(
      id: json['id'] ?? '',
      content: json['content'],
      fileUrl: json['fileUrl'],
      caseId: json['caseId'] ?? '',
      senderId: json['senderId'] ?? '',
      sender: json['sender'] != null ? UserModel.fromJson(json['sender']) : null,
      createdAt: json['createdAt'],
    );
  }
}
