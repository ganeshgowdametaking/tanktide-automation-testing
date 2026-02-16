export const publicRoutes = [
  { path: '/', name: 'Home' },
  { path: '/privacy-policy', name: 'Privacy Policy' },
  { path: '/cookie-policy', name: 'Cookie Policy' },
  { path: '/terms', name: 'Terms' },
  { path: '/data-request', name: 'Data Request' },
  { path: '/companies', name: 'Companies Landing' },
  { path: '/company-signup', name: 'Company Signup' },
  { path: '/company-login', name: 'Company Login' }
] as const;

export const protectedRoutes = [
  { path: '/jobs', name: 'Jobs' },
  { path: '/create-referral', name: 'Create Referral' },
  { path: '/messages', name: 'Messages' },
  { path: '/notifications', name: 'Notifications' },
  { path: '/profile', name: 'Profile' },
  { path: '/settings', name: 'Settings' },
  { path: '/analytics', name: 'Analytics' }
] as const;
