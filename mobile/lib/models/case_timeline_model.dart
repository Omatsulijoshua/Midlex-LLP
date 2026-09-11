class CaseTimelineModel {
  final String id;
  final String title;
  final String? description;
  final String? status;
  final String date;
  final String? createdByName;

  CaseTimelineModel({
    required this.id,
    required this.title,
    this.description,
    this.status,
    required this.date,
    this.createdByName,
  });

  factory CaseTimelineModel.fromJson(Map<String, dynamic> json) {
    return CaseTimelineModel(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      status: json['status'],
      date: json['date'] ?? DateTime.now().toIso8601String(),
      createdByName: json['createdByName'],
    );
  }
}
