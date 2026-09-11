import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../config/api_config.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  String? _token;
  bool _isLoading = true;

  UserModel? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null && _user != null;

  AuthProvider() {
    initAuth();
  }

  Future<void> initAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      final savedToken = await StorageService.getToken();
      final savedUserData = await StorageService.getUserData();

      if (savedToken != null && savedUserData != null) {
        _token = savedToken;
        _user = UserModel.fromJson(jsonDecode(savedUserData));
      }
    } catch (e) {
      await StorageService.clearAuth();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.post(ApiConfig.login, {
        'email': email,
        'password': password,
      });

      _token = response['access_token'];
      _user = UserModel.fromJson(response['user']);

      await StorageService.saveToken(_token!);
      await StorageService.saveUserData(jsonEncode(_user!.toJson()));
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    String? phone,
    String? secondaryPhone,
    String? city,
    String? address,
    String? caseTitle,
    String? caseDescription,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await ApiService.post(ApiConfig.register, {
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
        'secondaryPhone': secondaryPhone,
        'city': city,
        'address': address,
        'caseTitle': caseTitle,
        'caseDescription': caseDescription,
      });

      _token = response['access_token'];
      _user = UserModel.fromJson(response['user']);

      await StorageService.saveToken(_token!);
      await StorageService.saveUserData(jsonEncode(_user!.toJson()));
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    await StorageService.clearAuth();
    notifyListeners();
  }
}
