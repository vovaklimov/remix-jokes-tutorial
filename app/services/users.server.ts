import { type User } from '@prisma/client';
import { db } from '~/utils/db.server';

export async function findUserByUsername(username: User['username']) {
  return db.user.findUnique({ where: { username }, select: { id: true, username: true } });
}

export async function findUserById(username: User['username']) {
  return db.user.findUnique({ where: { username }, select: { id: true, username: true } });
}

export type { User };
