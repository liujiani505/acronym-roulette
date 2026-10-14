/**
 * Curated, hand-written glossary. Nothing here is AI-generated.
 *
 * 15 widely used, publicly documented acronyms. Three of them (BU, PE, CPA)
 * carry two real meanings, so they get one card per context: the same
 * letters, a different room, a different answer.
 *
 * Expansions mark the letters that form the acronym with [brackets] so the
 * reveal can light them up.
 */

export interface Meaning {
  acronym: string;
  /** e.g. "[B]usiness [U]nit" */
  expansion: string;
}

export const GLOSSARY = {
  'bu-university': { acronym: 'BU', expansion: '[B]oston [U]niversity' },
  'bu-business': { acronym: 'BU', expansion: '[B]usiness [U]nit' },
  'pe-private-equity': { acronym: 'PE', expansion: '[P]rivate [E]quity' },
  'pe-ratio': { acronym: 'PE', expansion: '[P]rice-to-[E]arnings ratio' },
  'cpa-accountant': { acronym: 'CPA', expansion: '[C]ertified [P]ublic [A]ccountant' },
  'cpa-acquisition': { acronym: 'CPA', expansion: '[C]ost [P]er [A]cquisition' },
  etf: { acronym: 'ETF', expansion: '[E]xchange-[T]raded [F]und' },
  apr: { acronym: 'APR', expansion: '[A]nnual [P]ercentage [R]ate' },
  apy: { acronym: 'APY', expansion: '[A]nnual [P]ercentage [Y]ield' },
  cd: { acronym: 'CD', expansion: '[C]ertificate of [D]eposit' },
  roi: { acronym: 'ROI', expansion: '[R]eturn [o]n [I]nvestment' },
  eps: { acronym: 'EPS', expansion: '[E]arnings [P]er [S]hare' },
  ipo: { acronym: 'IPO', expansion: '[I]nitial [P]ublic [O]ffering' },
  ach: { acronym: 'ACH', expansion: '[A]utomated [C]learing [H]ouse' },
  kpi: { acronym: 'KPI', expansion: '[K]ey [P]erformance [I]ndicator' },
  aum: { acronym: 'AUM', expansion: '[A]ssets [U]nder [M]anagement' },
  ytd: { acronym: 'YTD', expansion: '[Y]ear [t]o [D]ate' },
  eod: { acronym: 'EOD', expansion: '[E]nd [o]f [D]ay' },
} as const satisfies Record<string, Meaning>;

export type MeaningId = keyof typeof GLOSSARY;

export interface Card {
  id: string;
  acronym: string;
  /** Short room label shown above the poster. */
  room: string;
  /** The sentence that gives the acronym its meaning. */
  context: string;
  answer: MeaningId;
  /**
   * Wrong choices. A MeaningId pulls a real meaning from the glossary (used
   * for the ambiguous cards, where the trap is the other true meaning).
   * A plain string is an invented decoy.
   */
  decoys: [MeaningId | string, MeaningId | string];
  /** One short line on why the context points to the answer. */
  why: string;
}

