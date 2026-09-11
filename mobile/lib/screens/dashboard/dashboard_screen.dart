import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';

import 'accountant_dashboard_screen.dart';
import 'cases_list_screen.dart';
import 'payments_screen.dart';
import 'schedule_screen.dart';
import 'inquiries_screen.dart';
import '../public/home_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<DashboardProvider>(context, listen: false);
      provider.fetchDashboardData();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;

    if (user == null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Please sign in to access your dashboard.'),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => const HomeScreen()),
                  );
                },
                child: const Text('Go Home'),
              ),
            ],
          ),
        ),
      );
    }

    final List<Widget> pages = [
      if (user.isAccountant)
        const AccountantDashboardScreen()
      else
        _buildOverviewTab(context, user),
      const CasesListScreen(),
      const PaymentsScreen(),
      if (user.isAccountant || user.isAdmin) const AccountantDashboardScreen() else const ScheduleScreen(),
      if (user.isAdmin) const InquiriesScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('${user.role} Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              Provider.of<DashboardProvider>(context, listen: false).fetchDashboardData();
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await auth.logout();
              if (mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const HomeScreen()),
                );
              }
            },
          ),
        ],
      ),
      body: pages[_currentIndex < pages.length ? _currentIndex : 0],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex < pages.length ? _currentIndex : 0,
        selectedItemColor: AppTheme.primary,
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        onTap: (index) => setState(() => _currentIndex = index),
        items: [
          const BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Overview'),
          BottomNavigationBarItem(
            icon: const Icon(Icons.folder_special),
            label: (user.isAdmin || user.isLawyer) ? 'MIDLEX CASE DIRECTORY' : 'Cases',
          ),
          const BottomNavigationBarItem(icon: Icon(Icons.payment), label: 'Payments'),
          if (user.isAccountant || user.isAdmin)
            const BottomNavigationBarItem(icon: Icon(Icons.account_balance), label: 'Accountant')
          else
            const BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Schedule'),
          if (user.isAdmin)
            const BottomNavigationBarItem(icon: Icon(Icons.inbox), label: 'Inquiries'),
        ],
      ),
    );
  }

  Widget _buildOverviewTab(BuildContext context, dynamic user) {
    final dashboard = Provider.of<DashboardProvider>(context);

    return SingleChildScrollView(
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
            child: Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: AppTheme.secondary,
                  child: Text(
                    user.name.substring(0, 1).toUpperCase(),
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.name,
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Role: ${user.role}',
                        style: const TextStyle(color: AppTheme.secondary, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        user.email,
                        style: const TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Activity Summary',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _buildMetricCard('Total Cases', '${dashboard.cases.length}', Icons.folder, Colors.blue),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildMetricCard('Court Dates', '${dashboard.courtDates.length}', Icons.event, Colors.orange),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildMetricCard('Payments', '${dashboard.payments.length}', Icons.account_balance_wallet, Colors.green),
              ),
              if (user.isAdmin) ...[
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard('Inquiries', '${dashboard.inquiries.length}', Icons.inbox, Colors.purple),
                ),
              ],
            ],
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Recent Cases',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
              ),
              TextButton(
                onPressed: () => setState(() => _currentIndex = 1),
                child: const Text('View All', style: TextStyle(color: AppTheme.secondary)),
              ),
            ],
          ),
          if (dashboard.isLoading)
            const Center(child: CircularProgressIndicator())
          else if (dashboard.cases.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Center(child: Text('No active cases found.')),
              ),
            )
          else
            ...dashboard.cases.take(3).map((c) => Card(
                  margin: const EdgeInsets.only(bottom: 10),
                  child: ListTile(
                    leading: const Icon(Icons.folder, color: AppTheme.primary),
                    title: Text(c.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('Status: ${c.status}'),
                    trailing: const Icon(Icons.chevron_right),
                  ),
                )),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String count, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 12),
            Text(
              count,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color),
            ),
            const SizedBox(height: 4),
            Text(title, style: const TextStyle(color: AppTheme.textMuted, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}
