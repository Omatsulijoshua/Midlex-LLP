import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_drawer.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'About Us'),
      drawer: const CustomDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'ABOUT MIDLEX LLP',
              style: TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 6),
            const Text(
              'Excellence in Legal Practice & Client Advisory',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.textDark),
            ),
            const SizedBox(height: 16),
            const Text(
              'Midlex LLP is a full-service law firm registered under the Laws of the Federal Republic of Nigeria. Headquartered in Benin City, Edo State, our practice spans corporate commercial law, real estate transactions, litigation, dispute resolution, energy law, and tax advisory.',
              style: TextStyle(fontSize: 15, color: AppTheme.textMuted, height: 1.6),
            ),
            const SizedBox(height: 24),
            _buildSection(
              title: 'Our Mission',
              icon: Icons.flag,
              content: 'To deliver sophisticated, result-oriented legal services with uncompromising integrity, ensuring that our clients achieve their business and personal objectives.',
            ),
            const SizedBox(height: 16),
            _buildSection(
              title: 'Our Vision',
              icon: Icons.visibility,
              content: 'To be recognized as Nigeria’s most trusted and forward-thinking law firm, providing world-class legal solutions anchored on ethics and innovation.',
            ),
            const SizedBox(height: 24),
            const Text(
              'Core Values',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textDark),
            ),
            const SizedBox(height: 12),
            _buildValueTile('Integrity & Confidentiality', 'We maintain the highest standards of professional ethics.'),
            _buildValueTile('Client-Centric Excellence', 'Every strategy is tailored specifically to individual client needs.'),
            _buildValueTile('Rigorous Advocacy', 'Meticulous legal research and proactive trial representation.'),
          ],
        ),
      ),
    );
  }

  Widget _buildSection({required String title, required IconData icon, required String content}) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: AppTheme.secondary),
                const SizedBox(width: 10),
                Text(
                  title,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              content,
              style: const TextStyle(fontSize: 14, color: AppTheme.textMuted, height: 1.5),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildValueTile(String title, String subtitle) {
    return ListTile(
      leading: const Icon(Icons.check_circle, color: AppTheme.primary),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textDark)),
      subtitle: Text(subtitle, style: const TextStyle(color: AppTheme.textMuted)),
      contentPadding: EdgeInsets.zero,
    );
  }
}
