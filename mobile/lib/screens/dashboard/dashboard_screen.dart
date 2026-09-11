import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/api_config.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';
import '../../services/api_service.dart';

import 'accountant_dashboard_screen.dart';
import 'cases_list_screen.dart';
import 'cases_title_list_screen.dart';
import 'payments_screen.dart';
import 'schedule_screen.dart';
import 'inquiries_screen.dart';
import 'notifications_screen.dart';
import 'team_chat_screen.dart';
import '../auth/login_screen.dart';

class SidebarMenuItem {
  final String name;
  final IconData icon;
  final Widget screen;

  const SidebarMenuItem({
    required this.name,
    required this.icon,
    required this.screen,
  });
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _activeNavIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final provider = Provider.of<DashboardProvider>(context, listen: false);
      provider.fetchDashboardData();
      provider.fetchNotifications();
    });
  }

  // Exact Web Role-Based Sidebar Navigation Items (matched to frontend/src/app/dashboard/layout.tsx)
  List<SidebarMenuItem> _getRoleSidebarItems(dynamic user) {
    if (user.isAdmin) {
      return [
        SidebarMenuItem(name: 'Overview', icon: Icons.home_outlined, screen: _buildOverviewTab(context, user)),
        const SidebarMenuItem(name: 'Cases', icon: Icons.cases_outlined, screen: CasesTitleListScreen()),
        const SidebarMenuItem(name: 'Accountant Portal', icon: Icons.attach_money, screen: AccountantDashboardScreen()),
        const SidebarMenuItem(name: 'MIDLEX CASE DIRECTORY', icon: Icons.insert_drive_file_outlined, screen: CasesListScreen()),
        SidebarMenuItem(name: 'Clients', icon: Icons.groups_outlined, screen: _buildUserDirectoryView('CLIENT')),
        SidebarMenuItem(name: 'Lawyers', icon: Icons.gavel_outlined, screen: _buildUserDirectoryView('LAWYER')),
        SidebarMenuItem(name: 'Admins', icon: Icons.person_outline, screen: _buildUserDirectoryView('ADMIN')),
        const SidebarMenuItem(name: 'Messages', icon: Icons.chat_bubble_outline, screen: TeamChatScreen()),
        const SidebarMenuItem(name: 'Payments', icon: Icons.monetization_on_outlined, screen: PaymentsScreen()),
        const SidebarMenuItem(name: 'Inquiries', icon: Icons.chat_outlined, screen: InquiriesScreen()),
        const SidebarMenuItem(name: 'Notifications', icon: Icons.notifications_none_outlined, screen: NotificationsScreen()),
      ];
    } else if (user.isLawyer) {
      return [
        const SidebarMenuItem(name: 'Cases', icon: Icons.cases_outlined, screen: CasesTitleListScreen()),
        const SidebarMenuItem(name: 'MIDLEX CASE DIRECTORY', icon: Icons.insert_drive_file_outlined, screen: CasesListScreen()),
        SidebarMenuItem(name: 'Clients', icon: Icons.groups_outlined, screen: _buildUserDirectoryView('CLIENT')),
        const SidebarMenuItem(name: 'Messages', icon: Icons.chat_bubble_outline, screen: TeamChatScreen()),
        const SidebarMenuItem(name: 'Schedule', icon: Icons.calendar_today_outlined, screen: ScheduleScreen()),
      ];
    } else if (user.isAccountant) {
      return [
        const SidebarMenuItem(name: 'Accountant Portal', icon: Icons.attach_money, screen: AccountantDashboardScreen()),
        const SidebarMenuItem(name: 'Payments & Receipts', icon: Icons.monetization_on_outlined, screen: PaymentsScreen()),
        SidebarMenuItem(name: 'Client-Lawyer Directory', icon: Icons.groups_outlined, screen: _buildUserDirectoryView('CLIENT')),
      ];
    } else {
      // CLIENT Role
      return [
        SidebarMenuItem(name: 'My Case', icon: Icons.dashboard_outlined, screen: _buildOverviewTab(context, user)),
        const SidebarMenuItem(name: 'Messages', icon: Icons.chat_bubble_outline, screen: TeamChatScreen()),
        const SidebarMenuItem(name: 'Payments', icon: Icons.payment_outlined, screen: PaymentsScreen()),
        const SidebarMenuItem(name: 'Schedule', icon: Icons.calendar_today_outlined, screen: ScheduleScreen()),
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;
    final dashboard = Provider.of<DashboardProvider>(context);

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
                    MaterialPageRoute(builder: (context) => const LoginScreen()),
                  );
                },
                child: const Text('Go to Sign In'),
              ),
            ],
          ),
        ),
      );
    }

    final isStaff = user.isAdmin || user.isLawyer || user.isAccountant;
    final items = _getRoleSidebarItems(user);
    final activeIndex = _activeNavIndex < items.length ? _activeNavIndex : 0;
    final currentItem = items[activeIndex];

    return Scaffold(
      drawer: isStaff ? _buildStaffSidebar(context, user, items) : null,
      appBar: AppBar(
        title: Text(isStaff ? currentItem.name : 'Client Dashboard'),
        actions: [
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.notifications_outlined),
                if (dashboard.unreadNotificationCount > 0)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                      child: Text(
                        '${dashboard.unreadNotificationCount}',
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            tooltip: 'Notifications',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const NotificationsScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              dashboard.fetchDashboardData();
              dashboard.fetchNotifications();
            },
          ),
        ],
      ),
      body: currentItem.screen,
      bottomNavigationBar: isStaff
          ? null
          : BottomNavigationBar(
              currentIndex: activeIndex,
              selectedItemColor: AppTheme.primary,
              unselectedItemColor: Colors.grey,
              type: BottomNavigationBarType.fixed,
              onTap: (index) => setState(() => _activeNavIndex = index),
              items: items
                  .map((item) => BottomNavigationBarItem(
                        icon: Icon(item.icon),
                        label: item.name,
                      ))
                  .toList(),
            ),
    );
  }

  // Sidebar Drawer matching Web Sidebar Menu per role
  Widget _buildStaffSidebar(BuildContext context, dynamic user, List<SidebarMenuItem> items) {
    return Drawer(
      child: Container(
        color: const Color(0xFF1B4D2E), // Dark Green matching Web Sidebar
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(color: Color(0xFF0C2B18)),
              accountName: Text(
                user.name,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
              ),
              accountEmail: Text(
                '${user.role} • ${user.email}',
                style: const TextStyle(color: AppTheme.secondary, fontSize: 12, fontWeight: FontWeight.bold),
              ),
              currentAccountPicture: CircleAvatar(
                backgroundColor: AppTheme.secondary,
                child: Text(
                  user.name.substring(0, 1).toUpperCase(),
                  style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                ),
              ),
            ),

            ...List.generate(items.length, (index) {
              final item = items[index];
              final isSelected = _activeNavIndex == index;
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 3),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFFC69A59) : Colors.transparent, // Gold highlight for active item
                  borderRadius: BorderRadius.circular(12),
                ),
                child: ListTile(
                  leading: Icon(item.icon, color: isSelected ? Colors.white : Colors.white70, size: 20),
                  title: Text(
                    item.name,
                    style: TextStyle(
                      color: isSelected ? Colors.white : Colors.white70,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                      fontSize: 13,
                    ),
                  ),
                  onTap: () {
                    setState(() {
                      _activeNavIndex = index;
                    });
                    Navigator.pop(context); // close drawer
                  },
                ),
              );
            }),

            const Divider(color: Colors.white24, height: 24),

            ListTile(
              leading: const Icon(Icons.logout, color: Colors.redAccent),
              title: const Text('Sign Out', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
              onTap: () async {
                final auth = Provider.of<AuthProvider>(context, listen: false);
                await auth.logout();
                if (context.mounted) {
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => const LoginScreen()),
                  );
                }
              },
            ),
          ],
        ),
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

          if (user.isLawyer) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.amber.shade900,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.secondary, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.shield_outlined, color: AppTheme.secondary, size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "ALLOCATED TEAM: ${(user.litigationTeam ?? 'TEAM ANCHOR').toUpperCase()}",
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    "You have been allocated to this litigation team by Super Admin.",
                    style: TextStyle(color: Colors.white70, fontSize: 11),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        setState(() {
                          _activeNavIndex = 1; // Open Case Directory for lawyer
                        });
                      },
                      icon: const Icon(Icons.folder_open, size: 16, color: Colors.white),
                      label: Text(
                        "OPEN ${(user.litigationTeam ?? 'TEAM ANCHOR').toUpperCase()} CASE DIRECTORY",
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.secondary,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
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
                onPressed: () => setState(() => _activeNavIndex = 1),
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

  // Directory View for Clients, Lawyers, or Admins
  Widget _buildUserDirectoryView(String roleType) {
    return _UserDirectoryListWidget(roleType: roleType);
  }
}

