import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class DirectoryService {
  static const String _teamsKey = 'midlex_litigation_teams';
  static const String _courtsKey = 'midlex_courts_directory';
  static const String _assignmentsKey = 'midlex_case_assignments';

  static const List<String> defaultTeams = [
    'TEAM ANCHOR',
    'TEAM SAPPHIRE',
    'TEAM GEMSTONE',
  ];

  static const List<String> defaultCourts = [
    'HIGH COURT BENIN CITY',
    'HIGH COURT OKADA',
    'HIGH COURT EKIADOLOR',
    'EKIADOLOR MAGISTRATE COURT',
    'FEDERAL HIGH COURT',
    'HIGH COURT',
    'MAGISTRATE COURT OGBESON',
    'MAGISTRATE COURT OREDO',
    'MAGISTRATE COURT EGOR',
    'HIGH COURT WARRI',
    'HIGH COURT ABUDU',
    'FEDERAL HIGH COURT BENIN',
    'HIGH COURT BENIN',
    'APPEAL COURT BENIN CITY',
    'NATIONAL INDUSTRIAL COURT BENIN CITY',
    'AREA CUSTOMARY COURT EHOR',
    'CUSTOMARY COURT URHONIGBE',
    'HIGH COURT EHOR',
  ];

  // Teams Management
  static Future<List<String>> getTeams() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_teamsKey);
    if (list == null || list.isEmpty) {
      await prefs.setStringList(_teamsKey, defaultTeams);
      return List.from(defaultTeams);
    }
    return list;
  }

  static Future<void> addTeam(String teamName) async {
    final clean = teamName.trim().toUpperCase();
    if (clean.isEmpty) return;
    final teams = await getTeams();
    if (!teams.contains(clean)) {
      teams.add(clean);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_teamsKey, teams);
    }
  }

  static Future<void> removeTeam(String teamName) async {
    final teams = await getTeams();
    teams.removeWhere((t) => t.toUpperCase() == teamName.trim().toUpperCase());
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_teamsKey, teams);
  }

  // Courts Management
  static Future<List<String>> getCourts() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_courtsKey);
    if (list == null || list.isEmpty) {
      await prefs.setStringList(_courtsKey, defaultCourts);
      return List.from(defaultCourts);
    }
    // Merge new default courts if not present
    bool updated = false;
    for (final dc in defaultCourts) {
      if (!list.contains(dc)) {
        list.add(dc);
        updated = true;
      }
    }
    if (updated) {
      await prefs.setStringList(_courtsKey, list);
    }
    return list;
  }

  static Future<void> addCourt(String courtName) async {
    final clean = courtName.trim().toUpperCase();
    if (clean.isEmpty) return;
    final courts = await getCourts();
    if (!courts.contains(clean)) {
      courts.add(clean);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_courtsKey, courts);
    }
  }

  static Future<void> removeCourt(String courtName) async {
    final courts = await getCourts();
    courts.removeWhere((c) => c.toUpperCase() == courtName.trim().toUpperCase());
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_courtsKey, courts);
  }

  // Case Directory Custom Attributes (Suit No, Court, Litigation Team)
  static Future<Map<String, dynamic>> getCaseAssignment(String caseId) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('${_assignmentsKey}_$caseId');
    if (raw != null) {
      try {
        return jsonDecode(raw) as Map<String, dynamic>;
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  static Future<void> saveCaseAssignment(
    String caseId, {
    String? suitNumber,
    String? court,
    String? litigationTeam,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final existing = await getCaseAssignment(caseId);
    if (suitNumber != null) existing['suitNumber'] = suitNumber;
    if (court != null) existing['court'] = court;
    if (litigationTeam != null) existing['litigationTeam'] = litigationTeam;
    await prefs.setString('${_assignmentsKey}_$caseId', jsonEncode(existing));
  }
}
