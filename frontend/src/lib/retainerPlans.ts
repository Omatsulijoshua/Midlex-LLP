export type RetainerSchedule = {
  label: string;
  amount: number;
  total?: number;
};

export type RetainerPlan = {
  id: string;
  name: string;
  duration: string;
  audience: string;
  summary: string;
  discounts: string[];
  coverage: string[];
  exclusions: string[];
  schedules: RetainerSchedule[];
};

export const RETAINER_PLANS: RetainerPlan[] = [
  {
    id: 'individual', name: 'Individual Retainer', duration: '1 year',
    audience: 'Individuals and personal legal needs',
    summary: 'All-year legal cover for disputes, drafting, counselling and guidance.',
    discounts: ['30% off professional fees', 'Franking of instruments excluded'],
    coverage: ['Civil and criminal disputes', 'Legal drafting and counselling', 'Guidance on knotty legal issues', 'Security agency run-ins within operational jurisdictions'],
    exclusions: ['Pre-existing issues before commencement or outside the term', 'Family matters without direct liability to the registered client', 'Business matters belonging to a separate corporate personality'],
    schedules: [{ label: 'One-off', amount: 400000 }, { label: 'Two installments', amount: 220000, total: 440000 }, { label: 'Quarterly', amount: 120000, total: 480000 }, { label: 'Monthly', amount: 45000, total: 540000 }],
  },
  {
    id: 'biz-pro', name: 'Biz-Pro Retainer', duration: '1 year',
    audience: 'Professionals and business owners',
    summary: 'Personal cover extended to business and professional issues, with an attorney on call.',
    discounts: ['50% off professional fees', 'Franking of instruments excluded'],
    coverage: ['Individual retainer benefits', 'Business and professional matters', 'On-call legal support'],
    exclusions: ['Pre-existing issues before commencement or outside the term', 'Family matters without direct liability', 'Separate corporate matters outside the registered concern'],
    schedules: [{ label: 'One-off', amount: 500000 }, { label: 'Two installments', amount: 270000, total: 540000 }, { label: 'Quarterly', amount: 150000, total: 600000 }, { label: 'Monthly', amount: 60000, total: 720000 }],
  },
  {
    id: 'big-family', name: 'Big Daddy / Big Mummy Group', duration: '2 years',
    audience: 'Registered initiator, family and first-line beneficiaries',
    summary: 'Family cover that also includes the registered initiator’s business concern.',
    discounts: ['40% off professional fees', '20% off approved solicitor services'],
    coverage: ['Registered initiator and first-line beneficiaries', 'Business concern of the registered initiator', 'Family legal support'],
    exclusions: ['Relatives not registered as first-line beneficiaries', 'Undisclosed pre-existing issues', 'Matters likely to exceed the coverage term may be charged pro-rata'],
    schedules: [{ label: 'Year 1 one-off', amount: 800000 }, { label: 'Year 1 installments', amount: 450000, total: 900000 }, { label: 'Year 2 one-off', amount: 400000 }, { label: 'Year 2 installments', amount: 250000, total: 500000 }],
  },
  {
    id: 'sme', name: 'SME Group Retainer', duration: '1 year',
    audience: 'Business owners and teams of up to 10 staff',
    summary: 'Business and individual cover for registered owners, staff and registered first-line beneficiaries.',
    discounts: ['40% off professional fees', '40% off approved solicitor services'],
    coverage: ['Registered business owners', 'Up to 10 registered staff', 'Business and individual concerns of beneficiaries'],
    exclusions: ['Members not registered as first-line beneficiaries', 'Undisclosed pre-existing issues', 'Matters likely to exceed the coverage term may be charged pro-rata'],
    schedules: [{ label: 'One-off', amount: 600000 }, { label: 'Two installments', amount: 350000, total: 700000 }, { label: 'Quarterly', amount: 200000, total: 800000 }, { label: 'Monthly', amount: 80000, total: 960000 }],
  },
  {
    id: 'family', name: 'Comprehensive Family', duration: '3 years',
    audience: 'Families, dependants and registered beneficiaries',
    summary: 'Family legal protection with a dedicated helpline, family lawyer and quarterly interphase sessions.',
    discounts: ['50% off professional fees', '40% off approved solicitor services'],
    coverage: ['Registered family members and dependants', 'Dedicated help line and family lawyer', 'Business concerns of beneficiaries', 'Quarterly legal interphase sessions'],
    exclusions: ['Unidentified friends and acquaintances', 'Unregistered relatives or family', 'Undisclosed pre-existing issues', 'Matters likely to exceed the coverage term may be charged pro-rata'],
    schedules: [{ label: 'Year 1 one-off', amount: 1000000 }, { label: 'Year 1 installments', amount: 600000, total: 1200000 }, { label: 'Year 2/3 one-off', amount: 500000 }, { label: 'Year 2/3 monthly', amount: 55000, total: 660000 }],
  },
  {
    id: 'corporate', name: 'Comprehensive Corporate', duration: '5 years',
    audience: 'Companies, industries and professional bodies',
    summary: 'Boardroom-to-contract legal assurance with advisory, research and secretarial support.',
    discounts: ['20% off professional fees', '10% off approved solicitor services'],
    coverage: ['Contract and legal impact assessments', 'Investment and promotional advertising counsel', 'Secretarial extension services', 'Non-voting meeting attendance and on-demand analysis', 'Monthly legal interphase sessions'],
    exclusions: ['Unregistered subsidiaries with distinct corporate identities', 'Political parties and protest civil engagements'],
    schedules: [{ label: 'Years 1–2 one-off', amount: 2000000 }, { label: 'Years 1–2 installments', amount: 1200000, total: 2400000 }, { label: 'Years 3–4 one-off', amount: 1500000 }, { label: 'Year 5 one-off', amount: 1000000 }],
  },
  {
    id: 'premium-life', name: 'Premium Life', duration: '10 years',
    audience: 'Clients seeking broad personal, family, corporate and political cover',
    summary: 'Long-term cover with dedicated counsel and an estate benefit after the registered client’s demise.',
    discounts: ['50% off professional fees', '50% off approved solicitor services', 'Estate receives 50% discount in perpetuity'],
    coverage: ['Personal, family and corporate legal cover', 'Political engagements subject to the plan terms', 'Dedicated pool of attorneys and staff', 'Estate continuity benefit'],
    exclusions: ['Electoral campaign breaches and election petitions are separately assessed', 'Other political engagements outside the stated individual campaign and post-election services'],
    schedules: [{ label: 'Years 1–3 one-off', amount: 3500000 }, { label: 'Years 1–3 installments', amount: 2000000, total: 4000000 }, { label: 'Years 4–7 one-off', amount: 3000000 }, { label: 'Years 8–10 one-off', amount: 2500000 }],
  },
  {
    id: 'equity-premium', name: 'Equity Premium', duration: 'Perpetual service option',
    audience: 'Eligible corporate start-ups',
    summary: 'A start-up arrangement where the firm receives a 10% equity stake instead of cash retainer fees.',
    discounts: ['10% equity allocation by shares', 'Terms require a separate executed agreement'],
    coverage: ['Board meeting attendance', 'Potential directive or secretarial roles', 'Voting rights in statutory meetings', 'Partner-level involvement subject to agreement'],
    exclusions: ['Eligibility and governance rights must be confirmed in the executed agreement'],
    schedules: [{ label: 'Cash retainer fee', amount: 0 }],
  },
];

export const RETAINER_NOTICE = 'Coverage begins after payment and the executed Retainer Client onboarding form. Brochure pricing is indicative and final terms are governed by the signed retainer arrangement.';

export const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;
