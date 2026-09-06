import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../config/api_config.dart';
import '../../services/api_service.dart';

class AccountantDashboardScreen extends StatefulWidget {
  const AccountantDashboardScreen({super.key});

  @override
  State<AccountantDashboardScreen> createState() => _AccountantDashboardScreenState();
}

class _AccountantDashboardScreenState extends State<AccountantDashboardScreen> {
  bool _isLoading = true;
  List<dynamic> _allocations = [];
  List<dynamic> _payments = [];

  @override
  void initState() {
    super.initState();
    _fetchAccountantData();
  }

  Future<void> _fetchAccountantData() async {
    setState(() => _isLoading = true);
    try {
      final allocData = await ApiService.get('${ApiConfig.cases}/allocations');
      final payData = await ApiService.get(ApiConfig.payments);
      setState(() {
        _allocations = allocData is List ? allocData : [];
        _payments = payData is List ? payData : [];
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load accountant data: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _verifyPayment(String paymentId, String status) async {
    try {
      await ApiService.patch('${ApiConfig.payments}/$paymentId/verify', {
        'status': status,
        'note': 'Verified via Mobile Accountant Portal',
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Payment verification updated to $status')),
        );
      }
      _fetchAccountantData();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Verification error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final double totalRevenue = _payments
        .where((p) => p['status'] == 'SUCCESS')
        .fold(0.0, (sum, p) => sum + (p['amount'] ?? 0).toDouble());

    final double totalPending = _payments
        .where((p) => p['status'] == 'PENDING')
        .fold(0.0, (sum, p) => sum + (p['amount'] ?? 0).toDouble());

    return Scaffold(
      appBar: AppBar(
        title: const Text('Accountant Portal'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchAccountantData,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Financial Overview Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.account_balance_wallet, color: AppTheme.secondary),
                            SizedBox(width: 8),
                            Text(
                              'FINANCE & ACCOUNTING',
                              style: TextStyle(
                                color: AppTheme.secondary,
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        const Text(
                          'Total Verified Revenue',
                          style: TextStyle(color: Colors.white70, fontSize: 13),
                        ),
                        Text(
                          '₦${totalRevenue.toStringAsFixed(2)}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Pending Collections: ₦${totalPending.toStringAsFixed(2)}',
                          style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Client-Lawyer Directory Section
                  const Text(
                    'Client to Lawyer Allocations Directory',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const Text(
                    'Audit which lawyer is joined to which client case',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 12),

                  _allocations.isEmpty
                      ? const Card(
                          child: Padding(
                            padding: EdgeInsets.all(20),
                            child: Center(child: Text('No client-lawyer allocations found.')),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _allocations.length,
                          itemBuilder: (context, index) {
                            final item = _allocations[index];
                            final client = item['client'] ?? {};
                            final lawyer = item['lawyer'] ?? {};
                            final String lawyerName = lawyer['name'] ?? 'Unassigned';
                            final double paid = (item['totalPaid'] ?? 0).toDouble();

                            return Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: Padding(
                                padding: const EdgeInsets.all(14),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            item['title'] ?? 'Case File',
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                                          ),
                                        ),
                                        Chip(
                                          label: Text(
                                            item['status'] ?? 'OPEN',
                                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                                          ),
                                          backgroundColor: Colors.green.shade50,
                                        ),
                                      ],
                                    ),
                                    const Divider(),
                                    Row(
                                      children: [
                                        const Icon(Icons.person, size: 16, color: Colors.grey),
                                        const SizedBox(width: 6),
                                        Text('Client: ', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                        Expanded(
                                          child: Text(
                                            '${client['name'] ?? 'Client'} (${client['email'] ?? '-'})',
                                            style: const TextStyle(fontSize: 13),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 6),
                                    Row(
                                      children: [
                                        const Icon(Icons.gavel, size: 16, color: AppTheme.primary),
                                        const SizedBox(width: 6),
                                        const Text('Joined Lawyer: ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                        Expanded(
                                          child: Text(
                                            lawyerName,
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.bold,
                                              color: lawyerName != 'Unassigned' ? AppTheme.primary : Colors.orange,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Paid: ₦${paid.toStringAsFixed(2)}',
                                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                                        ),
                                        Text(
                                          'Pending: ₦${(item['totalPending'] ?? 0).toDouble().toStringAsFixed(2)}',
                                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.amber),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),

                  const SizedBox(height: 24),

                  // Client Payments Ledger & Verification
                  const Text(
                    'Client Payments Ledger',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                  const SizedBox(height: 12),

                  _payments.isEmpty
                      ? const Card(
                          child: Padding(
                            padding: EdgeInsets.all(20),
                            child: Center(child: Text('No payment records found.')),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _payments.length,
                          itemBuilder: (context, index) {
                            final p = _payments[index];
                            final String status = p['status'] ?? 'PENDING';
                            final double amount = (p['amount'] ?? 0).toDouble();

                            return Card(
                              margin: const EdgeInsets.only(bottom: 10),
                              child: ListTile(
                                leading: Icon(
                                  status == 'SUCCESS' ? Icons.check_circle : Icons.pending,
                                  color: status == 'SUCCESS' ? Colors.green : Colors.amber,
                                ),
                                title: Text(
                                  '₦${amount.toStringAsFixed(2)} - ${p['client']?['name'] ?? 'Client'}',
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                                subtitle: Text('Ref: ${p['txRef'] ?? '-'} • Case: ${p['case']?['title'] ?? '-'}'),
                                trailing: status == 'PENDING'
                                    ? ElevatedButton(
                                        onPressed: () => _verifyPayment(p['id'], 'SUCCESS'),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.green,
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        ),
                                        child: const Text('Verify', style: TextStyle(fontSize: 11)),
                                      )
                                    : Text(
                                        status,
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: status == 'SUCCESS' ? Colors.green : Colors.red,
                                        ),
                                      ),
                              ),
                            );
                          },
                        ),
                ],
              ),
            ),
    );
  }
}
