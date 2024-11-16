# di-kit

> Minimal ioc container which allow circular dependency injection

## Installation

```bash
npm install di-kit
```

## Code sample

```tsx
import { inject, provide, init } from './index.mjs';

const TYPES = {
    serviceFoo: Symbol('serviceFoo'),
    serviceBar: Symbol('serviceBar'),
    serviceBaz: Symbol('serviceBaz'),
};

provide(
    TYPES.serviceFoo, 
    () => new class {
        bar = inject(TYPES.serviceBar);
    }
);

provide(
    TYPES.serviceBar,
    () => new class {
        foo = inject(TYPES.serviceFoo);
        baz = inject(TYPES.serviceBaz);
    }
);

provide(
    TYPES.serviceBaz,
    () => new class { }
);

const ioc = {
    serviceFoo: inject(TYPES.serviceFoo),
    serviceBar: inject(TYPES.serviceBar),
    serviceBaz: inject(TYPES.serviceBaz),
};

init();

console.log(ioc.serviceFoo.bar.name);
console.log(ioc.serviceBar.foo.name);
console.log(ioc.serviceBar.baz.name);

```

## See also

If you looking for ASP.Net Core Scoped Services alternative for NodeJS take a look on [di-scoped npm package](https://www.npmjs.com/package/di-scoped)

```tsx

import { scoped } from 'di-scoped';

const TestClass = scoped(class {

    constructor(private name: string) {
    }

    test() {
        console.log(`Hello, ${this.name}`);
    }
});


TestClass.runInContext(() => {

    new TestClass().test(); // Hello, Peter

}, "Peter")
```
