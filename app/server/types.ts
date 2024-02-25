export type Awaitable<T> = T | Promise<T>;

export type AwaitableType<T> = T extends Promise<infer U> ? U : T;

export type AsEnum<T> = T[keyof T];
