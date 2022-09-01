import { compare, hash } from 'bcryptjs';

export async function passwordMatchesHash(rawPassword: string, passwordHash: string): Promise<boolean> {
  return compare(rawPassword, passwordHash);
}

export async function createPasswordHash(password: string): Promise<string> {
  return hash(password, 10);
}
