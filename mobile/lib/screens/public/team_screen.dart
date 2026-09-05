import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../widgets/custom_app_bar.dart';
import '../../widgets/custom_drawer.dart';

class TeamScreen extends StatelessWidget {
  const TeamScreen({super.key});

  final List<Map<String, String>> team = const [
    {
      'name': 'Barr. Adebayo O.',
      'role': 'Senior Partner / Managing Partner',
      'spec': 'Corporate Law & Commercial Litigation',
      'image': 'assets/images/head-of-chambers.png',
    },
    {
      'name': 'Samuel Okanni',
      'role': 'Partner',
      'spec': 'Real Estate & Property Law Specialist',
      'image': 'assets/images/samuel-okanni.png',
    },
    {
      'name': 'Monday Isidahome',
      'role': 'Senior Associate',
      'spec': 'Litigation & Dispute Resolution',
      'image': 'assets/images/monday-isidahome.png',
    },
    {
      'name': 'E.C. Hannah',
      'role': 'Associate Counsel',
      'spec': 'Intellectual Property & Corporate Secretarial',
      'image': 'assets/images/ec-hannah.png',
    },
    {
      'name': 'E.C. Abednego',
      'role': 'Associate Counsel',
      'spec': 'Taxation & Regulatory Advisory',
      'image': 'assets/images/ec-abednego.png',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(title: 'Our Team'),
      drawer: const CustomDrawer(),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: team.length,
        itemBuilder: (context, index) {
          final member = team[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      member['image']!,
                      width: 70,
                      height: 70,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        width: 70,
                        height: 70,
                        color: AppTheme.primary.withOpacity(0.1),
                        child: const Icon(Icons.person, color: AppTheme.primary, size: 36),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          member['name']!,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          member['role']!,
                          style: const TextStyle(fontSize: 13, color: AppTheme.secondary, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          member['spec']!,
                          style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                        ),
                      ],
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
