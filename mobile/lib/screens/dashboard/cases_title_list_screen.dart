import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/dashboard_provider.dart';
import '../../models/case_model.dart';
import '../../widgets/status_chip.dart';
import 'case_detail_screen.dart';

class CasesTitleListScreen extends StatefulWidget {
  const CasesTitleListScreen({super.key});

  @override
  State<CasesTitleListScreen> createState() => _CasesTitleListScreenState();
}

class _CasesTitleListScreenState extends State<CasesTitleListScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCaseId = 'ALL';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final dashboard = Provider.of<DashboardProvider>(context);
    final List<CaseModel> cases = dashboard.cases;

    final List<CaseModel> filteredCases = cases.where((item) {
      if (_selectedCaseId != 'ALL' && item.id != _selectedCaseId) {
        return false;
      }
      if (_searchQuery.trim().isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final matchesQuery = item.title.toLowerCase().contains(query) ||
            item.description.toLowerCase().contains(query) ||
            item.status.toLowerCase().contains(query) ||
            (item.client?.name.toLowerCase().contains(query) ?? false) ||
            (item.lawyer?.name.toLowerCase().contains(query) ?? false);
        if (!matchesQuery) return false;
      }
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cases'),
      ),
      body: dashboard.isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Top Banner
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.secondary.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.secondary),
                          ),
                          child: const Text(
                            'REGISTRY CASES LIST',
                            style: TextStyle(
                              color: AppTheme.secondary,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.1,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Cases',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Select any registered case title below to inspect matter specifications.',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Case Title Filter Chips Card
                  Card(
                    elevation: 1,
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
                              Text(
                                '📁 REGISTERED CASE TITLES (${cases.length})',
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.black,
                                  color: AppTheme.textMuted,
                                  letterSpacing: 0.8,
                                ),
                              ),
                              if (_selectedCaseId != 'ALL')
                                TextButton(
                                  onPressed: () => setState(() => _selectedCaseId = 'ALL'),
                                  child: const Text(
                                    'Show All',
                                    style: TextStyle(
                                      color: AppTheme.secondary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              ChoiceChip(
                                label: Text('📋 All Cases (${cases.length})'),
                                selected: _selectedCaseId == 'ALL',
                                selectedColor: AppTheme.primary,
                                labelStyle: TextStyle(
                                  color: _selectedCaseId == 'ALL' ? Colors.white : AppTheme.textDark,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                                onSelected: (bool selected) {
                                  if (selected) {
                                    setState(() => _selectedCaseId = 'ALL');
                                  }
                                },
                              ),
                              ...cases.map((c) {
                                final isSelected = _selectedCaseId == c.id;
                                return ChoiceChip(
                                  label: Text(
                                    '⚖️ ${c.title}',
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  selected: isSelected,
                                  selectedColor: AppTheme.secondary,
                                  labelStyle: TextStyle(
                                    color: isSelected ? Colors.white : AppTheme.textDark,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11,
                                  ),
                                  onSelected: (bool selected) {
                                    setState(() {
                                      _selectedCaseId = selected ? c.id : 'ALL';
                                    });
                                  },
                                );
                              }),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Search Bar
                  TextField(
                    controller: _searchController,
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: const TextStyle(color: AppTheme.textDark, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Search case titles, clients, or counsel...',
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
                        borderSide: const BorderSide(color: AppTheme.border),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Table matching exact layout from screenshot
                  if (filteredCases.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(32),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.border),
                      ),
                      child: const Text(
                        'No cases matched your search.',
                        style: TextStyle(color: AppTheme.textMuted, fontStyle: FontStyle.italic, fontSize: 14),
                      ),
                    )
                  : SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Card(
                        elevation: 1,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                          side: const BorderSide(color: AppTheme.border),
                        ),
                        child: DataTable(
                          headingRowColor: WidgetStateProperty.all(Colors.grey.shade100),
                          dataRowMinHeight: 65,
                          dataRowMaxHeight: 80,
                          horizontalMargin: 16,
                          columnSpacing: 24,
                          columns: const [
                            DataColumn(
                              label: Text(
                                'CASE TITLE',
                                style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'CLIENT',
                                style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'COUNSEL',
                                style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'STATUS',
                                style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'DATE',
                                style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                            DataColumn(
                              label: Text(
                                'ACTION',
                                style: TextStyle(color: AppTheme.textMuted, fontWeight: FontWeight.bold, fontSize: 11),
                              ),
                            ),
                          ],
                          rows: filteredCases.map((c) {
                            final dateStr = c.createdAt != null && c.createdAt!.length >= 10
                                ? c.createdAt!.substring(0, 10)
                                : 'N/A';

                            return DataRow(
                              cells: [
                                // 1. CASE TITLE
                                DataCell(
                                  SizedBox(
                                    width: 160,
                                    child: Text(
                                      c.title,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 13,
                                        color: AppTheme.primary,
                                      ),
                                    ),
                                  ),
                                ),
                                // 2. CLIENT
                                DataCell(
                                  Text(
                                    c.client?.name ?? 'N/A',
                                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
                                  ),
                                ),
                                // 3. COUNSEL
                                DataCell(
                                  Text(
                                    c.lawyer?.name ?? 'Unassigned',
                                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
                                  ),
                                ),
                                // 4. STATUS
                                DataCell(StatusChip(status: c.status)),
                                // 5. DATE
                                DataCell(
                                  Text(
                                    dateStr,
                                    style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                                  ),
                                ),
                                // 6. ACTION
                                DataCell(
                                  ElevatedButton(
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => CaseDetailScreen(caseModel: c),
                                        ),
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.primary,
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    child: const Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text('View', style: TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.bold)),
                                        SizedBox(width: 4),
                                        Icon(Icons.chevron_right, size: 14, color: Colors.white),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                ],
              ),
            ),
    );
  }
}
