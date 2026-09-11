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

  // Dialog to manage Litigation Teams (TEAM ANCHOR, TEAM SAPPHIRE, TEAM GEMSTONE, etc.)
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

  // Dialog to Edit Matter Attributes (Suit No, Court, Team) for a Case
  void _openEditMatterDialog(CaseModel caseModel) async {
    final overrides = await _getOverrideForCase(caseModel.id);
    final suitController = TextEditingController(
      text: overrides['suitNumber'] ?? caseModel.suitNumber,
    );
    String selectedCourt = overrides['court'] ??
        (_courts.contains(caseModel.courtName) ? caseModel.courtName : (_courts.isNotEmpty ? _courts.first : 'HIGH COURT BENIN CITY'));
    String selectedTeam = overrides['litigationTeam'] ??
        (_teams.contains(caseModel.litigationTeam)
            ? caseModel.litigationTeam
            : (_teams.isNotEmpty ? _teams.first : 'TEAM ANCHOR'));

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
            title: Text(
              'Assign Directory Details\n(${caseModel.title})',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
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
                  await DirectoryService.saveCaseAssignment(
                    caseModel.id,
                    suitNumber: suitController.text.trim(),
                    court: selectedCourt,
                    litigationTeam: selectedTeam,
                  );
                  _caseOverrides[caseModel.id] = {
                    'suitNumber': suitController.text.trim(),
                    'court': selectedCourt,
                    'litigationTeam': selectedTeam,
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
    final List<CaseModel> filteredCases = _searchQuery.trim().isEmpty
        ? allCases
        : allCases.where((item) {
            final query = _searchQuery.toLowerCase();
            final override = _caseOverrides[item.id] ?? {};
            final suit = override['suitNumber'] ?? item.suitNumber;
            final court = override['court'] ?? item.courtName;
            final team = override['litigationTeam'] ?? item.litigationTeam;

            return item.title.toLowerCase().contains(query) ||
                item.description.toLowerCase().contains(query) ||
                suit.toLowerCase().contains(query) ||
                court.toLowerCase().contains(query) ||
                team.toLowerCase().contains(query) ||
                (item.client?.name.toLowerCase().contains(query) ?? false);
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
                          icon: const Icon(Icons.shield_outlined, color: AppTheme.secondary, size: 16),
                          label: Text(
                            'Teams (${_teams.length})',
                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppTheme.secondary),
                            padding: const EdgeInsets.symmetric(vertical: 8),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _openManageCourtsDialog,
                          icon: const Icon(Icons.account_balance_outlined, color: Colors.white, size: 16),
                          label: Text(
                            'Courts (${_courts.length})',
                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Colors.white70),
                            padding: const EdgeInsets.symmetric(vertical: 8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
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