class _UserDirectoryListWidget extends StatefulWidget {
  final String roleType; // CLIENT, LAWYER, ADMIN
  const _UserDirectoryListWidget({required this.roleType});

  @override
  State<_UserDirectoryListWidget> createState() => _UserDirectoryListWidgetState();
}

class _UserDirectoryListWidgetState extends State<_UserDirectoryListWidget> {
  List<dynamic> _users = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _fetchUsers();
  }

  Future<void> _fetchUsers() async {
    setState(() => _isLoading = true);
    try {
      String endpoint = ApiConfig.clients;
      if (widget.roleType == 'LAWYER') endpoint = ApiConfig.lawyers;
      if (widget.roleType == 'ADMIN') endpoint = ApiConfig.admins;

      final res = await ApiService.get(endpoint);
      if (res is List && mounted) {
        setState(() => _users = res);
      }
    } catch (e) {
      debugPrint('Error fetching ${widget.roleType} users: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.roleType == 'CLIENT'
        ? 'Clients Directory'
        : widget.roleType == 'LAWYER'
            ? 'Lawyers & Legal Staff'
            : 'Super Admins';

    final filtered = _users.where((u) {
      if (_searchQuery.trim().isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      final name = (u['name'] ?? '').toString().toLowerCase();
      final email = (u['email'] ?? '').toString().toLowerCase();
      final phone = (u['phone'] ?? u['secondaryPhone'] ?? '').toString().toLowerCase();
      return name.contains(q) || email.contains(q) || phone.contains(q);
    }).toList();

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          color: Colors.white,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary)),
              const SizedBox(height: 10),
              TextField(
                onChanged: (v) => setState(() => _searchQuery = v),
                decoration: InputDecoration(
                  hintText: 'Search $title by name, email, phone...',
                  prefixIcon: const Icon(Icons.search, color: AppTheme.secondary),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : filtered.isEmpty
                  ? Center(
                      child: Text('No ${widget.roleType.toLowerCase()} records found.'),
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: filtered.length,
                      itemBuilder: (context, idx) {
                        final userItem = filtered[idx];
                        final name = userItem['name'] ?? 'N/A';
                        final email = userItem['email'] ?? 'N/A';
                        final phone = [userItem['phone'], userItem['secondaryPhone']].where((p) => p != null && p.toString().isNotEmpty).join(', ');

                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          child: ListTile(
                            contentPadding: const EdgeInsets.all(16),
                            leading: CircleAvatar(
                              backgroundColor: AppTheme.primary,
                              child: Text(
                                name.substring(0, 1).toUpperCase(),
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                              ),
                            ),
                            title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primary)),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 4),
                                Text('✉️ $email', style: const TextStyle(fontSize: 12, color: AppTheme.textDark)),
                                if (phone.isNotEmpty)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 2),
                                    child: Text('📞 $phone', style: const TextStyle(fontSize: 12, color: AppTheme.secondary, fontWeight: FontWeight.bold)),
                                  ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
        ),
      ],
    );
  }
}
