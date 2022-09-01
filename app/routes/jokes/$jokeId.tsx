import { type LoaderFunction, json, Response } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getJokeById } from '~/services/jokes.server';

type LoaderData = {
  joke: Exclude<Awaited<ReturnType<typeof getJokeById>>, null>;
};

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.jokeId) throw Error('jokeId parameter is required');
  const joke = await getJokeById(params.jokeId);

  if (!joke) {
    throw new Response(`Joke Not Found`, { status: 404, statusText: 'Joke Not Found' });
  }

  return json<LoaderData>({ joke });
};

export default function JokeRoute() {
  const { joke } = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <p className="joke-author">By {joke?.jokester.username}</p>
    </div>
  );
}
