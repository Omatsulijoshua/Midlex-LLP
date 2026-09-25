import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/dashboard_provider.dart';

class NewCaseScreen extends StatefulWidget {
  const NewCaseScreen({super.key});

  @override
  State<NewCaseScreen> createState() => _NewCaseScreenState();
}

class _NewCaseScreenState extends State<NewCaseScreen> {
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _category = 'LITIGATION';
  String _subCategory = 'Commercial Litigation';
  bool _isSubmitting = false;

  final Map<String, List<String>> _subCategories = const {
    'LITIGATION': [
      'Commercial Litigation',
      'Civil & Contractual Dispute',
      'Land & Property / Realty Dispute',
      'Criminal Defense',
    ],
    'GENERAL': [
      'Monthly Corporate Retainer',
      'Property / Realty & Real Estate',
      'Tax Advisory & Compliance',
      'Corporate Secretarial Services',
      'General Legal Advisory',
    ],
  };

  Future<void> _handleCreate() async {
    final title = _titleController.text.trim();
    final description = _descriptionController.text.trim();

    if (title.isEmpty || description.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter title and description.')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final provider = Provider.of<DashboardProvider>(context, listen: false);
      await provider.createCase(
        title: title,
        description: description,
        category: _category,
        subCategory: _subCategory,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Legal matter created successfully!')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to create matter: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Open Legal Matter')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Matter Classification',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary),
            ),
            const SizedBox(height: 6),
            const Text(
              'Select whether this is a Litigation court issue or a General / Retainer client matter.',
              style: TextStyle(fontSize: 13, color: AppTheme.textMuted),
            ),
            const SizedBox(height: 16),

            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () {
                      setState(() {
                        _category = 'LITIGATION';
                        _subCategory = _subCategories['LITIGATION']!.first;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                      decoration: BoxDecoration(
                        color: _category == 'LITIGATION' ? AppTheme.primary : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _category == 'LITIGATION' ? AppTheme.primary : Colors.grey.shade300,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.gavel,
                            color: _category == 'LITIGATION' ? Colors.white : AppTheme.primary,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Litigation Issue',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _category == 'LITIGATION' ? Colors.white : AppTheme.textDark,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: () {
                      setState(() {
                        _category = 'GENERAL';
                        _subCategory = _subCategories['GENERAL']!.first;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                      decoration: BoxDecoration(
                        color: _category == 'GENERAL' ? AppTheme.secondary : Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _category == 'GENERAL' ? AppTheme.secondary : Colors.grey.shade300,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.business_center,
                            color: _category == 'GENERAL' ? Colors.white : AppTheme.secondary,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'General / Retainer',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _category == 'GENERAL' ? Colors.white : AppTheme.textDark,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),
            DropdownButtonFormField<String>(
              value: _subCategory,
              decoration: const InputDecoration(labelText: 'Practice Sub-Type'),
              items: _subCategories[_category]!
                  .map((sub) => DropdownMenuItem(value: sub, child: Text(sub)))
                  .toList(),
              onChanged: (val) {
                if (val != null) setState(() => _subCategory = val);
              },
            ),

            const SizedBox(height: 16),
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                labelText: _category == 'LITIGATION' ? 'Case Title (e.g. Land Dispute)' : 'Matter Title (e.g. Monthly Tax Advisory)',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Matter Overview & Instructions'),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _handleCreate,
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Submit Legal Request'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
