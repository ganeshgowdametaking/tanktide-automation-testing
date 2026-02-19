#!/usr/bin/env node
import fs from 'fs';

const appPath = process.argv[2];
if (!appPath) {
  console.error('Usage: node scripts/generate-routes.mjs /absolute/path/to/App.tsx');
  process.exit(1);
}

const content = fs.readFileSync(appPath, 'utf8');
const routeRegex = /<Route\s+path=\"([^\"]+)\"/g;
const routes = new Set();
let match;

while ((match = routeRegex.exec(content)) !== null) {
  routes.add(match[1]);
}

const sorted = Array.from(routes).sort();
console.log(JSON.stringify(sorted, null, 2));
