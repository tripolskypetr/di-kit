declare module "di-kit" {
    type Key = string | symbol;
    export function inject<T = object>(key: Key): T;
    export function provide<T = object>(key: Key, ctor: T | (() => T)): void
    export function init(): void;
}
