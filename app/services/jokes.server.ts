import type { Joke, User } from '@prisma/client';
import { db } from '~/utils/db.server';

export type JokePreview = Pick<Joke, 'id' | 'name'>;

export type CreateJokeDTO = Pick<Joke, 'name' | 'content' | 'jokesterId'>;

export async function getJokesPreviews(): Promise<Array<JokePreview>> {
  return db.joke.findMany({
    select: {
      id: true,
      name: true,
    },
  });
}

export async function getRandomJoke(): Promise<(Joke & { jokester: User }) | undefined> {
  const jokesCount = await db.joke.count();

  const jokesToSkip = Math.floor(Math.random() * jokesCount);

  const [randomJoke] = await db.joke.findMany({ take: 1, skip: jokesToSkip, include: { jokester: true } });

  return randomJoke;
}

export async function getJokeById(id: string) {
  return db.joke.findUnique({ where: { id }, include: { jokester: true } });
}

export async function createJoke(newJokeData: CreateJokeDTO) {
  return db.joke.create({ data: newJokeData });
}

export type { Joke };
