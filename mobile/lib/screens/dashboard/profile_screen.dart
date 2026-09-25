import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';
import '../../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _dobController = TextEditingController();
  final _nationalIdController = TextEditingController();
  final _addressController = TextEditingController();
  final _otherInfoController = TextEditingController();

  bool _isLoading = true;
  bool _isSubmittingProfile = false;

  // Embedded Case Request State
  final _caseTitleController = TextEditingController();
  final _caseDescController = TextEditingController();
  String _caseCategory = 'LITIGATION';
  String _caseSubCategory = 'Commercial Litigation';
  bool _isSubmittingCase = false;

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

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiService.get('/users/profile');
      if (res is Map && mounted) {
        _nameController.text = res['name'] ?? '';
        _phoneController.text = res['phone'] ?? '';
        _dobController.text = res['dateOfBirth'] != null ? res['dateOfBirth'].toString().split('T')[0] : '';
        _nationalIdController.text = res['nationalId'] ?? '';
        _addressController.text = res['address'] ?? '';
        _otherInfoController.text = res['otherInfo'] ?? '';
      }
    } catch (e) {
      debugPrint('Error fetching profile: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleSaveProfile() async {
    setState(() => _isSubmittingProfile = true);
    try {
      await ApiService.patch('/users/profile', {
        'name': _nameController.text.trim(),
        'phone': _phoneController.text.trim(),
        'dateOfBirth': _dobController.text.trim(),
        'nationalId': _nationalIdController.text.trim(),
        'address': _addressController.text.trim(),
        'otherInfo': _otherInfoController.text.trim(),
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile details saved successfully!'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update profile: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmittingProfile = false);
    }
  }

  Future<void> _handleCreateCase() async {
    final title = _caseTitleController.text.trim();
    final desc = _caseDescController.text.trim();
    if (title.isEmpty || desc.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter title and description for legal request.')),
      );
      return;
    }

    setState(() => _isSubmittingCase = true);
    try {
      final provider = Provider.of<DashboardProvider>(context, listen: false);
      await provider.createCase(
        title: title,
        description: desc,
        category: _caseCategory,
        subCategory: _caseSubCategory,
      );
      _caseTitleController.clear();
      _caseDescController.clear();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Legal matter created & submitted successfully!'), backgroundColor: AppTheme.primary),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to submit legal request: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmittingCase = false);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _dobController.dispose();
    _nationalIdController.dispose();
    _addressController.dispose();
    _otherInfoController.dispose();
    _caseTitleController.dispose();
    _caseDescController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    return Scaffold(
      appBar: AppBar(title: const Text('Client Profile & Case Requests')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Profile Header Banner
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppTheme.primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 28,
                          backgroundColor: AppTheme.secondary,
                          child: Text(
                            (user?.name ?? 'C').substring(0, 1).toUpperCase(),
                            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                user?.name ?? 'Client Profile',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                user?.email ?? '',
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Role: CLIENT / LEGAL USER',
                                style: TextStyle(color: AppTheme.secondary, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Personal Details Form
                  const Text(
                    'Personal & Identity Information',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Keep your contact and national identity records up to date.',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 16),

                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          TextField(
                            controller: _nameController,
                            decoration: const InputDecoration(labelText: 'Full Legal Name *'),
                          ),
                          const SizedBox(height: 14),
                          TextField(
                            controller: _phoneController,
                            keyboardType: TextInputType.phone,
                            decoration: const InputDecoration(labelText: 'Phone Number (WhatsApp)'),
                          ),
                          const SizedBox(height: 14),
                          TextField(
                            controller: _dobController,
                            decoration: const InputDecoration(labelText: 'Date of Birth (YYYY-MM-DD)'),
                          ),
                          const SizedBox(height: 14),
                          TextField(
                            controller: _nationalIdController,
                            decoration: const InputDecoration(labelText: 'National ID / NIN / Passport Number'),
                          ),
                          const SizedBox(height: 14),
                          TextField(
                            controller: _addressController,
                            maxLines: 2,
                            decoration: const InputDecoration(labelText: 'Residential Address'),
                          ),
                          const SizedBox(height: 14),
                          TextField(
                            controller: _otherInfoController,
                            maxLines: 2,
                            decoration: const InputDecoration(labelText: 'Other Helpful Details (Occupation, Spouse, etc.)'),
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isSubmittingProfile ? null : _handleSaveProfile,
                              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.secondary),
                              child: _isSubmittingProfile
                                  ? const CircularProgressIndicator(color: Colors.white)
                                  : const Text('Save Profile Details'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Embedded Open Matter / Request Counsel Section
                  const Text(
                    'Open New Matter / Request Counsel',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primary),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Directly request legal representation for Litigation or General / Retainer / Property matters.',
                    style: TextStyle(fontSize: 12, color: AppTheme.textMuted),
                  ),
                  const SizedBox(height: 16),

                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Matter Category',
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.primary),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Expanded(
                                child: InkWell(
                                  onTap: () {
                                    setState(() {
                                      _caseCategory = 'LITIGATION';
                                      _caseSubCategory = _subCategories['LITIGATION']!.first;
                                    });
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                                    decoration: BoxDecoration(
                                      color: _caseCategory == 'LITIGATION' ? AppTheme.primary : Colors.grey.shade100,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Column(
                                      children: [
                                        Icon(Icons.gavel, color: _caseCategory == 'LITIGATION' ? Colors.white : AppTheme.primary),
                                        const SizedBox(height: 4),
                                        Text(
                                          '⚖️ Litigation',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: _caseCategory == 'LITIGATION' ? Colors.white : AppTheme.textDark,
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
                                      _caseCategory = 'GENERAL';
                                      _caseSubCategory = _subCategories['GENERAL']!.first;
                                    });
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                                    decoration: BoxDecoration(
                                      color: _caseCategory == 'GENERAL' ? AppTheme.secondary : Colors.grey.shade100,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Column(
                                      children: [
                                        Icon(Icons.business_center, color: _caseCategory == 'GENERAL' ? Colors.white : AppTheme.secondary),
                                        const SizedBox(height: 4),
                                        Text(
                                          '🏛️ General/Retainer',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: _caseCategory == 'GENERAL' ? Colors.white : AppTheme.textDark,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          DropdownButtonFormField<String>(
                            value: _caseSubCategory,
                            decoration: const InputDecoration(labelText: 'Specific Practice Sub-Type'),
                            items: _subCategories[_caseCategory]!
                                .map((sub) => DropdownMenuItem(value: sub, child: Text(sub)))
                                .toList(),
                            onChanged: (val) {
                              if (val != null) setState(() => _caseSubCategory = val);
                            },
                          ),
                          const SizedBox(height: 14),

                          TextField(
                            controller: _caseTitleController,
                            decoration: InputDecoration(
                              labelText: _caseCategory == 'LITIGATION'
                                  ? 'Matter Title (e.g. Commercial Suit No. B/104)'
                                  : 'Matter Title (e.g. Real Estate Acquisition & Tax)',
                            ),
                          ),
                          const SizedBox(height: 14),

                          TextField(
                            controller: _caseDescController,
                            maxLines: 3,
                            decoration: const InputDecoration(labelText: 'Detailed Instructions & Background'),
                          ),
                          const SizedBox(height: 20),

                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: _isSubmittingCase ? null : _handleCreateCase,
                              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary),
                              child: _isSubmittingCase
                                  ? const CircularProgressIndicator(color: Colors.white)
                                  : const Text('Submit Legal Request'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
