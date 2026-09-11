import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/case_model.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';
import '../../widgets/status_chip.dart';
import 'chat_screen.dart';

class CaseDetailScreen extends StatefulWidget {
  final CaseModel caseModel;

  const CaseDetailScreen({super.key, required this.caseModel});

  @override
  State<CaseDetailScreen> createState() => _CaseDetailScreenState();
}

class _CaseDetailScreenState extends State<CaseDetailScreen> {
  late String _currentTitle;
  late String _currentDescription;

  @override
  void initState() {
    super.initState();
    _currentTitle = widget.caseModel.title;
    _currentDescription = widget.caseModel.description;
  }

  void _showEditTitleDialog() {
    final titleController = TextEditingController(text: _currentTitle);
    final descController = TextEditingController(text: _currentDescription);
    bool isSubmitting = false;

    showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              title: const Row(
                children: [
                  Icon(Icons.edit_note, color: AppTheme.primary),
                  SizedBox(width: 8),
                  Text('Edit Case Title', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Case Title *', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: titleController,
                      decoration: InputDecoration(
                        hintText: 'Enter case title',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text('Case Summary / Description', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.textMuted)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: descController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Enter description...',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSubmitting ? null : () => Navigator.pop(dialogContext),
                  child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
                ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: isSubmitting
                      ? null
                      : () async {
                          final newTitle = titleController.text.trim();
                          final newDesc = descController.text.trim();
                          if (newTitle.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Case title cannot be empty.')),
                            );
                            return;
                          }
                          final messenger = ScaffoldMessenger.of(context);
                          final navigator = Navigator.of(dialogContext);
                          setDialogState(() => isSubmitting = true);
                          try {
                            await Provider.of<DashboardProvider>(context, listen: false).updateCaseTitle(
                              caseId: widget.caseModel.id,
                              title: newTitle,
                              description: newDesc,
                            );
                            if (mounted) {
                              setState(() {
                                _currentTitle = newTitle;
                                _currentDescription = newDesc;
                              });
                            }
                            navigator.pop();
                            messenger.showSnackBar(
                              const SnackBar(
                                content: Text('Case title updated successfully!'),
                                backgroundColor: Colors.green,
                              ),
                            );
                          } catch (e) {
                            setDialogState(() => isSubmitting = false);
                            messenger.showSnackBar(
                              SnackBar(content: Text('Failed to update title: $e')),
                            );
                          }
                        },
                  child: isSubmitting
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Save Changes'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final isStaff = authProvider.user?.role == 'ADMIN' || authProvider.user?.role == 'LAWYER';

    return Scaffold(
      appBar: AppBar(
        title: Text(_currentTitle),
        actions: [
          if (isStaff)
            IconButton(
              icon: const Icon(Icons.edit),
              tooltip: 'Edit Case Title',
              onPressed: _showEditTitleDialog,
            ),
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline),
            tooltip: 'Case Messages',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ChatScreen(caseModel: widget.caseModel),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                StatusChip(status: widget.caseModel.status),
                if (widget.caseModel.createdAt != null)
                  Text(
                    'Created: ${widget.caseModel.createdAt!.split('T').first}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Text(
                    _currentTitle,
                    style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                  ),
                ),
                if (isStaff)
                  IconButton(
                    icon: const Icon(Icons.edit_note, color: AppTheme.secondary),
                    tooltip: 'Edit Case Title',
                    onPressed: _showEditTitleDialog,
                  ),
              ],
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Case Summary',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.primary),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _currentDescription,
                      style: const TextStyle(fontSize: 14, color: AppTheme.textDark, height: 1.5),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.person, color: AppTheme.primary),
                      title: const Text('Client', style: TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(widget.caseModel.client?.name ?? 'Assigned Client'),
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.gavel, color: AppTheme.secondary),
                      title: const Text('Assigned Lawyer', style: TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(widget.caseModel.lawyer?.name ?? 'Unassigned / Pending lawyer assignment'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Case Documents',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textDark),
                ),
                Text(
                  '${widget.caseModel.documents.length} Files',
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (widget.caseModel.documents.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: Text('No documents uploaded for this case.')),
                ),
              )
            else
              ...widget.caseModel.documents.map((doc) => Card(
                    child: ListTile(
                      leading: const Icon(Icons.insert_drive_file, color: AppTheme.primary),
                      title: Text(doc.name),
                      subtitle: Text(doc.type),
                      trailing: const Icon(Icons.download),
                    ),
                  )),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      final shareUrl = 'https://midlex-llplawfirm.vercel.app/share/case/${widget.caseModel.id}';
                      Clipboard.setData(ClipboardData(text: shareUrl));
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Shareable Case Link copied to clipboard!\n$shareUrl'),
                          backgroundColor: AppTheme.primary,
                          duration: const Duration(seconds: 4),
                        ),
                      );
                    },
                    icon: const Icon(Icons.share),
                    label: const Text('Share Case Files Link'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.secondary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChatScreen(caseModel: widget.caseModel),
                    ),
                  );
                },
                icon: const Icon(Icons.chat),
                label: const Text('Open Case Chat'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
