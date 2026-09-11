import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';
import '../../models/case_model.dart';
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

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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
            return item.title.toLowerCase().contains(query) ||
                item.description.toLowerCase().contains(query) ||
                item.suitNumber.toLowerCase().contains(query) ||
                item.courtName.toLowerCase().contains(query) ||
                item.litigationTeam.toLowerCase().contains(query) ||
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
                dataRowMinHeight: 60,
                dataRowMaxHeight: 75,
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
                            item.suitNumber,
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
                          width: 160,
                          child: Row(
                            children: [
                              const Icon(Icons.account_balance_outlined, size: 16, color: AppTheme.secondary),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  item.courtName,
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
                                  item.litigationTeam,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
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
                            'Open Case',
                            style: TextStyle(fontSize: 11, color: Colors.white),
                          ),
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
            'DIRECTORY CARDS:',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textMuted),
          ),
          const SizedBox(height: 10),
          ...List.generate(cases.length, (index) {
            final item = cases[index];
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
                              item.suitNumber,
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
                            item.courtName,
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
                        const Text('Litigation Team: ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Expanded(
                          child: Text(
                            item.litigationTeam,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.primary),
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
                              builder: (context) => CaseDetailScreen(caseModel: item),
                            ),
                          );
                        },
                        icon: const Icon(Icons.folder_open, size: 16),
                        label: const Text('View Matter Details'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.primary,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                        ),
                      ),
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
