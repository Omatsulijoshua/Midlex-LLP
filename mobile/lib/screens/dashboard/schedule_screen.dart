import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/dashboard_provider.dart';

class ScheduleScreen extends StatelessWidget {
  const ScheduleScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dashboard = Provider.of<DashboardProvider>(context);

    return Scaffold(
      body: dashboard.isLoading
          ? const Center(child: CircularProgressIndicator())
          : dashboard.courtDates.isEmpty
              ? const Center(child: Text('No upcoming court dates scheduled.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: dashboard.courtDates.length,
                  itemBuilder: (context, index) {
                    final item = dashboard.courtDates[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        leading: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.orange.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.event, color: Colors.orange),
                        ),
                        title: Text(
                          item.location,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text('Date: ${item.date.split('T').first}', style: const TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold)),
                            if (item.description != null)
                              Padding(
                                padding: const EdgeInsets.only(top: 4),
                                child: Text(item.description!, style: const TextStyle(color: AppTheme.textMuted, fontSize: 13)),
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
