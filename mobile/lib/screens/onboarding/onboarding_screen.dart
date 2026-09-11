import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../services/storage_service.dart';
import '../auth/login_screen.dart';
import '../public/home_screen.dart';

class OnboardingPageModel {
  final String badge;
  final String title;
  final String description;
  final IconData icon;
  final Color accentColor;

  OnboardingPageModel({
    required this.badge,
    required this.title,
    required this.description,
    required this.icon,
    required this.accentColor,
  });
}

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    StorageService.setHasSeenOnboarding();
  }

  final List<OnboardingPageModel> _pages = [
    OnboardingPageModel(
      badge: 'PREMIER LEGAL ADVISORY',
      title: 'Sophisticated Legal Representation',
      description:
          'Access elite advocacy in Corporate Law, Litigation, Commercial Transactions, and Property Development across Nigeria.',
      icon: Icons.gavel_rounded,
      accentColor: AppTheme.secondary,
    ),
    OnboardingPageModel(
      badge: '24/7 AI & SENIOR COUNSEL',
      title: 'Instant Legal Guidance & Human Takeover',
      description:
          'Consult with our Midlex AI Assistant anytime, with direct takeover by senior barristers and solicitors whenever specialized counsel is needed.',
      icon: Icons.smart_toy_rounded,
      accentColor: const Color(0xFF3B82F6),
    ),
    OnboardingPageModel(
      badge: 'TRANSPARENT CLIENT PORTAL',
      title: 'Case Tracking & Shared Files',
      description:
          'Track active case updates in real-time, view scheduled court dates, share public document links, and audit financial payments seamlessly.',
      icon: Icons.folder_shared_rounded,
      accentColor: const Color(0xFF10B981),
    ),
  ];

  Future<void> _completeOnboarding(Widget targetScreen) async {
    await StorageService.setHasSeenOnboarding();
    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => targetScreen),
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLastPage = _currentPage == _pages.length - 1;

    return Scaffold(
      backgroundColor: AppTheme.primary,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar with Logo and Skip Button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                        child: Image.asset(
                          'assets/images/logo.jpg',
                          height: 28,
                          width: 28,
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(Icons.gavel, size: 24, color: AppTheme.primary),
                        ),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'MIDLEX LLP',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ],
                  ),
                  if (!isLastPage)
                    TextButton(
                      onPressed: () => _completeOnboarding(const LoginScreen()),
                      child: const Text(
                        'Skip',
                        style: TextStyle(
                          color: AppTheme.secondary,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // Main Page Content
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemCount: _pages.length,
                itemBuilder: (context, index) {
                  final item = _pages[index];
                  return Padding(
                    padding: const EdgeInsets.all(28.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Central Visual Icon Badge
                        Container(
                          width: 140,
                          height: 140,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: item.accentColor.withValues(alpha: 0.15),
                            border: Border.all(
                              color: item.accentColor,
                              width: 2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: item.accentColor.withValues(alpha: 0.3),
                                blurRadius: 30,
                                spreadRadius: 4,
                              ),
                            ],
                          ),
                          child: Icon(
                            item.icon,
                            size: 70,
                            color: item.accentColor,
                          ),
                        ),
                        const SizedBox(height: 36),

                        // Subhead Badge
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: item.accentColor.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: item.accentColor.withValues(alpha: 0.5)),
                          ),
                          child: Text(
                            item.badge,
                            style: TextStyle(
                              color: item.accentColor,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Title
                        Text(
                          item.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            height: 1.2,
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Description
                        Text(
                          item.description,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Color(0xFFD1D5DB),
                            fontSize: 14,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Page Indicator Dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  height: 8,
                  width: _currentPage == index ? 28 : 8,
                  decoration: BoxDecoration(
                    color: _currentPage == index
                        ? AppTheme.secondary
                        : Colors.white.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 28),

            // Bottom Buttons
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: isLastPage
                  ? Column(
                      children: [
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: () => _completeOnboarding(const LoginScreen()),
                            icon: const Icon(Icons.login),
                            label: const Text('Sign In / Register Account'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.secondary,
                              foregroundColor: AppTheme.textDark,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: () => _completeOnboarding(const HomeScreen()),
                            icon: const Icon(Icons.explore_outlined, color: Colors.white),
                            label: const Text(
                              'Explore App as Guest',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Colors.white),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                          ),
                        ),
                      ],
                    )
                  : SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          _pageController.nextPage(
                            duration: const Duration(milliseconds: 400),
                            curve: Curves.easeInOut,
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.secondary,
                          foregroundColor: AppTheme.textDark,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Next', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward),
                          ],
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
