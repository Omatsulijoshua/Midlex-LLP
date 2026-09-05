class CourtDateModel {
  final String id;
  final String date;
  final String location;
  final String? description;
  final String caseId;

  CourtDateModel({
    required this.id,
    required this.date,
    required this.location,
    this.description,
    required this.caseId,
  });

  factory CourtDateModel.fromJson(Map<String, dynamic> json) {
    return CourtDateModel(
      id: json['id'] ?? '',
      date: json['date'] ?? '',
      location: json['location'] ?? '',
      description: json['description'],
      caseId: json['caseId'] ?? '',
    );
  }
}
