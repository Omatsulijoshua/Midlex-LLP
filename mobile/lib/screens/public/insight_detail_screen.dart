import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';

class InsightDetailScreen extends StatelessWidget {
  final String title;
  final String date;
  final String author;
  final String content;

  const InsightDetailScreen({
    super.key,
    required this.title,
    required this.date,
    required this.author,
    required this.content,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Insight Article'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 14, color: AppTheme.secondary),
                const SizedBox(width: 6),
                Text(date, style: const TextStyle(fontSize: 13, color: AppTheme.secondary, fontWeight: FontWeight.bold)),
                const SizedBox(width: 16),
                const Icon(Icons.person, size: 14, color: AppTheme.textMuted),
                const SizedBox(width: 6),
                Text(author, style: const TextStyle(fontSize: 13, color: AppTheme.textMuted)),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textDark, height: 1.3),
            ),
            const Divider(height: 30),
            Text(
              content,
              style: const TextStyle(fontSize: 16, color: AppTheme.textDark, height: 1.6),
            ),
            const SizedBox(height: 20),
            const Text(
              'Detailed legal advisory and full documentation analysis is available through Midlex LLP legal consultation services.',
              style: TextStyle(fontSize: 14, fontStyle: FontStyle.italic, color: AppTheme.textMuted),
            ),
          ],
        ),
      ),
    );
  }
}
