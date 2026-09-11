class UserModel {
  final String id;
  final String email;
  final String name;
  final String role; // ADMIN, LAWYER, CLIENT
  final String? phone;
  final String? secondaryPhone;
  final String? profileImage;
  final String? litigationTeam;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.phone,
    this.secondaryPhone,
    this.profileImage,
    this.litigationTeam,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'CLIENT',
      phone: json['phone'],
      secondaryPhone: json['secondaryPhone'] ?? json['phone2'],
      profileImage: json['profileImage'],
      litigationTeam: json['litigationTeam'] ?? json['team'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
      'phone': phone,
      'secondaryPhone': secondaryPhone,
      'profileImage': profileImage,
      'litigationTeam': litigationTeam,
    };
  }

  bool get isAdmin => role == 'ADMIN';
  bool get isLawyer => role == 'LAWYER';
  bool get isClient => role == 'CLIENT';
  bool get isAccountant => role == 'ACCOUNTANT';
}
