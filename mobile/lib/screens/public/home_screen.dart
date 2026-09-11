import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_drawer.dart';
import 'practice_areas_screen.dart';
import 'contact_screen.dart';
import 'book_consultation_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Midlex LLP'),
      drawer: const CustomDrawer(),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hero Section
            Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                color: AppTheme.primary,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.secondary.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppTheme.secondary),
                    ),
                    child: const Text(
                      'PREMIER NIGERIAN LAW FIRM',
                      style: TextStyle(
                        color: AppTheme.secondary,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Sophisticated Legal Advisory & Strategic Representation',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Midlex LLP is a premier law firm in Benin City, Edo State, providing unmatched corporate advisory, property law expertise, and litigation representation.',
                    style: TextStyle(
                      color: Color(0xFFD1D5DB),
                      fontSize: 14,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const BookConsultationScreen()),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.secondary,
                            foregroundColor: AppTheme.textDark,
                          ),
                          child: const Text('Book Consultation'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const PracticeAreasScreen()),
                            );
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Colors.white),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                          child: const Text('Practice Areas'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Practice Highlights
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'PRACTICE AREAS',
                    style: TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Comprehensive Legal Services',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 16),
                  _buildPracticeCard(
                    context,
                    title: 'Real Estate & Property Law',
                    icon: Icons.domain,
                    description: 'Title verification, property acquisitions, documentation, and dispute resolution.',
                  ),
                  _buildPracticeCard(
                    context,
                    title: 'Corporate & Commercial Advisory',
                    icon: Icons.business_center,
                    description: 'Company secretarial, regulatory compliance, contract drafting, and M&A.',
                  ),
                  _buildPracticeCard(
                    context,
                    title: 'Litigation & Advocacy',
                    icon: Icons.gavel,
                    description: 'Trial court representation, appellate practice, and complex commercial disputes.',
                  ),
                  TextButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const PracticeAreasScreen()),
                      );
                    },
                    icon: const Icon(Icons.arrow_forward, color: AppTheme.secondary),
                    label: const Text('View All Practice Areas', style: TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

            // Contact CTA Banner
            Container(
              margin: const EdgeInsets.all(20),
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.accentLight,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                children: [
                  const Icon(Icons.support_agent, size: 48, color: AppTheme.primary),
                  const SizedBox(height: 12),
                  const Text(
                    'Need Counsel for Your Legal Matters?',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Connect with our seasoned legal partners today for customized legal guidance.',
                    style: TextStyle(fontSize: 14, color: AppTheme.textMuted),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const ContactScreen()),
                      );
                    },
                    child: const Text('Get in Touch'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPracticeCard(BuildContext context, {required String title, required IconData icon, required String description}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppTheme.primary, size: 28),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    description,
                    style: const TextStyle(fontSize: 13, color: AppTheme.textMuted, height: 1.4),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
