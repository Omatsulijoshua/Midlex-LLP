import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import 'book_consultation_screen.dart';

class PracticeDetailScreen extends StatelessWidget {
  final String title;
  final String description;

  const PracticeDetailScreen({
    super.key,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(title: title),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.primary,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.account_balance, color: AppTheme.secondary, size: 40),
                  const SizedBox(height: 12),
                  Text(
                    title,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Overview & Practice Capabilities',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
            ),
            const SizedBox(height: 12),
            Text(
              description,
              style: const TextStyle(fontSize: 15, color: AppTheme.textMuted, height: 1.6),
            ),
            const SizedBox(height: 24),
            const Text(
              'What We Offer:',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
            ),
            const SizedBox(height: 12),
            _buildFeatureTile('Strategic Legal Counsel & Risk Assessment'),
            _buildFeatureTile('Document Drafting & Regulatory Filings'),
            _buildFeatureTile('Representation in Negotiations & Court Proceedings'),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const BookConsultationScreen()),
                  );
                },
                child: const Text('Consult Our Experts on this Practice'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeatureTile(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          const Icon(Icons.check_circle_outline, color: AppTheme.secondary, size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontSize: 14, color: AppTheme.textDark),
            ),
          ),
        ],
      ),
    );
  }
}
