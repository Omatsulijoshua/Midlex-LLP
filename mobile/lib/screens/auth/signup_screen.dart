import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../dashboard/dashboard_screen.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _secondaryPhoneController = TextEditingController();
  final _cityController = TextEditingController();
  final _addressController = TextEditingController();
  final _passwordController = TextEditingController();
  final _caseTitleController = TextEditingController();
  final _caseDescriptionController = TextEditingController();

  bool _obscurePassword = true;
  String? _errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _secondaryPhoneController.dispose();
    _cityController.dispose();
    _addressController.dispose();
    _passwordController.dispose();
    _caseTitleController.dispose();
    _caseDescriptionController.dispose();
    super.dispose();
  }

  Future<void> _handleSignup() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final phone = _phoneController.text.trim();
    final secondaryPhone = _secondaryPhoneController.text.trim();
    final city = _cityController.text.trim();
    final address = _addressController.text.trim();
    final caseTitle = _caseTitleController.text.trim();
    final caseDescription = _caseDescriptionController.text.trim();

    if (name.isEmpty || email.isEmpty || password.isEmpty || phone.isEmpty || city.isEmpty || address.isEmpty || caseTitle.isEmpty || caseDescription.isEmpty) {
      setState(() => _errorMessage = 'Please fill in all required fields including primary phone number, location, and case details.');
      return;
    }

    setState(() => _errorMessage = null);
    final auth = Provider.of<AuthProvider>(context, listen: false);

    try {
      await auth.register(
        name: name,
        email: email,
        password: password,
        phone: phone,
        secondaryPhone: secondaryPhone,
        city: city,
        address: address,
        caseTitle: caseTitle,
        caseDescription: caseDescription,
      );

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const DashboardScreen()),
        );
      }
    } catch (e) {
      setState(() => _errorMessage = e.toString().replaceAll('Exception: ', ''));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Client Registration')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Register Client Account & File Case',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.primary),
            ),
            const SizedBox(height: 6),
            const Text(
              'Enter your full contact details and initial legal matter description to get started with Midlex LLP.',
              style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
            ),
            const SizedBox(height: 20),

            if (_errorMessage != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Text(_errorMessage!, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
              ),

            // Section 1: Personal Details
            const Text(
              '1. Personal & Contact Information',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.secondary),
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Full Name *',
                hintText: 'e.g. Chief Anthony Osagie',
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
            const SizedBox(height: 14),

            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email Address *',
                hintText: 'anthony@example.com',
                prefixIcon: Icon(Icons.email_outlined),
              ),
            ),
            const SizedBox(height: 14),

            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Primary Phone Number *',
                hintText: '+234 803 000 0000',
                prefixIcon: Icon(Icons.phone_outlined),
              ),
            ),
            const SizedBox(height: 14),

            TextField(
              controller: _secondaryPhoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Secondary Phone Number (Optional)',
                hintText: '+234 805 111 2222 (Optional)',
                prefixIcon: Icon(Icons.phone_android_outlined, color: AppTheme.secondary),
              ),
            ),
            const SizedBox(height: 14),

            TextField(
              controller: _cityController,
              decoration: const InputDecoration(
                labelText: 'Location (City) *',
                hintText: 'e.g. Benin City',
                prefixIcon: Icon(Icons.location_city_outlined),
              ),
            ),
            const SizedBox(height: 14),

            TextField(
              controller: _addressController,
              decoration: const InputDecoration(
                labelText: 'Physical Address *',
                hintText: 'e.g. No. 12 Airport Road, GRA, Benin City',
                prefixIcon: Icon(Icons.home_outlined),
              ),
            ),
            const SizedBox(height: 14),

            TextField(
              controller: _passwordController,
              obscureText: _obscurePassword,
              decoration: InputDecoration(
                labelText: 'Password *',
                prefixIcon: const Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Section 2: Initial Case Registration
            const Text(
              '2. Initial Case Matter Registration',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.secondary),
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _caseTitleController,
              decoration: const InputDecoration(
                labelText: 'Case Title *',
                hintText: 'e.g. Land Title Dispute at Okada Property',
                prefixIcon: Icon(Icons.gavel_outlined, color: AppTheme.secondary),
              ),
            ),
            const SizedBox(height: 14),

            TextField(
              controller: _caseDescriptionController,
              maxLines: 4,
              decoration: const InputDecoration(
                labelText: 'Explain Case Matter Details *',
                hintText: 'Please describe your legal issue, key facts, parties involved, and expected resolution...',
                alignLabelWithHint: true,
                prefixIcon: Padding(
                  padding: EdgeInsets.only(bottom: 50),
                  child: Icon(Icons.description_outlined, color: AppTheme.secondary),
                ),
              ),
            ),
            const SizedBox(height: 28),

            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: auth.isLoading ? null : _handleSignup,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: auth.isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'Register Account & File Case',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                      ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
