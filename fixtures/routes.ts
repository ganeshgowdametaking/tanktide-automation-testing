export type RouteExpectation = {
  path: string;
  name: string;
};

export const publicRoutes: RouteExpectation[] = [
  { path: '/', name: 'Home' },
  { path: '/privacy-policy', name: 'Privacy Policy' },
  { path: '/cookie-policy', name: 'Cookie Policy' },
  { path: '/terms', name: 'Terms' },
  { path: '/data-request', name: 'Data Request' },
  { path: '/reset-password', name: 'Reset Password' }
];

export const authenticatedRoutes: RouteExpectation[] = [
  { path: '/analytics', name: 'Analytics' },
  { path: '/jobs', name: 'Jobs' },
  { path: '/create-referral', name: 'Create Referral' },
  { path: '/messages', name: 'Messages' },
  { path: '/notifications', name: 'Notifications' },
  { path: '/profile', name: 'Profile' },
  { path: '/settings', name: 'Settings' }
];

export const companyRoutes: RouteExpectation[] = [
  { path: '/company-dashboard', name: 'Company Dashboard' },
  { path: '/company-hiring/jobs', name: 'Company Jobs' },
  { path: '/company-hiring/new', name: 'Company New Job' },
  { path: '/company-hiring/applicants', name: 'Company Applicants' },
  { path: '/company-referrals/incoming', name: 'Incoming Referrals' },
  { path: '/company-referrals/outgoing', name: 'Outgoing Invites' },
  { path: '/company-referrals/partners', name: 'Partners' },
  { path: '/company-referrals/invite', name: 'Invite Partner' },
  { path: '/company-profile/branding', name: 'Company Branding' },
  { path: '/company-profile/careers', name: 'Careers Page' },
  { path: '/company-profile/team', name: 'Team' },
  { path: '/company-profile/integrations', name: 'Integrations' },
  { path: '/company-settings/account', name: 'Company Account Settings' },
  { path: '/company-settings/notifications', name: 'Company Notification Settings' },
  { path: '/company-settings/help', name: 'Company Help' },
  { path: '/company-dashboard/activity', name: 'Recent Activity' },
  { path: '/company-dashboard/actions', name: 'Quick Actions' }
];
