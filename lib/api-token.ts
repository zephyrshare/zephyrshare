import { randomBytes } from 'crypto';

export function generateApiToken(): string {
  return randomBytes(32).toString('hex');
}