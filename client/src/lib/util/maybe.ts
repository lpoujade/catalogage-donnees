// See: https://github.com/kylecorbelli/typescript-nullable
// See: https://engineering.dollarshaveclub.com/typescript-maybe-type-and-module-627506ecc5c8

export type Maybe<T> = T | null | undefined;

export type AddMaybe<T, K extends keyof T> = Omit<T, K> & {
  [key in K]: Maybe<T[K]>;
};

export type DropMaybe<T, K extends keyof T> = Omit<T, K> & {
  [key in K]: T[K] extends Maybe<infer U> ? U : never;
};

const Some = <T>(m: Maybe<T>): m is T => {
  return m !== null && m !== undefined;
};

const map = <A, B>(a: Maybe<A>, f: (value: A) => B): Maybe<B> => {
  return Some(a) ? f(a) : null;
};

export const Maybe = {
  Some,
  map,
};
