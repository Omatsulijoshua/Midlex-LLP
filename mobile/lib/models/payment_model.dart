import 'user_model.dart';
import 'case_model.dart';

class PaymentModel {
  final String id;
  final double amount;
  final String currency;
  final String status; // PENDING, SUCCESS, FAILED
  final String txRef;
  final String? description;
  final String? proofUrl;
  final String clientId;
  final String caseId;
  final UserModel? client;
  final CaseModel? caseData;
  final String? createdAt;

  PaymentModel({
    required this.id,
    required this.amount,
    required this.currency,
    required this.status,
    required this.txRef,
    this.description,
    this.proofUrl,
    required this.clientId,
    required this.caseId,
    this.client,
    this.caseData,
    this.createdAt,
  });

  factory PaymentModel.fromJson(Map<String, dynamic> json) {
    return PaymentModel(
      id: json['id'] ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] ?? 'NGN',
      status: json['status'] ?? 'PENDING',
      txRef: json['txRef'] ?? '',
      description: json['description'],
      proofUrl: json['proofUrl'],
      clientId: json['clientId'] ?? '',
      caseId: json['caseId'] ?? '',
      client: json['client'] != null ? UserModel.fromJson(json['client']) : null,
      caseData: json['case'] != null ? CaseModel.fromJson(json['case']) : null,
      createdAt: json['createdAt'],
    );
  }
}
