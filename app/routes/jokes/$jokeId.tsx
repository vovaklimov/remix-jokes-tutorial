import { type LoaderFunction, json, Response } from '@remix-run/node';
import { useCatch, useLoaderData, useParams } from '@remix-run/react';
import { getJokeById } from '~/services/jokes.server';

type LoaderData = {
  joke: Exclude<Awaited<ReturnType<typeof getJokeById>>, null>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { jokeId } = params;
  if (!jokeId) throw Error('jokeId parameter is required');
  const joke = await getJokeById(jokeId);

  if (!joke) {
    throw new Response(`Joke id ${jokeId} was not found!`, { status: 404 });
  }

  return json<LoaderData>({ joke });
};

export default function JokeRoute() {
  const { joke } = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <p className="joke-author">By {joke.jokester.username}</p>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  if (caught.status === 404) {
    return <div className="error-container">Huh? What the heck is "{params.jokeId}"?</div>;
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { jokeId } = useParams();

  return <div className="error-container">{`There was an error loading joke by the id ${jokeId}. Sorry.`}</div>;
}
