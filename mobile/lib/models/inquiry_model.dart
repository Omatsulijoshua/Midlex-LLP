class InquiryModel {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? serviceNeeded;
  final String message;
  final String status;
  final String? createdAt;

  InquiryModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.serviceNeeded,
    required this.message,
    required this.status,
    this.createdAt,
  });

  factory InquiryModel.fromJson(Map<String, dynamic> json) {
    return InquiryModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      serviceNeeded: json['serviceNeeded'],
      message: json['message'] ?? '',
      status: json['status'] ?? 'NEW',
      createdAt: json['createdAt'],
    );
  }
}
