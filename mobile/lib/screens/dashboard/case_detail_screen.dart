import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../config/theme.dart';
import '../../models/case_model.dart';
import '../../widgets/status_chip.dart';
import 'chat_screen.dart';

class CaseDetailScreen extends StatelessWidget {
  final CaseModel caseModel;

  const CaseDetailScreen({super.key, required this.caseModel});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(caseModel.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline),
            tooltip: 'Case Messages',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ChatScreen(caseModel: caseModel),
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
                StatusChip(status: caseModel.status),
                if (caseModel.createdAt != null)
                  Text(
                    'Created: ${caseModel.createdAt!.split('T').first}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              caseModel.title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppTheme.textDark),
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
                      caseModel.description,
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
                      subtitle: Text(caseModel.client?.name ?? 'Assigned Client'),
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.gavel, color: AppTheme.secondary),
                      title: const Text('Assigned Lawyer', style: TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text(caseModel.lawyer?.name ?? 'Unassigned / Pending lawyer assignment'),
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
                  '${caseModel.documents.length} Files',
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (caseModel.documents.isEmpty)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: Text('No documents uploaded for this case.')),
                ),
              )
            else
              ...caseModel.documents.map((doc) => Card(
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
                      final shareUrl = 'https://midlex-llplawfirm.vercel.app/share/case/${caseModel.id}';
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
                      builder: (context) => ChatScreen(caseModel: caseModel),
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
