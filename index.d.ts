declare module "di-kit" {
    type Key = string | symbol;
    export function inject<T = object>(key: Key): T;
    export function provide<T = object>(key: Key, ctor: T | (() => T)): void
    export function init(): void;
    export function override<T = object>(key: Key, instance: T): void
    export function beforeInit(fn: (name: string, override: <T = object>(key: Key, instance: T) => void) => void): () => void;
    export function createActivator(name?: string): {
        inject<T = object>(key: Key): T;
        provide<T = object>(key: Key, ctor: T | (() => T)): void
        init(): void;
        override<T = object>(key: Key, instance: T): void
        beforeInit(fn: (name: string, override: <T = object>(key: Key, instance: T) => void) => void): () => void;
        InstanceAccessor: InstanceAccessor;
    };
    export class InstanceAccessor {
        public readonly name: string;
    }
}
