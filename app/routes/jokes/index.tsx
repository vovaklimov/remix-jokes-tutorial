import type { Joke } from '~/services/jokes.server';
import type { User } from '~/services/users.server';
import { Response, type LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import { getRandomJoke } from '~/services/jokes.server';

type LoaderData = {
  randomJoke: Joke & { jokester: User };
};

export const loader: LoaderFunction = async () => {
  const randomJoke = await getRandomJoke();

  if (!randomJoke) {
    throw new Response('Failed to find random joke!', {
      status: 404,
    });
  }

  return json<LoaderData>({
    randomJoke,
  });
};

export default function JokesIndexRoute() {
  const { randomJoke } = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{randomJoke.content}</p>
      <p className="joke-author">By {randomJoke.jokester.username}</p>
    </div>
  );
}

export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div className="error-container">Random joke not found!</div>;
  }

  throw new Error(`Caught unexpected error with status ${caught.status}`);
}