export const CARDS: Card[] = [
  // ── Ambiguous pairs ───────────────────────────────────────────
  {
    id: 'bu-campus',
    acronym: 'BU',
    room: 'Campus',
    context: 'She got into BU and is moving to Commonwealth Avenue this fall.',
    answer: 'bu-university',
    decoys: ['bu-business', 'Budget Update'],
    why: 'Admissions plus Commonwealth Avenue puts you on the Boston University campus.',
  },
  {
    id: 'bu-office',
    acronym: 'BU',
    room: 'Org chart',
    context: 'Each BU owns its own P&L and reports results to the CFO.',
    answer: 'bu-business',
    decoys: ['bu-university', 'Budget Utilization'],
    why: 'A unit with its own profit and loss inside a company is a business unit.',
  },
  {
    id: 'pe-deal',
    acronym: 'PE',
    room: 'Deal news',
    context: 'A PE firm bought the retailer and took it private.',
    answer: 'pe-private-equity',
    decoys: ['pe-ratio', 'Public Exchange'],
    why: 'Firms that buy companies and take them off the stock market are private equity.',
  },
  {
    id: 'pe-valuation',
    acronym: 'PE',
    room: 'Stock screener',
    context: 'At a PE of 40, the stock looks pricey next to its peers.',
    answer: 'pe-ratio',
    decoys: ['pe-private-equity', 'Projected Earnings'],
    why: 'A number you compare across stocks is the price-to-earnings ratio, often written P/E.',
  },
  {
    id: 'cpa-taxes',
    acronym: 'CPA',
    room: 'Tax season',
    context: 'Her CPA filed an extension before the April deadline.',
    answer: 'cpa-accountant',
    decoys: ['cpa-acquisition', 'Corporate Pension Account'],
    why: 'A person who files your taxes is a certified public accountant.',
  },
  {
    id: 'cpa-ads',
    acronym: 'CPA',
    room: 'Marketing review',
    context: 'The campaign’s CPA fell to $12 per new customer.',
    answer: 'cpa-acquisition',
    decoys: ['cpa-accountant', 'Clicks Per Ad'],
    why: 'Dollars per new customer is a marketing metric: cost per acquisition.',
  },
  // ── Singles ───────────────────────────────────────────────────
  {
    id: 'etf',
    acronym: 'ETF',
    room: 'Brokerage app',
    context: 'He bought an ETF that tracks the S&P 500 and trades all day like a stock.',
    answer: 'etf',
    decoys: ['Electronic Funds Transfer', 'Equity Trust Fund'],
    why: 'A fund that trades on an exchange during the day is an exchange-traded fund. (EFT is the bank transfer.)',
  },
  {
    id: 'apr',
    acronym: 'APR',
    room: 'Credit card fine print',
    context: 'The card’s APR kicks in if you carry a balance past the due date.',
    answer: 'apr',
    decoys: ['Annual Percentage Return', 'Average Payment Ratio'],
    why: 'The yearly cost of borrowing on a card is the annual percentage rate.',
  },
  {
    id: 'apy',
    acronym: 'APY',
    room: 'Savings account',
    context: 'The account’s APY already includes the effect of compounding.',
    answer: 'apy',
    decoys: ['Average Portfolio Yield', 'Annual Payout Year'],
    why: 'Annual percentage yield is the savings rate with compounding baked in.',
  },
  {
    id: 'cd',
    acronym: 'CD',
    room: 'Bank lobby',
    context: 'The bank’s 12-month CD pays a fixed rate if you don’t withdraw early.',
    answer: 'cd',
    decoys: ['Compact Disc', 'Cash Dividend'],
    why: 'A fixed-term, fixed-rate bank deposit is a certificate of deposit. No music involved.',
  },
  {
    id: 'roi',
    acronym: 'ROI',
    room: 'Budget meeting',
    context: 'The new tool paid for itself in six months. Strong ROI.',
    answer: 'roi',
    decoys: ['Rate of Inflation', 'Revenue on Income'],
    why: 'Paying for itself is about what you got back for what you spent: return on investment.',
  },
  {
    id: 'eps',
    acronym: 'EPS',
    room: 'Earnings call',
    context: 'Quarterly EPS beat analyst estimates by five cents.',
    answer: 'eps',
    decoys: ['Expanded Polystyrene', 'Equity Price Spread'],
    why: 'Analysts estimate profit per share: earnings per share. (Expanded polystyrene is packing foam.)',
  },
  {
    id: 'ipo',
    acronym: 'IPO',
    room: 'Market open',
    context: 'The startup’s IPO priced the night before its shares began trading.',
    answer: 'ipo',
    decoys: ['International Portfolio Order', 'Initial Profit Outlook'],
    why: 'A company selling shares to the public for the first time is an initial public offering.',
  },
  {
    id: 'ach',
    acronym: 'ACH',
    room: 'Payroll',
    context: 'Paychecks arrive by ACH direct deposit every other Friday.',
    answer: 'ach',
    decoys: ['Account Check Hold', 'Automated Cash Handling'],
    why: 'US direct deposits travel over the Automated Clearing House network.',
  },
  {
    id: 'kpi',
    acronym: 'KPI',
    room: 'Quarterly planning',
    context: 'Customer churn is the team’s top KPI this quarter.',
    answer: 'kpi',
    decoys: ['Key Profit Index', 'Known Process Issue'],
    why: 'A metric a team is judged on is a key performance indicator.',
  },
  {
    id: 'aum',
    acronym: 'AUM',
    room: 'Fund fact sheet',
    context: 'The firm reports $50 billion in AUM across its funds.',
    answer: 'aum',
    decoys: ['Annual Unit Margin', 'Accounts Under Maintenance'],
    why: 'The total money a firm invests for clients is assets under management.',
  },
  {
    id: 'ytd',
    acronym: 'YTD',
    room: 'Portfolio statement',
    context: 'The portfolio is up 8% YTD, counting from January 1.',
    answer: 'ytd',
    decoys: ['Yield to Duration', 'Years to Default'],
    why: 'Counting from January 1 to today is year to date.',
  },
  {
    id: 'eod',
    acronym: 'EOD',
    room: 'Team chat',
    context: 'Can you send the revised deck by EOD?',
    answer: 'eod',
    decoys: ['Estimated Order Date', 'Executive Operations Desk'],
    why: 'A deadline in a quick request almost always means end of day.',
  },
];

/** Acronyms whose letters change meaning between cards. */
export const AMBIGUOUS = ['BU', 'PE', 'CPA'] as const;

export function plain(expansion: string): string {
  return expansion.replace(/[[\]]/g, '');
}

export function isMeaningId(value: string): value is MeaningId {
  return Object.prototype.hasOwnProperty.call(GLOSSARY, value);
}
