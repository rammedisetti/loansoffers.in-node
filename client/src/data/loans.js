/**
 * Loan product copy, mirroring the original Django loan templates.
 * `slug` matches the backend loan_types slug so live APR can be joined in.
 */

export const LOANS = [
  {
    slug: 'personal-loan',
    badge: 'Personal Loan',
    name: 'Personal Loan',
    h1: 'Tailor-made Personal Loans with Instant Approval',
    intro:
      'Quick credit at competitive rates for any life goal—holidays, education, debt consolidation, and more.',
    whyHeading: 'Why Banks Offer Personal Loans',
    whyParagraph:
      'Get flexible repayment terms and instant eligibility checks with minimal documentation.',
    features: [
      'Instant eligibility and approval decisions',
      'No end-use restrictions or conditions',
      'Transparent rates with no hidden fees',
      'Competitive tenure options',
    ],
    bestForHeading: 'Ideal For',
    bestFor: [
      'Vacation and leisure plans',
      'Medical and emergency expenses',
      'Home improvement and renovation',
      'Debt consolidation',
    ],
    requirementsHeading: 'Common Documents',
    requirements: [
      'KYC and address proof',
      '3 months bank statements',
      'Salary slip or IT returns',
      'Employment/business proof',
    ],
  },
  {
    slug: 'home-loan',
    badge: 'Home Loan',
    name: 'Home Loan',
    h1: 'Own Your Dream Home with Confidence',
    intro:
      'Compare home loan plans, optimize EMIs, and move into your new home with the right financing structure.',
    whyHeading: 'Benefits You Can Expect',
    whyParagraph:
      'Choose from lender options designed for first-time buyers, balance transfer seekers, and home upgraders.',
    features: [
      'Attractive interest rates and longer tenure',
      'High loan eligibility options',
      'Support for new purchase or resale',
      'Balance transfer assistance',
    ],
    bestForHeading: 'Ideal For',
    bestFor: [
      'First home purchase',
      'Resale property purchase',
      'House construction',
      'Home balance transfer',
    ],
    requirementsHeading: 'Required Documents',
    requirements: [
      'KYC and address proof',
      'Income proof and bank statement',
      'Property documents',
      'Employment/business proof',
    ],
  },
  {
    slug: 'business-loan',
    badge: 'Business Loan',
    name: 'Business Loan',
    h1: 'Capital Support to Scale and Strengthen Your Business',
    intro:
      'From inventory and operations to expansion and hiring, get funding that keeps your growth plans on track.',
    whyHeading: 'Why Businesses Prefer This Loan',
    whyParagraph:
      'Access lender options with faster turnarounds and repayment structures aligned to business cash flow.',
    features: [
      'Working capital and expansion financing',
      'Quick processing for urgent needs',
      'Structured EMIs for better planning',
      'Flexible terms for SMEs and startups',
    ],
    bestForHeading: 'Funding Use Cases',
    bestFor: [
      'Inventory purchase',
      'Machinery and equipment',
      'Branch expansion',
      'Marketing and working capital',
    ],
    requirementsHeading: 'Typical Documents',
    requirements: [
      'Business registration proof',
      'Bank statements and ITR/GST',
      'KYC of proprietor/directors',
      'Financial statements',
    ],
  },
  {
    slug: 'car-loan',
    badge: 'Car Loan',
    name: 'Car Loan',
    h1: 'Drive Home Faster with Smart Auto Financing',
    intro:
      'Choose the right car loan plan with competitive rates, faster approvals, and repayment options that fit your budget.',
    whyHeading: 'Why This Car Loan Works',
    whyParagraph:
      'Find financing options for new and used cars with assistance at every step, from eligibility to disbursal.',
    features: [
      'Attractive interest rates and tenure choices',
      'Quick approvals with minimal documentation',
      'New and pre-owned vehicle financing',
      'Simple and transparent process',
    ],
    bestForHeading: 'Coverage Includes',
    bestFor: [
      'New car purchase',
      'Used car purchase',
      'Dealer and non-dealer purchase',
      'Flexible down-payment planning',
    ],
    requirementsHeading: 'Basic Requirements',
    requirements: [
      'KYC and address proof',
      'Income proof and bank statement',
      'Vehicle quotation/invoice',
      'Employment/business details',
    ],
  },
  {
    slug: 'education-loan',
    badge: 'Education Loan',
    name: 'Education Loan',
    h1: 'Finance Education Goals in India and Abroad',
    intro:
      'Get student-focused financing for tuition, accommodation, books, and related academic expenses.',
    whyHeading: 'Why Students Choose This Option',
    whyParagraph:
      'Access flexible repayment structures and student-friendly terms from trusted lenders.',
    features: [
      'Coverage for tuition and living expenses',
      'Moratorium options during study period',
      'Funding for domestic and overseas courses',
      'Simple process with guided support',
    ],
    bestForHeading: 'Eligible Programs',
    bestFor: [
      'Undergraduate and postgraduate',
      'Professional and technical courses',
      'Management and medical programs',
      'International university admissions',
    ],
    requirementsHeading: 'Common Documents',
    requirements: [
      'Admission letter and fee structure',
      'Student and co-applicant KYC',
      'Academic records',
      'Income proof of co-applicant',
    ],
  },
  {
    slug: 'gold-loan',
    badge: 'Gold Loan',
    name: 'Gold Loan',
    h1: 'Unlock Instant Funds Against Your Gold Assets',
    intro:
      'Get quick liquidity for personal or business needs with transparent gold valuation and simplified disbursal.',
    whyHeading: 'What Makes This Loan Useful',
    whyParagraph:
      'A practical short-term funding option when speed and convenience matter most.',
    features: [
      'Quick processing and disbursal',
      'Secure and transparent valuation',
      'Flexible repayment options',
      'Simple documentation requirements',
    ],
    bestForHeading: 'Use Cases',
    bestFor: [
      'Emergency medical costs',
      'Short-term business cash needs',
      'Education and family commitments',
      'Unexpected monthly obligations',
    ],
    requirementsHeading: 'What You Need',
    requirements: [
      'Basic identity and address proof',
      'Ownership gold jewelry',
      'Simple verification process',
      'Contact and bank details',
    ],
  },
  {
    slug: 'plot-loan',
    badge: 'Plot Loan',
    name: 'Plot Loan',
    h1: 'Secure Land Ownership with Structured Plot Financing',
    intro:
      'Plan your future investment with plot loan options designed for residential and commercial land purchase.',
    whyHeading: 'Advantages of Plot Loan Assistance',
    whyParagraph:
      'Get clarity on eligibility, tenure, and lender options before you make a high-value land decision.',
    features: [
      'Financing support for approved plots',
      'Competitive rates from multiple lenders',
      'Guidance on legal and basic documentation',
      'Flexible repayment planning',
    ],
    bestForHeading: 'Suitable For',
    bestFor: [
      'First-time land buyers',
      'Future home construction plans',
      'Commercial site acquisition',
      'Long-term investment planning',
    ],
    requirementsHeading: 'Document Checklist',
    requirements: [
      'KYC and income proofs',
      'Bank statements',
      'Plot title and sale documents',
      'Approved layout or authority records',
    ],
  },
];

export const LOAN_BY_SLUG = Object.fromEntries(LOANS.map((l) => [l.slug, l]));

export default LOANS;
