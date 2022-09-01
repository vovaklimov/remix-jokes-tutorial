import { type User } from '@prisma/client';
import { createCookieSessionStorage, redirect, type TypedResponse } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { createPasswordHash, passwordMatchesHash } from '~/utils/password';

type LoginCredentials = {
  username: string;
  password: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET env variable must be set');

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: 'RJ_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function login({ username, password }: LoginCredentials): Promise<User | null> {
  const user = await db.user.findUnique({ where: { username } });

  if (!user) {
    return null;
  }

  return (await passwordMatchesHash(password, user.passwordHash)) ? user : null;
}

export type RegisterUserDTO = {
  username: string;
  password: string;
};

export async function registerUser({ username, password }: RegisterUserDTO) {
  const passwordHash = await createPasswordHash(password);

  return db.user.create({
    data: { username, passwordHash },
    select: {
      id: true,
      username: true,
    },
  });
}

export async function logout(request: Request): Promise<TypedResponse<never>> {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

export async function createUserSession(userId: User['id'], redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function getUserIdFromSession(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  return !userId || typeof userId !== 'string' ? null : userId;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
  const userId = await getUserIdFromSession(request);

  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUserFromSession(request: Request) {
  const userId = await getUserIdFromSession(request);

  if (userId === null) {
    return null;
  }

  try {
    return await db.user.findUnique({ where: { id: userId }, select: { id: true, username: true } });
  } catch {
    throw logout(request);
  }
}
