import { type LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getRandomJoke } from '~/services/jokes.server';

type LoaderData = {
  randomJoke: Exclude<Awaited<ReturnType<typeof getRandomJoke>>, null>;
};

export const loader: LoaderFunction = async () => {
  const randomJoke = await getRandomJoke();

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
