import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/dashboard_provider.dart';
import '../../widgets/status_chip.dart';

class PaymentsScreen extends StatelessWidget {
  const PaymentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final dashboard = Provider.of<DashboardProvider>(context);

    return Scaffold(
      body: dashboard.isLoading
          ? const Center(child: CircularProgressIndicator())
          : dashboard.payments.isEmpty
              ? const Center(child: Text('No payment records found.'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: dashboard.payments.length,
                  itemBuilder: (context, index) {
                    final p = dashboard.payments[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        leading: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.secondary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.account_balance_wallet, color: AppTheme.secondary),
                        ),
                        title: Text(
                          '${p.currency} ${p.amount.toStringAsFixed(2)}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.textDark),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text('Ref: ${p.txRef}', style: const TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                            if (p.description != null)
                              Text(p.description!, style: const TextStyle(fontSize: 13, color: AppTheme.textDark)),
                            const SizedBox(height: 8),
                            StatusChip(status: p.status),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
