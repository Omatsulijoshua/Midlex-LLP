import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/dashboard_provider.dart';
import 'payments_screen.dart';
import 'new_case_screen.dart';

class GeneralRetainerDashboard extends StatelessWidget {
  const GeneralRetainerDashboard({super.key});

  static const plans = [
    ['Individual Retainer', '1 year', '30% professional fee discount'],
    ['Biz-Pro Retainer', '1 year', '50% professional fee discount'],
    ['Big Daddy / Big Mummy', '2 years', 'Family and initiator business cover'],
    ['SME Group Retainer', '1 year', 'Owners and up to 10 staff'],
    [
      'Comprehensive Family',
      '3 years',
      'Family lawyer and quarterly interphase'
    ],
    [
      'Comprehensive Corporate',
      '5 years',
      'Corporate advisory and secretarial support'
    ],
    [
      'Premium Life',
      '10 years',
      'Long-term personal, family and corporate cover'
    ],
    [
      'Equity Premium',
      'Perpetual option',
      '10% equity allocation for eligible start-ups'
    ],
  ];

  @override
  Widget build(BuildContext context) {
    final dashboard = context.watch<DashboardProvider>();
    final claims =
        dashboard.cases.where((item) => item.category == 'GENERAL').toList();
    final openClaims = claims
        .where((item) => !['CLOSED', 'RESOLVED', 'COMPLETED']
            .contains(item.status.toUpperCase()))
        .length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
                colors: [Color(0xFF173D27), Color(0xFF9A6B32)]),
            borderRadius: BorderRadius.circular(22),
          ),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('MIDLEX ROYALTY',
                style: TextStyle(
                    color: Color(0xFFFFE7B0),
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                    fontSize: 11)),
            const SizedBox(height: 10),
            const Text('General Retainer Portal',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 27,
                    fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            const Text(
                'Manage retainer protection, claims, beneficiaries and payments from this General workspace.',
                style: TextStyle(color: Colors.white70, height: 1.4)),
            const SizedBox(height: 16),
            Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: .12),
                    borderRadius: BorderRadius.circular(12)),
                child: const Text(
                    'Coverage begins after payment and the executed Retainer Client onboarding form. Brochure pricing is indicative and final terms are governed by the signed retainer arrangement.',
                    style: TextStyle(
                        color: Colors.white, fontSize: 11, height: 1.45))),
            const SizedBox(height: 16),
            Wrap(spacing: 10, runSpacing: 10, children: [
              ElevatedButton.icon(
                  onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) =>
                              const NewCaseScreen(initialCategory: 'GENERAL'))),
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Submit retainer claim')),
              OutlinedButton.icon(
                  onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => const PaymentsScreen())),
                  icon:
                      const Icon(Icons.payment, size: 16, color: Colors.white),
                  label: const Text('View payments',
                      style: TextStyle(color: Colors.white))),
            ]),
          ]),
        ),
        const SizedBox(height: 16),
        Row(children: [
          _metric('Claims', '${claims.length}'),
          const SizedBox(width: 10),
          _metric('Open', '$openClaims'),
          const SizedBox(width: 10),
          _metric('Payments', '${dashboard.payments.length}'),
        ]),
        const SizedBox(height: 24),
        const Text('Retainer plans',
            style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppTheme.primary)),
        const SizedBox(height: 5),
        const Text(
            'Choose a preferred plan for onboarding. Cover activates after payment and signed terms.',
            style: TextStyle(color: Colors.black54, fontSize: 12)),
        const SizedBox(height: 12),
        ...plans.map((plan) => Card(
              margin: const EdgeInsets.only(bottom: 10),
              elevation: 0,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Color(0xFFE8D7B4))),
              child: ExpansionTile(
                title: Text(plan[0],
                    style: const TextStyle(
                        fontWeight: FontWeight.w800, color: AppTheme.primary)),
                subtitle: Text('${plan[1]} • ${plan[2]}',
                    style: const TextStyle(
                        fontSize: 11, color: Color(0xFF9A6B32))),
                childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                children: [
                  const Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                          'Includes legal advisory and services within the plan terms. Review exclusions, payment schedule and the executed onboarding agreement before activation.',
                          style: TextStyle(
                              fontSize: 12,
                              height: 1.45,
                              color: Colors.black54))),
                  const SizedBox(height: 8),
                  Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                          plan[0] == 'Equity Premium'
                              ? 'Brochure option: 10% equity allocation; separate agreement required.'
                              : 'See the brochure schedule for one-off, installment, quarterly or monthly options.',
                          style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF9A6B32))))
                ],
              ),
            )),
        const SizedBox(height: 14),
        const Text('Recent retainer claims',
            style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppTheme.primary)),
        const SizedBox(height: 10),
        if (claims.isEmpty)
          const Card(
              child: Padding(
                  padding: EdgeInsets.all(18),
                  child: Text(
                      'No general retainer claims yet. Submit a request when you need legal support.'))),
        ...claims.take(5).map((claim) {
          return Card(
            child: ListTile(
              title: Text(claim.title,
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text(
                  '${claim.description}\nTeam: ${claim.litigationTeam.isEmpty ? 'Awaiting admin allocation' : claim.litigationTeam}',
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis),
              trailing: Text(claim.status,
                  style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF9A6B32))),
            ),
          );
        }),
      ]),
    );
  }

  Widget _metric(String label, String value) => Expanded(
      child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE8D7B4))),
          child:
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label.toUpperCase(),
                style: const TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w900,
                    color: Colors.black45)),
            const SizedBox(height: 6),
            Text(value,
                style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w900,
                    color: AppTheme.primary))
          ])));
}
