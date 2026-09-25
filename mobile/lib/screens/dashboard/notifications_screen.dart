import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/notification_model.dart';
import '../../providers/dashboard_provider.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _isRefreshing = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadNotifications();
    });
  }

  Future<void> _loadNotifications() async {
    setState(() => _isRefreshing = true);
    await Provider.of<DashboardProvider>(context, listen: false).fetchNotifications();
    if (mounted) setState(() => _isRefreshing = false);
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'CHAT_MESSAGE':
        return Icons.chat_bubble_outline;
      case 'TIMELINE_UPDATE':
        return Icons.timeline;
      case 'CASE_STATUS_UPDATE':
      case 'CASE_UPDATE':
        return Icons.gavel;
      case 'PAYMENT':
        return Icons.account_balance_wallet;
      case 'CLIENT_ASSIGNED':
        return Icons.assignment_ind;
      default:
        return Icons.notifications_active;
    }
  }

  Color _getColorForType(String type) {
    switch (type) {
      case 'CHAT_MESSAGE':
        return Colors.blue;
      case 'TIMELINE_UPDATE':
        return AppTheme.secondary;
      case 'CASE_STATUS_UPDATE':
      case 'CASE_UPDATE':
        return Colors.purple;
      case 'PAYMENT':
        return Colors.green;
      case 'CLIENT_ASSIGNED':
        return Colors.amber.shade800;
      default:
        return AppTheme.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final dashboardProvider = Provider.of<DashboardProvider>(context);
    final notifications = dashboardProvider.notifications;

    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.notifications, color: AppTheme.secondary),
            SizedBox(width: 8),
            Text('Notifications'),
          ],
        ),
        actions: [
          if (notifications.any((n) => !n.isRead))
            TextButton.icon(
              onPressed: () async {
                await dashboardProvider.markAllNotificationsRead();
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('All notifications marked as read.')),
                  );
                }
              },
              icon: const Icon(Icons.done_all, size: 18, color: Colors.white),
              label: const Text(
                'Mark All Read',
                style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadNotifications,
        child: _isRefreshing && notifications.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : notifications.isEmpty
                ? ListView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    children: const [
                      SizedBox(height: 120),
                      Center(
                        child: Column(
                          children: [
                            Icon(Icons.notifications_off_outlined, size: 64, color: AppTheme.textMuted),
                            SizedBox(height: 16),
                            Text(
                              'No notifications yet',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textMuted,
                              ),
                            ),
                            SizedBox(height: 8),
                            Text(
                              'Updates on cases, messages, and timeline events will appear here.',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: notifications.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final NotificationModel item = notifications[index];
                      final icon = _getIconForType(item.type);
                      final iconColor = _getColorForType(item.type);
                      final formattedTime = item.createdAt.contains('T')
                          ? item.createdAt.split('T').first
                          : item.createdAt;

                      return Card(
                        elevation: item.isRead ? 1 : 3,
                        color: item.isRead ? Colors.white : Colors.amber.shade50.withAlpha(150),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: BorderSide(
                            color: item.isRead ? Colors.grey.shade200 : AppTheme.secondary.withAlpha(80),
                            width: item.isRead ? 1 : 1.5,
                          ),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          leading: CircleAvatar(
                            backgroundColor: iconColor.withAlpha(30),
                            child: Icon(icon, color: iconColor, size: 22),
                          ),
                          title: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  item.title,
                                  style: TextStyle(
                                    fontWeight: item.isRead ? FontWeight.w600 : FontWeight.bold,
                                    fontSize: 14,
                                    color: AppTheme.textDark,
                                  ),
                                ),
                              ),
                              if (!item.isRead)
                                Container(
                                  width: 8,
                                  height: 8,
                                  margin: const EdgeInsets.only(left: 6),
                                  decoration: const BoxDecoration(
                                    color: AppTheme.secondary,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                            ],
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 4),
                              Text(
                                item.message,
                                style: const TextStyle(fontSize: 13, color: Colors.black87, height: 1.3),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                formattedTime,
                                style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}
