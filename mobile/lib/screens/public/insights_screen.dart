import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_drawer.dart';
import 'insight_detail_screen.dart';

class InsightsScreen extends StatelessWidget {
  const InsightsScreen({super.key});

  final List<Map<String, String>> articles = const [
    {
      'title': 'Navigating Real Estate Property Verification in Edo State',
      'date': 'September 2, 2026',
      'author': 'Samuel Okanni',
      'excerpt': 'Essential legal due diligence steps every buyer must take before purchasing land or property in Benin City to prevent fraud and boundary disputes.'
    },
    {
      'title': 'Corporate Governance Essentials for Nigerian Startups',
      'date': 'August 24, 2026',
      'author': 'Barr. Adebayo O.',
      'excerpt': 'Understanding the Companies and Allied Matters Act (CAMA 2020) compliance requirements for expanding enterprises.'
    },
    {
      'title': 'Resolving Commercial Contract Disputes via Arbitration',
      'date': 'August 10, 2026',
      'author': 'Monday Isidahome',
      'excerpt': 'Why alternative dispute resolution (ADR) saves costs and protects commercial relationships over prolonged court litigation.'
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Legal Insights'),
      drawer: const CustomDrawer(),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: articles.length,
        itemBuilder: (context, index) {
          final item = articles[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 14, color: AppTheme.secondary),
                      const SizedBox(width: 6),
                      Text(item['date']!, style: const TextStyle(fontSize: 12, color: AppTheme.secondary, fontWeight: FontWeight.bold)),
                      const Spacer(),
                      Text('By ${item['author']!}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    item['title']!,
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    item['excerpt']!,
                    style: const TextStyle(fontSize: 13, color: AppTheme.textMuted, height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => InsightDetailScreen(
                              title: item['title']!,
                              date: item['date']!,
                              author: item['author']!,
                              content: item['excerpt']!,
                            ),
                          ),
                        );
                      },
                      child: const Text('Read Full Article', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
