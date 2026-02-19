import * as fs from 'fs';
import * as path from 'path';
import { test, expect } from '@playwright/test';
import { authenticatedRoutes, companyRoutes, publicRoutes } from '../../../fixtures/routes';

const defaultRouterFile = '/Users/ganeshgowda/Desktop/TankTide/web/src/App.tsx';
const routerFile = process.env.WEB_APP_ROUTER_FILE || defaultRouterFile;

function collectRoutePaths(content: string): string[] {
  const routeRegex = /<Route\s+path="([^"]+)"/g;
  const routes = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = routeRegex.exec(content)) !== null) {
    const route = match[1];
    if (route === '*' || route === '/*') {
      continue;
    }
    routes.add(route);
  }

  return Array.from(routes).sort();
}

test.describe('Route inventory parity @critical @regression', () => {
  test('fixtures route inventory matches web/src/App.tsx route map', async () => {
    test.skip(!fs.existsSync(routerFile), `Router file not found at ${routerFile}`);

    const appTsx = fs.readFileSync(path.resolve(routerFile), 'utf8');
    const appRoutes = collectRoutePaths(appTsx);

    const fixtureRoutes = new Set<string>([
      ...publicRoutes.map(route => route.path),
      ...authenticatedRoutes.map(route => route.path),
      ...companyRoutes.map(route => route.path),
      '/applications/:referralId',
      '/search-results',
      '/user/:userId',
      '/accept-admin-invite',
      '/auth/callback'
    ]);

    const missingInFixtures = appRoutes.filter(route => !fixtureRoutes.has(route));
    const staleInFixtures = Array.from(fixtureRoutes).filter(route => !appRoutes.includes(route));

    expect(missingInFixtures, `Routes in App.tsx missing in fixtures: ${missingInFixtures.join(', ')}`).toEqual([]);
    expect(staleInFixtures, `Routes in fixtures missing in App.tsx: ${staleInFixtures.join(', ')}`).toEqual([]);
  });
});
