export function env(name: string, fallback = ''): string {
  return process.env[name] || fallback;
}

export function envBool(name: string, fallback = false): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
}

export function hasAuthCreds(): boolean {
  return Boolean(process.env.COMPANY_EMAIL && process.env.COMPANY_PASSWORD);
}
