import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import '../config/api_config.dart';

class DirectoryService {
  static const String _teamsKey = 'midlex_litigation_teams';
  static const String _courtsKey = 'midlex_courts_directory';
  static const String _assignmentsKey = 'midlex_case_assignments';

  static const List<String> defaultTeams = [
    'TEAM ANCHOR',
    'TEAM ALPHA',
    'TITAN LITIGATION',
    'MARITIME PRACTICE GROUP',
    'CORPORATE DISPUTE TEAM',
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

  // Teams Management (Synced with Backend DB)
  static Future<List<String>> getTeams() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final res = await ApiService.get(ApiConfig.directoryTeams);
      if (res is List && res.isNotEmpty) {
        final teams = res.map((e) => e.toString().trim().toUpperCase()).toSet().toList();
        await prefs.setStringList(_teamsKey, teams);
        return teams;
      }
    } catch (_) {}

    final list = prefs.getStringList(_teamsKey);
    if (list == null || list.isEmpty) {
      await prefs.setStringList(_teamsKey, defaultTeams);
      return List.from(defaultTeams);
    }
    return list;
  }

  static Future<List<String>> addTeam(String teamName) async {
    final clean = teamName.trim().toUpperCase();
    if (clean.isEmpty) return await getTeams();
    final prefs = await SharedPreferences.getInstance();

    try {
      final res = await ApiService.post(ApiConfig.directoryTeams, {'name': clean});
      if (res is List && res.isNotEmpty) {
        final teams = res.map((e) => e.toString().trim().toUpperCase()).toSet().toList();
        await prefs.setStringList(_teamsKey, teams);
        return teams;
      }
    } catch (_) {}

    final teams = await getTeams();
    if (!teams.contains(clean)) {
      teams.add(clean);
      await prefs.setStringList(_teamsKey, teams);
    }
    return teams;
  }

  static Future<List<String>> removeTeam(String teamName) async {
    final clean = teamName.trim().toUpperCase();
    final prefs = await SharedPreferences.getInstance();

    try {
      final res = await ApiService.delete('${ApiConfig.directoryTeams}/${Uri.encodeComponent(clean)}');
      if (res is List && res.isNotEmpty) {
        final teams = res.map((e) => e.toString().trim().toUpperCase()).toSet().toList();
        await prefs.setStringList(_teamsKey, teams);
        return teams;
      }
    } catch (_) {}

    final teams = await getTeams();
    teams.removeWhere((t) => t.toUpperCase() == clean);
    await prefs.setStringList(_teamsKey, teams);
    return teams;
  }

  // Courts Management (Synced with Backend DB)
  static Future<List<String>> getCourts() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      final res = await ApiService.get(ApiConfig.directoryCourts);
      if (res is List && res.isNotEmpty) {
        final courts = res.map((e) => e.toString().trim().toUpperCase()).toSet().toList();
        await prefs.setStringList(_courtsKey, courts);
        return courts;
      }
    } catch (_) {}

    final list = prefs.getStringList(_courtsKey);
    if (list == null || list.isEmpty) {
      await prefs.setStringList(_courtsKey, defaultCourts);
      return List.from(defaultCourts);
    }
    return list;
  }

  static Future<List<String>> addCourt(String courtName) async {
    final clean = courtName.trim().toUpperCase();
    if (clean.isEmpty) return await getCourts();
    final prefs = await SharedPreferences.getInstance();

    try {
      final res = await ApiService.post(ApiConfig.directoryCourts, {'name': clean});
      if (res is List && res.isNotEmpty) {
        final courts = res.map((e) => e.toString().trim().toUpperCase()).toSet().toList();
        await prefs.setStringList(_courtsKey, courts);
        return courts;
      }
    } catch (_) {}

    final courts = await getCourts();
    if (!courts.contains(clean)) {
      courts.add(clean);
      await prefs.setStringList(_courtsKey, courts);
    }
    return courts;
  }

  static Future<List<String>> removeCourt(String courtName) async {
    final clean = courtName.trim().toUpperCase();
    final prefs = await SharedPreferences.getInstance();

    try {
      final res = await ApiService.delete('${ApiConfig.directoryCourts}/${Uri.encodeComponent(clean)}');
      if (res is List && res.isNotEmpty) {
        final courts = res.map((e) => e.toString().trim().toUpperCase()).toSet().toList();
        await prefs.setStringList(_courtsKey, courts);
        return courts;
      }
    } catch (_) {}

    final courts = await getCourts();
    courts.removeWhere((c) => c.toUpperCase() == clean);
    await prefs.setStringList(_courtsKey, courts);
    return courts;
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

  static Future<void> exportPdf(List<Map<String, dynamic>> items, {required String title}) async {
    // Export Directory items as PDF document
  }

  static Future<void> exportDocx(List<Map<String, dynamic>> items, {required String title}) async {
    // Export Directory items as Word DOCX document
  }
}
