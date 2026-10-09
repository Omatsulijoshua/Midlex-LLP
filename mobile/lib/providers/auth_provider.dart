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
        final parsedUser = UserModel.fromJson(jsonDecode(savedUserData));
        if (parsedUser.role == 'ADMIN' || parsedUser.role == 'LAWYER') {
          // Clear staff accounts on client mobile app
          await StorageService.clearAuth();
          _token = null;
          _user = null;
        } else {
          _token = savedToken;
          _user = parsedUser;
        }
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
    final cleanEmail = email.trim().toLowerCase();

    // Reject staff email addresses upfront
    if (cleanEmail == 'admin@midlex.com' || cleanEmail == 'admin' || cleanEmail == 'lawyer@midlex.com' || cleanEmail == 'counsel@midlex.com') {
      _isLoading = false;
      notifyListeners();
      throw Exception('This mobile app is exclusively for Clients. Admins and Lawyers must sign in using the Midlex Web Portal.');
    }

    try {
      try {
        final response = await ApiService.post(ApiConfig.login, {
          'email': cleanEmail,
          'password': password,
        });

        final loggedUser = UserModel.fromJson(response['user']);
        if (loggedUser.role == 'ADMIN' || loggedUser.role == 'LAWYER') {
          throw Exception('This mobile app is exclusively for Clients. Admins and Lawyers must sign in using the Midlex Web Portal.');
        }

        _token = response['access_token'];
        _user = loggedUser;

        await StorageService.saveToken(_token!);
        await StorageService.saveUserData(jsonEncode(_user!.toJson()));
        await StorageService.saveRegisteredUser(cleanEmail, password, _user!.toJson());
        return;
      } catch (backendError) {
        if (backendError.toString().contains('exclusively for Clients')) {
          rethrow;
        }

        // Try local registered user fallback matching
        final localReg = await StorageService.getRegisteredUser(cleanEmail);
        if (localReg != null && localReg['password'] == password) {
          final localUser = UserModel.fromJson(Map<String, dynamic>.from(localReg['user']));
          if (localUser.role == 'ADMIN' || localUser.role == 'LAWYER') {
            throw Exception('This mobile app is exclusively for Clients. Admins and Lawyers must sign in using the Midlex Web Portal.');
          }

          _token = 'demo-token-${DateTime.now().millisecondsSinceEpoch}';
          _user = localUser;
          await StorageService.saveToken(_token!);
          await StorageService.saveUserData(jsonEncode(_user!.toJson()));
          return;
        }

        // Client demo user fallback matching
        if (cleanEmail == 'client@midlex.com' || cleanEmail == 'user@midlex.com') {
          _token = 'demo-client-token';
          _user = UserModel(
            id: 'client-1',
            email: 'client@midlex.com',
            name: 'Valued Midlex Client',
            role: 'CLIENT',
          );
          await StorageService.saveToken(_token!);
          await StorageService.saveUserData(jsonEncode(_user!.toJson()));
          return;
        }

        rethrow;
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    String? dateOfBirth,
    String? phone,
    String? secondaryPhone,
    String? city,
    String? address,
    String? caseTitle,
    String? caseDescription,
  }) async {
    _isLoading = true;
    notifyListeners();
    final cleanEmail = email.trim().toLowerCase();

    try {
      try {
        final responseData = await ApiService.post(ApiConfig.register, {
          'name': name,
          'email': cleanEmail,
          'password': password,
          'dateOfBirth': dateOfBirth,
          'phone': phone,
          'secondaryPhone': secondaryPhone,
          'city': city,
          'address': address,
          'caseTitle': caseTitle,
          'caseDescription': caseDescription,
        });

        _token = responseData['access_token'];
        _user = UserModel.fromJson(responseData['user']);
      } catch (e) {
        // Direct local signup fallback if backend fails or network down
        _token = 'registered-token-${DateTime.now().millisecondsSinceEpoch}';
        _user = UserModel(
          id: 'user-${DateTime.now().millisecondsSinceEpoch}',
          email: cleanEmail,
          name: name,
          role: 'CLIENT',
          phone: phone,
          secondaryPhone: secondaryPhone,
        );
      }

      await StorageService.saveToken(_token!);
      await StorageService.saveUserData(jsonEncode(_user!.toJson()));
      await StorageService.saveRegisteredUser(cleanEmail, password, _user!.toJson());
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
