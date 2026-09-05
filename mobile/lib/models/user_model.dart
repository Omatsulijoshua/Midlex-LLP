class UserModel {
  final String id;
  final String email;
  final String name;
  final String role; // ADMIN, LAWYER, CLIENT
  final String? phone;
  final String? profileImage;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.phone,
    this.profileImage,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'CLIENT',
      phone: json['phone'],
      profileImage: json['profileImage'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
      'phone': phone,
      'profileImage': profileImage,
    };
  }

  bool get isAdmin => role == 'ADMIN';
  bool get isLawyer => role == 'LAWYER';
  bool get isClient => role == 'CLIENT';
}
