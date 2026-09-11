import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../config/api_config.dart';
import '../../providers/dashboard_provider.dart';
import '../../services/api_service.dart';
import '../../models/inquiry_model.dart';
import '../../widgets/status_chip.dart';

class InquiriesScreen extends StatefulWidget {
  const InquiriesScreen({super.key});

  @override
  State<InquiriesScreen> createState() => _InquiriesScreenState();
}

class _InquiriesScreenState extends State<InquiriesScreen> {
  final Map<String, bool> _loadingAi = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<DashboardProvider>(context, listen: false).fetchInquiries();
    });
  }

  Future<void> _triggerAiAutoReply(InquiryModel inq, [String? customPrompt]) async {
    setState(() => _loadingAi[inq.id] = true);
    try {
      final res = await ApiService.post('${ApiConfig.inquiries}/${inq.id}/ai-reply', {
        'prompt': customPrompt ?? '',
      });
      if (mounted) {
        await Provider.of<DashboardProvider>(context, listen: false).fetchInquiries();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🤖 Midlex AI Auto-Reply generated successfully!'),
            backgroundColor: AppTheme.primary,
          ),
        );
        if (res != null && res['aiReply'] != null && customPrompt == null) {
          _showAiChatBottomSheet(inq, res['aiReply']);
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error generating AI reply: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _loadingAi[inq.id] = false);
    }
  }

  void _showAiChatBottomSheet(InquiryModel inq, [String? initialAiReply]) {
    final customController = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 16,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Text('🤖 ', style: TextStyle(fontSize: 22)),
                      Text(
                        'AI Auto-Reply (${inq.name})',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primary),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: 8),
              Text(
                'Original Inquiry:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey.shade600),
              ),
              const SizedBox(height: 4),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(inq.message, style: const TextStyle(fontSize: 13)),
              ),
              const SizedBox(height: 14),
              if (initialAiReply != null) ...[
                Text(
                  'Midlex AI Assistant Response:',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.primary),
                ),
                const SizedBox(height: 4),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
                  ),
                  child: Text(initialAiReply, style: const TextStyle(fontSize: 13, height: 1.4)),
                ),
                const SizedBox(height: 14),
              ],
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: customController,
                      decoration: InputDecoration(
                        hintText: 'Type prompt for AI to reply...',
                        isDense: true,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      final txt = customController.text.trim();
                      if (txt.isNotEmpty) {
                        Navigator.pop(ctx);
                        _triggerAiAutoReply(inq, txt);
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: const Text('Send'),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = Provider.of<DashboardProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Website Inquiries & AI Chat'),
        backgroundColor: AppTheme.primary,
        elevation: 0,
      ),
      body: dashboard.inquiries.isEmpty
          ? const Center(child: Text('No client inquiries logged yet.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: dashboard.inquiries.length,
              itemBuilder: (context, index) {
                final inq = dashboard.inquiries[index];
                final isLoading = _loadingAi[inq.id] ?? false;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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
                        if (inq.serviceNeeded != null)
                          Text('Service: ${inq.serviceNeeded}', style: const TextStyle(color: AppTheme.primary, fontSize: 11, fontWeight: FontWeight.w600)),
                        const Divider(height: 20),
                        Text(inq.message, style: const TextStyle(fontSize: 14, color: AppTheme.textDark)),
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: isLoading ? null : () => _triggerAiAutoReply(inq),
                            icon: isLoading
                                ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : const Text('🤖', style: TextStyle(fontSize: 16)),
                            label: Text(isLoading ? 'Generating AI Response...' : 'Auto-Reply with AI'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.secondary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
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
