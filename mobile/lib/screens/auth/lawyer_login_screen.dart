import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../dashboard/dashboard_screen.dart';
import 'login_screen.dart';

class LawyerLoginScreen extends StatefulWidget {
  const LawyerLoginScreen({super.key});

  @override
  State<LawyerLoginScreen> createState() => _LawyerLoginScreenState();
}

class _LawyerLoginScreenState extends State<LawyerLoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  String? _errorMessage;

  void _quickFill(String email, String pass) {
    setState(() {
      _emailController.text = email;
      _passwordController.text = pass;
      _errorMessage = null;
    });
  }

  Future<void> _handleStaffLogin() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Please enter staff email and password.');
      return;
    }

    setState(() => _errorMessage = null);
    final auth = Provider.of<AuthProvider>(context, listen: false);

    try {
      await auth.login(email, password);
      if (mounted) {
        final user = auth.user;
        if (user != null && (user.isAdmin || user.isLawyer || user.isAccountant)) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const DashboardScreen()),
          );
        } else {
          // Logged in user is a client
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const DashboardScreen()),
          );
        }
      }
    } catch (e) {
      setState(() => _errorMessage = e.toString().replaceAll('Exception: ', ''));
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF0C2B18), // Deep Executive Dark Green
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Header Badge & Logo
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.secondary.withValues(alpha: 0.5),
                        blurRadius: 20,
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      'assets/images/logo.jpg',
                      height: 60,
                      width: 60,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          const Icon(Icons.gavel, size: 50, color: AppTheme.primary),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppTheme.secondary.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.secondary),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.shield_outlined, color: AppTheme.secondary, size: 16),
                      SizedBox(width: 6),
                      Text(
                        'STAFF & LEGAL COUNSEL PORTAL',
                        style: TextStyle(
                          color: AppTheme.secondary,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'Lawyer & Admin Sign In',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Authorized portal for Advocates, Senior Counsel, Administrators & Accountants',
                  style: TextStyle(fontSize: 13, color: Color(0xFFD1D5DB)),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 28),

                // Main Form Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: const [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 16,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      if (_errorMessage != null)
                        Container(
                          padding: const EdgeInsets.all(12),
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: Colors.red.shade50,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.red.shade200),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.error_outline, color: Colors.red, size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  _errorMessage!,
                                  style: const TextStyle(
                                    color: Colors.red,
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        style: const TextStyle(color: AppTheme.textDark, fontSize: 14),
                        decoration: const InputDecoration(
                          labelText: 'Staff Email / Official ID',
                          labelStyle: TextStyle(color: AppTheme.textMuted),
                          prefixIcon: Icon(Icons.badge_outlined, color: AppTheme.primary),
                        ),
                      ),
                      const SizedBox(height: 16),

                      TextField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        style: const TextStyle(color: AppTheme.textDark, fontSize: 14),
                        decoration: InputDecoration(
                          labelText: 'Password',
                          labelStyle: const TextStyle(color: AppTheme.textMuted),
                          prefixIcon: const Icon(Icons.lock_outline, color: AppTheme.primary),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword ? Icons.visibility_off : Icons.visibility,
                              color: AppTheme.textMuted,
                            ),
                            onPressed: () =>
                                setState(() => _obscurePassword = !_obscurePassword),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: auth.isLoading ? null : _handleStaffLogin,
                          icon: const Icon(Icons.gavel),
                          label: auth.isLoading
                              ? const CircularProgressIndicator(color: Colors.white)
                              : const Text('Access Staff Portal'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primary,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),

                      const SizedBox(height: 20),
                      const Divider(),
                      const SizedBox(height: 8),

                      // Quick Demo Credentials presets
                      const Text(
                        'Quick Demo Accounts:',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textMuted,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        alignment: WrapAlignment.center,
                        children: [
                          ActionChip(
                            avatar: const Icon(Icons.admin_panel_settings, size: 16, color: AppTheme.primary),
                            label: const Text('Admin', style: TextStyle(fontSize: 12)),
                            onPressed: () => _quickFill('midlexllp01@gmail.com', 'Admin@123'),
                          ),
                          ActionChip(
                            avatar: const Icon(Icons.gavel, size: 16, color: AppTheme.secondary),
                            label: const Text('Lawyer', style: TextStyle(fontSize: 12)),
                            onPressed: () => _quickFill('lawyer@midlex.com', 'lawyer123'),
                          ),
                          ActionChip(
                            avatar: const Icon(Icons.account_balance_wallet, size: 16, color: Colors.green),
                            label: const Text('Accountant', style: TextStyle(fontSize: 12)),
                            onPressed: () => _quickFill('accountant@midlex.com', 'accountant123'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Switch back to Customer Sign In
                OutlinedButton.icon(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => const LoginScreen()),
                    );
                  },
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  label: const Text(
                    'Switch to Customer / Client Login',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.secondary),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
