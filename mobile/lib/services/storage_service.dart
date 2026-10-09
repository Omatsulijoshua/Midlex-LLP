import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String tokenKey = 'midlex_token';
  static const String userKey = 'midlex_user';

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(tokenKey);
  }

  static Future<void> saveUserData(String jsonString) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(userKey, jsonString);
  }

  static Future<String?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(userKey);
  }

  static const String onboardingKey = 'midlex_onboarding_seen';

  static Future<void> setHasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(onboardingKey, true);
  }

  static Future<bool> hasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(onboardingKey) ?? false;
  }

  static Future<void> saveRegisteredUser(
      String email, String password, Map<String, dynamic> userData) async {
    final prefs = await SharedPreferences.getInstance();
    final cleanEmail = email.trim().toLowerCase();
    await prefs.setString(
        'midlex_reg_$cleanEmail',
        jsonEncode({
          'password': password,
          'user': userData,
        }));
  }

  static Future<Map<String, dynamic>?> getRegisteredUser(String email) async {
    final prefs = await SharedPreferences.getInstance();
    final cleanEmail = email.trim().toLowerCase();
    final dataStr = prefs.getString('midlex_reg_$cleanEmail');
    if (dataStr != null) {
      return jsonDecode(dataStr) as Map<String, dynamic>;
    }
    return null;
  }

  static const String departmentKey = 'midlex_dept';
  static const String retainerPlanKey = 'midlex_retainer_plan';

  static Future<void> saveRetainerPlan(String plan) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(retainerPlanKey, plan);
  }

  static Future<String?> getRetainerPlan() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(retainerPlanKey);
  }

  static Future<void> saveDepartment(String dept) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(departmentKey, dept);
  }

  static Future<String> getDepartment() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(departmentKey) ?? 'LITIGATION';
  }

  static Future<void> clearAuth() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(tokenKey);
    await prefs.remove(userKey);
    await prefs.remove(departmentKey);
    await prefs.remove(retainerPlanKey);
  }
}
