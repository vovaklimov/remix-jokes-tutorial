import { type LoaderFunction, redirect, type ActionFunction } from '@remix-run/node';
import { logout } from '~/services/session.server';

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect('/');
};
