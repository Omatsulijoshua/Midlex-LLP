import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';
import '../../models/case_model.dart';
import '../../services/directory_service.dart';
import '../../widgets/status_chip.dart';
import 'case_detail_screen.dart';
import 'new_case_screen.dart';
import 'team_chat_screen.dart';

class CasesListScreen extends StatefulWidget {
  const CasesListScreen({super.key});

  @override
  State<CasesListScreen> createState() => _CasesListScreenState();
}

class _CasesListScreenState extends State<CasesListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  List<String> _teams = [];
  List<String> _courts = [];
  String _selectedCourtFilter = 'ALL';
  String _selectedTeamFilter = 'ALL';
  String _selectedMonthFilter = 'ALL';
  Map<String, Map<String, String>> _caseOverrides = {};

  @override
  void initState() {
    super.initState();
    _loadDirectoryData();
  }

  Future<void> _loadDirectoryData() async {
    final t = await DirectoryService.getTeams();
    final c = await DirectoryService.getCourts();
    setState(() {
      _teams = t;
      _courts = c;
    });
  }

  Future<Map<String, String>> _getOverrideForCase(String caseId) async {
    if (_caseOverrides.containsKey(caseId)) {
      return _caseOverrides[caseId]!;
    }
    final assignment = await DirectoryService.getCaseAssignment(caseId);
    final map = <String, String>{
      if (assignment['suitNumber'] != null) 'suitNumber': assignment['suitNumber'].toString(),
      if (assignment['court'] != null) 'court': assignment['court'].toString(),
      if (assignment['litigationTeam'] != null) 'litigationTeam': assignment['litigationTeam'].toString(),
    };
    _caseOverrides[caseId] = map;
    return map;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  // Dialog to manage Litigation Teams (TEAM ANCHOR, TEAM ALPHA, TITAN LITIGATION, etc.)
  void _openManageTeamsDialog() {
    final addController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.shield_outlined, color: AppTheme.primary),
                SizedBox(width: 8),
                Text('Litigation Teams Directory'),
              ],
            ),
            content: SizedBox(
              width: double.maxFinite,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Manage legal litigation teams assigned to case matters.',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: addController,
                          style: const TextStyle(color: AppTheme.textDark, fontSize: 13),
                          decoration: const InputDecoration(
                            hintText: 'New Team Name (e.g. TEAM TITAN)',
                            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () async {
                          if (addController.text.trim().isNotEmpty) {
                            await DirectoryService.addTeam(addController.text);
                            addController.clear();
                            final updated = await DirectoryService.getTeams();
                            setDialogState(() {
                              _teams = updated;
                            });
                            setState(() {});
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          backgroundColor: AppTheme.primary,
                        ),
                        child: const Text('Add'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Flexible(
                    child: SingleChildScrollView(
                      child: Column(
                        children: _teams.map((t) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppTheme.accentLight,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AppTheme.border),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.group, size: 16, color: AppTheme.primary),
                                    const SizedBox(width: 8),
                                    Text(
                                      t,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                        color: AppTheme.primary,
                                      ),
                                    ),
                                  ],
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                                  onPressed: () async {
                                    await DirectoryService.removeTeam(t);
                                    final updated = await DirectoryService.getTeams();
                                    setDialogState(() {
                                      _teams = updated;
                                    });
                                    setState(() {});
                                  },
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Close'),
              ),
            ],
          );
        },
      ),
    );
  }

  // Dialog to manage Courts Directory (HIGH COURT BENIN CITY, etc.)
  void _openManageCourtsDialog() {
    final addController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.account_balance_outlined, color: AppTheme.secondary),
                SizedBox(width: 8),
                Text('Courts Directory'),
              ],
            ),
            content: SizedBox(
              width: double.maxFinite,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Manage jurisdiction courts available for litigation matters.',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.blue.shade200),
                    ),
                    child: const Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.info_outline, size: 14, color: Colors.blue),
                        SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            'Notice: If your court is not available in the directory list below, enter the name and click "Add" to register a new court.',
                            style: TextStyle(fontSize: 11, color: Colors.blue),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: addController,
                          style: const TextStyle(color: AppTheme.textDark, fontSize: 13),
                          decoration: const InputDecoration(
                            hintText: 'New Court Name (e.g. HIGH COURT UROMI)',
                            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton(
                        onPressed: () async {
                          if (addController.text.trim().isNotEmpty) {
                            await DirectoryService.addCourt(addController.text);
                            addController.clear();
                            final updated = await DirectoryService.getCourts();
                            setDialogState(() {
                              _courts = updated;
                            });
                            setState(() {});
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          backgroundColor: AppTheme.secondary,
                        ),
                        child: const Text('Add'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Flexible(
                    child: SingleChildScrollView(
                      child: Column(
                        children: _courts.map((c) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.amber.shade50.withValues(alpha: 0.5),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: Colors.amber.shade200),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Row(
                                    children: [
                                      const Icon(Icons.gavel_outlined, size: 16, color: AppTheme.secondary),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          c,
                                          style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 12,
                                            color: AppTheme.textDark,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, color: Colors.red, size: 18),
                                  onPressed: () async {
                                    await DirectoryService.removeCourt(c);
                                    final updated = await DirectoryService.getCourts();
                                    setDialogState(() {
                                      _courts = updated;
                                    });
                                    setState(() {});
                                  },
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Close'),
              ),
            ],
          );
        },
      ),
    );
  }

  // Dialog to view Team Case Directory
  // Dialog to view Team Case Directory
  void _openTeamDirectoryDialog(String teamName) {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final isStaff = auth.user?.isAdmin == true || auth.user?.isLawyer == true;

    showDialog(
      context: context,
      builder: (ctx) {
        final dashboard = Provider.of<DashboardProvider>(context, listen: false);
        final teamCases = dashboard.cases.where((c) {
          final override = _caseOverrides[c.id] ?? {};
          final t = override['litigationTeam'] ?? c.litigationTeam;
          return t == teamName;
        }).toList();

        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: Row(
            children: [
              const Icon(Icons.shield_outlined, color: AppTheme.secondary),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "${teamName.toUpperCase()}'S CASE DIRECTORY",
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.primary),
                    ),
                    const Text(
                      'Official Dedicated Legal Directory Register',
                      style: TextStyle(fontSize: 10, color: AppTheme.textMuted),
                    ),
                  ],
                ),
              ),
            ],
          ),
          content: SizedBox(
            width: double.maxFinite,
            child: teamCases.isEmpty
                ? Container(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.folder_open, size: 48, color: AppTheme.secondary),
                        const SizedBox(height: 12),
                        Text(
                          "${teamName.toUpperCase()}'S CASE DIRECTORY IS EMPTY",
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.primary),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 6),
                        Text(
                          "No legal matters have been assigned or registered under $teamName yet.",
                          style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  )
                : Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ElevatedButton.icon(
                            onPressed: () {
                              final items = teamCases.map((c) => {
                                'title': c.title,
                                'suitNumber': _caseOverrides[c.id]?['suitNumber'] ?? c.suitNumber,
                                'court': _caseOverrides[c.id]?['court'] ?? c.courtName,
                                'team': teamName,
                                'clientName': c.client?.name ?? 'N/A',
                                'stage': _caseOverrides[c.id]?['stage'] ?? 'PLEADINGS / PRE-TRIAL',
                                'pendingTask': _caseOverrides[c.id]?['pendingTask'] ?? 'Filing of Written Address & Witness Statements',
                              }).toList();
                              DirectoryService.exportPdf(items, title: "$teamName Case Directory");
                            },
                            icon: const Icon(Icons.picture_as_pdf, size: 14),
                            label: const Text('PDF', style: TextStyle(fontSize: 11)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red.shade700,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            ),
                          ),
                          const SizedBox(width: 8),
                          ElevatedButton.icon(
                            onPressed: () {
                              final items = teamCases.map((c) => {
                                'title': c.title,
                                'suitNumber': _caseOverrides[c.id]?['suitNumber'] ?? c.suitNumber,
                                'court': _caseOverrides[c.id]?['court'] ?? c.courtName,
                                'team': teamName,
                                'clientName': c.client?.name ?? 'N/A',
                                'stage': _caseOverrides[c.id]?['stage'] ?? 'PLEADINGS / PRE-TRIAL',
                                'pendingTask': _caseOverrides[c.id]?['pendingTask'] ?? 'Filing of Written Address & Witness Statements',
                              }).toList();
                              DirectoryService.exportDocx(items, title: "$teamName Case Directory");
                            },
                            icon: const Icon(Icons.description, size: 14),
                            label: const Text('DOCX', style: TextStyle(fontSize: 11)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue.shade700,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Flexible(
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: DataTable(
                            headingRowColor: WidgetStateProperty.all(AppTheme.primary),
                            dataRowMinHeight: 65,
                            dataRowMaxHeight: 85,
                            columns: const [
                              DataColumn(label: Text('S/N', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              DataColumn(label: Text('CASES TITLE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              DataColumn(label: Text('SUIT NO.', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              DataColumn(label: Text('COURT', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              DataColumn(label: Text('CLIENT DETAILS', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              DataColumn(label: Text('STAGE', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              DataColumn(label: Text('PENDING TASK', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                              DataColumn(label: Text('ACTION', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12))),
                            ],
                            rows: List.generate(teamCases.length, (idx) {
                              final item = teamCases[idx];
                              final override = _caseOverrides[item.id] ?? {};
                              final suitNo = override['suitNumber'] ?? item.suitNumber;
                              final courtName = override['court'] ?? item.courtName;
                              final stage = override['stage'] ?? 'PLEADINGS / PRE-TRIAL';
                              final pendingTask = override['pendingTask'] ?? 'Filing of Written Address & Witness Statements';

                              final client = item.client;
                              final clientName = client?.name ?? 'N/A';
                              final phones = [client?.phone, client?.secondaryPhone].where((p) => p != null && p.isNotEmpty).join(', ');
                              final clientEmail = client?.email ?? 'N/A';

                              return DataRow(cells: [
                                // 1. S/N
                                DataCell(Text('${idx + 1}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12))),
                                
                                // 2. CASES TITLE
                                DataCell(
                                  SizedBox(
                                    width: 160,
                                    child: Text(
                                      item.title,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.primary),
                                    ),
                                  ),
                                ),

                                // 3. SUIT NO.
                                DataCell(
                                  suitNo.isNotEmpty
                                      ? Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: AppTheme.accentLight,
                                            borderRadius: BorderRadius.circular(6),
                                            border: Border.all(color: AppTheme.secondary.withValues(alpha: 0.5)),
                                          ),
                                          child: Text(
                                            suitNo,
                                            style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 11),
                                          ),
                                        )
                                      : const Text('—', style: TextStyle(color: AppTheme.textMuted, fontStyle: FontStyle.italic)),
                                ),

                                // 4. COURT
                                DataCell(
                                  SizedBox(
                                    width: 140,
                                    child: Text(
                                      courtName.isNotEmpty ? courtName : '—',
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: courtName.isNotEmpty ? AppTheme.textDark : AppTheme.textMuted,
                                        fontStyle: courtName.isNotEmpty ? FontStyle.normal : FontStyle.italic,
                                      ),
                                    ),
                                  ),
                                ),

                                // 5. CLIENT DETAILS
                                DataCell(
                                  SizedBox(
                                    width: 180,
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Text(
                                          clientName,
                                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.primary),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          '📞 ${phones.isNotEmpty ? phones : 'No Phone'}',
                                          style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        Text(
                                          '✉️ $clientEmail',
                                          style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),

                                // 6. STAGE
                                DataCell(
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.blue.shade50,
                                      borderRadius: BorderRadius.circular(6),
                                      border: Border.all(color: Colors.blue.shade200),
                                    ),
                                    child: Text(
                                      stage,
                                      style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.blue, fontSize: 10),
                                    ),
                                  ),
                                ),

                                // 7. PENDING TASK
                                DataCell(
                                  SizedBox(
                                    width: 160,
                                    child: Row(
                                      children: [
                                        const Icon(Icons.push_pin, size: 14, color: Colors.amber),
                                        const SizedBox(width: 4),
                                        Expanded(
                                          child: Text(
                                            pendingTask,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textDark),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),

                                // 8. ACTION
                                DataCell(
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      if (isStaff)
                                        OutlinedButton.icon(
                                          onPressed: () {
                                            Navigator.pop(ctx);
                                            _openEditMatterDialog(item);
                                          },
                                          icon: const Icon(Icons.edit, size: 12, color: Colors.amber),
                                          label: const Text('Edit', style: TextStyle(fontSize: 11, color: Colors.amber)),
                                          style: OutlinedButton.styleFrom(
                                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                            side: const BorderSide(color: Colors.amber),
                                          ),
                                        ),
                                      const SizedBox(width: 4),
                                      ElevatedButton(
                                        onPressed: () {
                                          Navigator.pop(ctx);
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) => CaseDetailScreen(caseModel: item),
                                            ),
                                          );
                                        },
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: AppTheme.primary,
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        ),
                                        child: const Text('View >', style: TextStyle(fontSize: 11, color: Colors.white)),
                                      ),
                                    ],
                                  ),
                                ),
                              ]);
                            }),
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Close Directory'),
            ),
          ],
        );
      },
    );
  }

  // Dialog to Edit Matter Attributes (Suit No, Court, Team) for a Case
  void _openEditMatterDialog(CaseModel caseModel) async {
    final overrides = await _getOverrideForCase(caseModel.id);
    final titleController = TextEditingController(text: caseModel.title);
    final suitController = TextEditingController(
      text: overrides['suitNumber'] ?? caseModel.suitNumber,
    );
    String selectedCourt = overrides['court'] ??
        (_courts.contains(caseModel.courtName) ? caseModel.courtName : (_courts.isNotEmpty ? _courts.first : 'HIGH COURT BENIN CITY'));
    String selectedTeam = overrides['litigationTeam'] ??
        (_teams.contains(caseModel.litigationTeam)
            ? caseModel.litigationTeam
            : (_teams.isNotEmpty ? _teams.first : 'TEAM ANCHOR'));

    final availableStages = [
      'PLEADINGS / PRE-TRIAL',
      'TRIAL IN PROGRESS',
      'EVIDENCE & WITNESS HEARING',
      'WRITTEN ADDRESS',
      'JUDGMENT & SENTENCING',
      'APPEAL PENDING',
    ];
    String selectedStage = overrides['stage'] ?? 'PLEADINGS / PRE-TRIAL';
    if (!availableStages.contains(selectedStage)) {
      availableStages.add(selectedStage);
    }

    final taskController = TextEditingController(
      text: overrides['pendingTask'] ?? 'Filing of Written Address & Witness Statements',
    );

    if (!_courts.contains(selectedCourt) && selectedCourt.isNotEmpty) {
      _courts.add(selectedCourt);
    }
    if (!_teams.contains(selectedTeam) && selectedTeam.isNotEmpty) {
      _teams.add(selectedTeam);
    }

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            title: const Text(
              'Assign Directory Details',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primary),
            ),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Case Title *', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  TextField(
                    controller: titleController,
                    style: const TextStyle(color: AppTheme.textDark, fontSize: 13, fontWeight: FontWeight.bold),
                    decoration: const InputDecoration(
                      hintText: 'Enter Case Title',
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                  const SizedBox(height: 14),

                  const Text('Suit Number / File Ref:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  TextField(
                    controller: suitController,
                    style: const TextStyle(color: AppTheme.textDark, fontSize: 13),
                    decoration: const InputDecoration(
                      hintText: 'SUIT NO: HCB/102/2026',
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                  const SizedBox(height: 14),

                  const Text('Assigned Court:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  DropdownButtonFormField<String>(
                    value: _courts.contains(selectedCourt) ? selectedCourt : null,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    items: _courts.map((c) {
                      return DropdownMenuItem(
                        value: c,
                        child: Text(c, style: const TextStyle(fontSize: 12)),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setDialogState(() => selectedCourt = val);
                      }
                    },
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: Colors.blue.shade200),
                    ),
                    child: const Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.info_outline, size: 14, color: Colors.blue),
                        SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            'Notice: If your court is not available in the dropdown, click "Courts Directory" above to register a new court.',
                            style: TextStyle(fontSize: 10, color: Colors.blue),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  const Text('Assigned Litigation Team:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  DropdownButtonFormField<String>(
                    value: _teams.contains(selectedTeam) ? selectedTeam : null,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    items: _teams.map((t) {
                      return DropdownMenuItem(
                        value: t,
                        child: Text(t, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setDialogState(() => selectedTeam = val);
                      }
                    },
                  ),
                  const SizedBox(height: 14),

                  const Text('Litigation Stage:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  DropdownButtonFormField<String>(
                    value: selectedStage,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                    items: availableStages.map((stg) {
                      return DropdownMenuItem(
                        value: stg,
                        child: Text(stg, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setDialogState(() => selectedStage = val);
                      }
                    },
                  ),
                  const SizedBox(height: 14),

                  const Text('Pending Task:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  const SizedBox(height: 4),
                  TextField(
                    controller: taskController,
                    style: const TextStyle(color: AppTheme.textDark, fontSize: 13),
                    decoration: const InputDecoration(
                      hintText: 'e.g. Filing of Written Address & Witness Statements',
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                onPressed: () async {
                  final newTitle = titleController.text.trim();
                  final suitNo = suitController.text.trim();
                  final task = taskController.text.trim();

                  try {
                    await Provider.of<DashboardProvider>(context, listen: false).updateCaseDetails(
                      caseId: caseModel.id,
                      title: newTitle.isNotEmpty ? newTitle : null,
                      suitNumber: suitNo,
                      court: selectedCourt,
                      litigationTeam: selectedTeam,
                      stage: selectedStage,
                      pendingTask: task,
                    );
                  } catch (e) {
                    debugPrint('Error updating case details on backend API: $e');
                  }

                  await DirectoryService.saveCaseAssignment(
                    caseModel.id,
                    suitNumber: suitNo,
                    court: selectedCourt,
                    litigationTeam: selectedTeam,
                  );
                  _caseOverrides[caseModel.id] = {
                    'suitNumber': suitNo,
                    'court': selectedCourt,
                    'litigationTeam': selectedTeam,
                    'stage': selectedStage,
                    'pendingTask': task,
                  };
                  setState(() {});
                  if (ctx.mounted) Navigator.pop(ctx);
                },
                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary),
                child: const Text('Save Details'),
              ),
            ],
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;
    final isStaff = user?.isAdmin == true || user?.isLawyer == true;
    final dashboard = Provider.of<DashboardProvider>(context);

    final List<CaseModel> allCases = dashboard.cases;
    final List<CaseModel> filteredCases = allCases.where((item) {
      final override = _caseOverrides[item.id] ?? {};
      final suit = override['suitNumber'] ?? item.suitNumber;
      final court = override['court'] ?? item.courtName;
      final team = override['litigationTeam'] ?? item.litigationTeam;

      if (_selectedMonthFilter != 'ALL' && item.createdAt != null) {
        if (!item.createdAt!.startsWith(_selectedMonthFilter)) {
          return false;
        }
      }

      if (_selectedCourtFilter != 'ALL' && court != _selectedCourtFilter) {
        return false;
      }

      if (_selectedTeamFilter != 'ALL' && team != _selectedTeamFilter) {
        return false;
      }

      if (_searchQuery.trim().isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final matchesQuery = item.title.toLowerCase().contains(query) ||
            item.description.toLowerCase().contains(query) ||
            suit.toLowerCase().contains(query) ||
            court.toLowerCase().contains(query) ||
            team.toLowerCase().contains(query) ||
            (item.client?.name.toLowerCase().contains(query) ?? false);
        if (!matchesQuery) return false;
      }

      return true;
    }).toList();

    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('New Case', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const NewCaseScreen()),
          );
        },
      ),
      body: Column(
        children: [
          // Header Banner for MIDLEX CASE DIRECTORY
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: AppTheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.secondary.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.secondary),
                      ),
                      child: Text(
                        isStaff ? 'MIDLEX CASE DIRECTORY' : 'CLIENT CASE PORTAL',
                        style: const TextStyle(
                          color: AppTheme.secondary,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  isStaff ? 'MIDLEX CASE DIRECTORY' : 'Case Matters',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  isStaff
                      ? 'Official record of suit numbers, litigation teams, courts, and matter progress'
                      : 'Track active legal cases and communication history',
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
                const SizedBox(height: 16),

                // Search Bar
                TextField(
                  controller: _searchController,
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: const TextStyle(color: AppTheme.textDark, fontSize: 14),
                  decoration: InputDecoration(
                    hintText: isStaff
                        ? 'Search directory by Suit No., Title, Court, or Team...'
                        : 'Search cases...',
                    hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                    prefixIcon: const Icon(Icons.search, color: AppTheme.primary),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, color: Colors.grey),
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchQuery = '');
                            },
                          )
                        : null,
                    fillColor: Colors.white,
                    filled: true,
                    contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),

                if (isStaff) ...[
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _openManageTeamsDialog,
                          icon: const Icon(Icons.shield_outlined, color: AppTheme.secondary, size: 14),
                          label: Text(
                            'Teams (${_teams.length})',
                            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppTheme.secondary),
                            padding: const EdgeInsets.symmetric(vertical: 6),
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _openManageCourtsDialog,
                          icon: const Icon(Icons.account_balance_outlined, color: Colors.white, size: 14),
                          label: Text(
                            'Courts (${_courts.length})',
                            style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.white70),
                            padding: const EdgeInsets.symmetric(vertical: 6),
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const TeamChatScreen()),
                            );
                          },
                          icon: const Icon(Icons.forum_outlined, color: Colors.white, size: 14),
                          label: const Text(
                            'Team Chat',
                            style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.secondary,
                            padding: const EdgeInsets.symmetric(vertical: 6),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),
                  // VERY BOLD TEAM CASE DIRECTORY BUTTONS
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.amber.shade900,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.secondary, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.folder_special, color: AppTheme.secondary, size: 18),
                                SizedBox(width: 6),
                                Text(
                                  'TEAM CASE DIRECTORIES',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                    letterSpacing: 1.1,
                                  ),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.secondary.withValues(alpha: 0.2),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.secondary),
                              ),
                              child: Text(
                                user?.isAdmin == true ? 'Super Admin' : 'Counsel',
                                style: const TextStyle(
                                  color: AppTheme.secondary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        if (user?.isAdmin == true)
                          // Super Admin sees ALL team directories
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: _teams.map((t) {
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: ElevatedButton.icon(
                                    onPressed: () => _openTeamDirectoryDialog(t),
                                    icon: const Icon(Icons.folder_open, size: 16, color: Colors.white),
                                    label: Text(
                                      'OPEN $t CASE DIRECTORY',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 11,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.secondary,
                                      elevation: 4,
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                        side: const BorderSide(color: Colors.amberAccent, width: 1.5),
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          )
                        else
                          // Lawyer sees ONLY their assigned team directory
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () {
                                final lawyerTeam = user?.litigationTeam ?? 'TEAM ANCHOR';
                                _openTeamDirectoryDialog(lawyerTeam);
                              },
                              icon: const Icon(Icons.folder_open, size: 18, color: Colors.white),
                              label: Text(
                                'OPEN ${(user?.litigationTeam ?? 'TEAM ANCHOR').toUpperCase()} CASE DIRECTORY',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                  letterSpacing: 0.8,
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.secondary,
                                elevation: 6,
                                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  side: const BorderSide(color: Colors.amberAccent, width: 2),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 12),
                // Month Filter Row
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_month, color: AppTheme.primary, size: 18),
                      const SizedBox(width: 8),
                      const Text(
                        'Month:',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.textDark),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _selectedMonthFilter,
                            isExpanded: true,
                            icon: const Icon(Icons.arrow_drop_down, color: AppTheme.primary, size: 20),
                            style: const TextStyle(color: AppTheme.textDark, fontSize: 11, fontWeight: FontWeight.bold),
                            items: const [
                              DropdownMenuItem(value: 'ALL', child: Text('🗓️ All Recorded Months')),
                              DropdownMenuItem(value: '2026-09', child: Text('🗓️ September 2026 (Current)')),
                              DropdownMenuItem(value: '2026-08', child: Text('🗓️ August 2026')),
                              DropdownMenuItem(value: '2026-07', child: Text('🗓️ July 2026')),
                              DropdownMenuItem(value: '2026-06', child: Text('🗓️ June 2026')),
                              DropdownMenuItem(value: '2026-05', child: Text('🗓️ May 2026')),
                              DropdownMenuItem(value: '2026-04', child: Text('🗓️ April 2026')),
                              DropdownMenuItem(value: '2026-03', child: Text('🗓️ March 2026')),
                              DropdownMenuItem(value: '2026-02', child: Text('🗓️ February 2026')),
                              DropdownMenuItem(value: '2026-01', child: Text('🗓️ January 2026')),
                            ],
                            onChanged: (val) {
                              if (val != null) {
                                setState(() => _selectedMonthFilter = val);
                              }
                            },
                          ),
                        ),
                      ),
                      if (_selectedMonthFilter != 'ALL')
                        IconButton(
                          icon: const Icon(Icons.close, size: 16, color: Colors.red),
                          onPressed: () => setState(() => _selectedMonthFilter = 'ALL'),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 12),
                // Filter Dropdowns Row
                Row(
                  children: [
                    // Court Filter Dropdown
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _courts.contains(_selectedCourtFilter) || _selectedCourtFilter == 'ALL'
                                ? _selectedCourtFilter
                                : 'ALL',
                            isExpanded: true,
                            icon: const Icon(Icons.arrow_drop_down, color: AppTheme.primary, size: 20),
                            style: const TextStyle(color: AppTheme.textDark, fontSize: 11, fontWeight: FontWeight.bold),
                            items: [
                              const DropdownMenuItem(
                                value: 'ALL',
                                child: Text('🏛️ All Courts', overflow: TextOverflow.ellipsis),
                              ),
                              ..._courts.map((c) => DropdownMenuItem(
                                    value: c,
                                    child: Text(c, overflow: TextOverflow.ellipsis),
                                  )),
                            ],
                            onChanged: (val) {
                              if (val != null) {
                                setState(() => _selectedCourtFilter = val);
                              }
                            },
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Team Filter Dropdown
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: _teams.contains(_selectedTeamFilter) || _selectedTeamFilter == 'ALL'
                                ? _selectedTeamFilter
                                : 'ALL',
                            isExpanded: true,
                            icon: const Icon(Icons.arrow_drop_down, color: AppTheme.primary, size: 20),
                            style: const TextStyle(color: AppTheme.textDark, fontSize: 11, fontWeight: FontWeight.bold),
                            items: [
                              const DropdownMenuItem(
                                value: 'ALL',
                                child: Text('🛡️ All Teams', overflow: TextOverflow.ellipsis),
                              ),
                              ..._teams.map((t) => DropdownMenuItem(
                                    value: t,
                                    child: Text(t, overflow: TextOverflow.ellipsis),
                                  )),
                            ],
                            onChanged: (val) {
                              if (val != null) {
                                setState(() => _selectedTeamFilter = val);
                              }
                            },
                          ),
                        ),
                      ),
                    ),
                    if (_selectedCourtFilter != 'ALL' || _selectedTeamFilter != 'ALL') ...[
                      const SizedBox(width: 6),
                      InkWell(
                        onTap: () {
                          setState(() {
                            _selectedCourtFilter = 'ALL';
                            _selectedTeamFilter = 'ALL';
                          });
                        },
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.red.shade100,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.filter_alt_off, size: 18, color: Colors.red),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),

          // Content List / Table
          Expanded(
            child: dashboard.isLoading
                ? const Center(child: CircularProgressIndicator())
                : filteredCases.isEmpty
                    ? Center(
                        child: Text(
                          _searchQuery.isNotEmpty
                              ? 'No case matters matched "$_searchQuery"'
                              : 'No cases registered in directory yet.',
                          style: const TextStyle(color: AppTheme.textMuted),
                        ),
                      )
                    : isStaff
                        ? _buildDirectoryTable(context, filteredCases)
                        : _buildClientListView(context, filteredCases),
          ),
        ],
      ),
    );
  }

  // Beautiful Table for Super Admin & Lawyer (MIDLEX CASE DIRECTORY)
  Widget _buildDirectoryTable(BuildContext context, List<CaseModel> cases) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total Matters: ${cases.length}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  color: AppTheme.textDark,
                ),
              ),
              const Row(
                children: [
                  Icon(Icons.swipe_left, size: 16, color: AppTheme.secondary),
                  SizedBox(width: 4),
                  Text(
                    'Scroll table horizontally',
                    style: TextStyle(fontSize: 11, color: AppTheme.textMuted),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Horizontal Scroll Table
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: AppTheme.border),
              ),
              child: DataTable(
                headingRowColor: WidgetStateProperty.all(AppTheme.primary),
                dataRowMinHeight: 65,
                dataRowMaxHeight: 80,
                horizontalMargin: 16,
                columnSpacing: 24,
                columns: const [
                  DataColumn(
                    label: Text(
                      'S/N',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'SUIT NO.',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'CASE TITLE',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'CLIENT DETAILS',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'COURT',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'LITIGATION TEAM',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  DataColumn(
                    label: Text(
                      'ACTION',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ],
                rows: List.generate(cases.length, (index) {
                  final item = cases[index];
                  final sn = (index + 1).toString();

                  final override = _caseOverrides[item.id] ?? {};
                  final suitNo = override['suitNumber'] ?? item.suitNumber;
                  final courtName = override['court'] ?? item.courtName;
                  final teamName = override['litigationTeam'] ?? item.litigationTeam;

                  return DataRow(
                    cells: [
                      // 1. S/N
                      DataCell(
                        Text(
                          sn,
                          style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary),
                        ),
                      ),

                      // 2. SUIT NO.
                      DataCell(
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.accentLight,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppTheme.secondary.withValues(alpha: 0.5)),
                          ),
                          child: Text(
                            suitNo,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primary,
                            ),
                          ),
                        ),
                      ),

                      // 3. CASE TITLE
                      DataCell(
                        SizedBox(
                          width: 180,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                item.title,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: AppTheme.textDark,
                                ),
                              ),
                              const SizedBox(height: 2),
                              StatusChip(status: item.status),
                            ],
                          ),
                        ),
                      ),

                      // 4. CLIENT DETAILS
                      DataCell(
                        SizedBox(
                          width: 150,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                item.client?.name ?? 'Client',
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.primary),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              if (item.client?.email != null)
                                Text(
                                  item.client!.email,
                                  style: const TextStyle(fontSize: 10, color: AppTheme.textMuted),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                            ],
                          ),
                        ),
                      ),

                      // 4. COURT
                      DataCell(
                        SizedBox(
                          width: 170,
                          child: Row(
                            children: [
                              const Icon(Icons.account_balance_outlined, size: 16, color: AppTheme.secondary),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  courtName,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 12, color: AppTheme.textDark),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // 5. LITIGATION TEAM
                      DataCell(
                        SizedBox(
                          width: 160,
                          child: Row(
                            children: [
                              const Icon(Icons.shield_outlined, size: 16, color: AppTheme.primary),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  teamName,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.primary,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // ACTION
                      DataCell(
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit_note, color: AppTheme.secondary),
                              tooltip: 'Assign Team/Court',
                              onPressed: () => _openEditMatterDialog(item),
                            ),
                            ElevatedButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => CaseDetailScreen(caseModel: item),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.primary,
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: const Text(
                                'Open',
                                style: TextStyle(fontSize: 11, color: Colors.white),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                }),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Cards Directory for fast mobile reference
          const Text(
            'DIRECTORY MATTERS CARDS:',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 10),
          ...List.generate(cases.length, (index) {
            final item = cases[index];
            final override = _caseOverrides[item.id] ?? {};
            final suitNo = override['suitNumber'] ?? item.suitNumber;
            final courtName = override['court'] ?? item.courtName;
            final teamName = override['litigationTeam'] ?? item.litigationTeam;

            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: AppTheme.border),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 12,
                              backgroundColor: AppTheme.primary,
                              child: Text(
                                '${index + 1}',
                                style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              suitNo,
                              style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary, fontSize: 13),
                            ),
                          ],
                        ),
                        StatusChip(status: item.status),
                      ],
                    ),
                    const Divider(height: 20),
                    Text(
                      item.title,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textDark),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        const Icon(Icons.account_balance, size: 16, color: AppTheme.secondary),
                        const SizedBox(width: 6),
                        const Text('Court: ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Expanded(
                          child: Text(
                            courtName,
                            style: const TextStyle(fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.shield_outlined, size: 16, color: AppTheme.primary),
                        const SizedBox(width: 6),
                        const Text('Litigation Team: ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Expanded(
                          child: Text(
                            teamName,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.primary),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () => _openEditMatterDialog(item),
                            icon: const Icon(Icons.edit, size: 14, color: AppTheme.secondary),
                            label: const Text('Edit Info', style: TextStyle(color: AppTheme.secondary, fontSize: 12)),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AppTheme.secondary),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => CaseDetailScreen(caseModel: item),
                                ),
                              );
                            },
                            icon: const Icon(Icons.folder_open, size: 14),
                            label: const Text('View Matter', style: TextStyle(fontSize: 12)),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primary,
                              padding: const EdgeInsets.symmetric(vertical: 8),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // Simple ListView for Client Users
  Widget _buildClientListView(BuildContext context, List<CaseModel> cases) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: cases.length,
      itemBuilder: (context, index) {
        final item = cases[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.gavel, color: AppTheme.primary),
            ),
            title: Text(
              item.title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 6),
                Text(
                  item.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                ),
                const SizedBox(height: 8),
                StatusChip(status: item.status),
              ],
            ),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => CaseDetailScreen(caseModel: item),
                ),
              );
            },
          ),
        );
      },
    );
  }
}
