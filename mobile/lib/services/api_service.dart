import 'dart:convert';
import 'package:http/http.dart' as http;
import 'storage_service.dart';

class ApiService {
  static Future<Map<String, String>> _headers() async {
    final token = await StorageService.getToken();
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<dynamic> get(String url) async {
    final headers = await _headers();
    final response = await http.get(Uri.parse(url), headers: headers);
    return _processResponse(response);
  }

  static Future<dynamic> post(String url, Map<String, dynamic> body) async {
    final headers = await _headers();
    final response = await http.post(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );
    return _processResponse(response);
  }

  static Future<dynamic> patch(String url, Map<String, dynamic> body) async {
    final headers = await _headers();
    final response = await http.patch(
      Uri.parse(url),
      headers: headers,
      body: jsonEncode(body),
    );
    return _processResponse(response);
  }

  static Future<dynamic> delete(String url) async {
    final headers = await _headers();
    final response = await http.delete(Uri.parse(url), headers: headers);
    return _processResponse(response);
  }

  static dynamic _processResponse(http.Response response) {
    final body = response.body.isNotEmpty ? jsonDecode(response.body) : null;
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else {
      String message = 'API Request Failed';
      if (body != null && body is Map) {
        message = body['message'] ?? body['error'] ?? message;
      }
      throw Exception(message);
    }
  }
}
