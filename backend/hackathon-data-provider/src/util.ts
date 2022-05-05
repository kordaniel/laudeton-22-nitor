import Rand from 'rand-seed'

export const rand = new Rand((process.env.SEED as string|undefined) || 'gr8');

const randomIntBetweenSeed = (rand: Rand, minInclusive: number, maxNotInclusive: number) => {
    return Math.floor(rand.next() * (maxNotInclusive - minInclusive) + minInclusive);
};

const randomIntBetween = (minInclusive: number, maxNotInclusive: number) => {
    return randomIntBetweenSeed(rand, minInclusive, maxNotInclusive)
};

export function randomElement<T>(elements: Array<T>): T {
    return randomElementSeed(rand, elements)
}

export function randomElementSeed<T>(rand: Rand, elements: Array<T>): T {
    return elements[randomIntBetweenSeed(rand, 0, elements.length)];
}