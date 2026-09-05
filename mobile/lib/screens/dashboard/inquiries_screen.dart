import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/dashboard_provider.dart';
import '../../widgets/status_chip.dart';

class InquiriesScreen extends StatefulWidget {
  const InquiriesScreen({super.key});

  @override
  State<InquiriesScreen> createState() => _InquiriesScreenState();
}

class _InquiriesScreenState extends State<InquiriesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<DashboardProvider>(context, listen: false).fetchInquiries();
    });
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = Provider.of<DashboardProvider>(context);

    return Scaffold(
      body: dashboard.inquiries.isEmpty
          ? const Center(child: Text('No client inquiries logged yet.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: dashboard.inquiries.length,
              itemBuilder: (context, index) {
                final inq = dashboard.inquiries[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              inq.name,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primary),
                            ),
                            StatusChip(status: inq.status),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(inq.email, style: const TextStyle(color: AppTheme.secondary, fontSize: 12, fontWeight: FontWeight.bold)),
                        if (inq.phone != null) Text(inq.phone!, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                        const Divider(height: 20),
                        Text(inq.message, style: const TextStyle(fontSize: 14, color: AppTheme.textDark)),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
