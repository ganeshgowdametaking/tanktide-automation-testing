export interface CompanySignupData {
  email: string;
  companyName: string;
  website: string;
  password: string;
}

export interface ReferralData {
  title: string;
  company: string;
  department: string;
  location: string;
  description: string;
  skills: string[];
}

function idSuffix(): string {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 7);
  return `${ts}${rnd}`;
}

export function buildCompanySignupData(): CompanySignupData {
  const suffix = idSuffix();
  return {
    email: `qa+${suffix}@gmail.com`,
    companyName: `TankTide QA ${suffix}`,
    website: `https://qa-${suffix}.example.com`,
    password: `TankTide!${suffix.slice(-6)}A1`
  };
}

export function buildReferralData(): ReferralData {
  const suffix = idSuffix();
  return {
    title: `QA Automation Engineer ${suffix}`,
    company: `TankTide Labs ${suffix.slice(0, 4)}`,
    department: 'Engineering',
    location: 'Remote',
    description:
      'Build and maintain reliable E2E automation. Work with product and engineering to improve release quality and reduce escaped defects.',
    skills: ['Playwright', 'TypeScript', 'CI/CD', 'API Testing']
  };
}
