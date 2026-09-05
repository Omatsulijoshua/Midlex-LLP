import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_drawer.dart';
import 'practice_detail_screen.dart';

class PracticeAreasScreen extends StatelessWidget {
  const PracticeAreasScreen({super.key});

  final List<Map<String, String>> practices = const [
    {
      'slug': 'real-estate-property-law',
      'title': 'Real Estate & Property Law',
      'icon': 'domain',
      'desc': 'Comprehensive property legal services, title verification, acquisitions, deed registrations, and land disputes in Edo State and across Nigeria.'
    },
    {
      'slug': 'corporate-commercial',
      'title': 'Corporate & Commercial Advisory',
      'icon': 'business',
      'desc': 'Business formation, secretarial compliance, contractual drafting, joint ventures, regulatory permits, and corporate governance.'
    },
    {
      'slug': 'litigation-dispute-resolution',
      'title': 'Litigation & Dispute Resolution',
      'icon': 'gavel',
      'desc': 'Robust courtroom representation in High Courts, Court of Appeal, Supreme Court, as well as arbitration and mediation services.'
    },
    {
      'slug': 'energy-natural-resources',
      'title': 'Energy & Natural Resources',
      'icon': 'bolt',
      'desc': 'Legal advisory for oil and gas ventures, renewable energy projects, environmental compliance, and power sector contracts.'
    },
    {
      'slug': 'tax-advisory-compliance',
      'title': 'Tax Advisory & Compliance',
      'icon': 'receipt_long',
      'desc': 'Strategic corporate tax planning, resolution of tax assessments with FIRS & State IRS, and tax litigation.'
    },
    {
      'slug': 'intellectual-property',
      'title': 'Intellectual Property & Technology',
      'icon': 'copyright',
      'desc': 'Trademark registration, patent filings, copyright protection, brand licensing, and technology agreements.'
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Practice Areas'),
      drawer: const CustomDrawer(),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: practices.length,
        itemBuilder: (context, index) {
          final item = practices[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: ListTile(
              contentPadding: const EdgeInsets.all(16),
              leading: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.account_balance, color: AppTheme.primary),
              ),
              title: Text(
                item['title']!,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
              ),
              subtitle: Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  item['desc']!,
                  style: const TextStyle(fontSize: 13, color: AppTheme.textMuted, height: 1.4),
                ),
              ),
              trailing: const Icon(Icons.chevron_right, color: AppTheme.secondary),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PracticeDetailScreen(
                      title: item['title']!,
                      description: item['desc']!,
                    ),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
