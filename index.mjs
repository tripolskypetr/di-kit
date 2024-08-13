const accessorMap = new Map();
const factoryMap = new Map();
const instanceMap = new Map();

const INIT_FN = Symbol('init-fn');

const getInstance = (name) => {
    if (instanceMap.has(name)) {
        return instanceMap.get(name);
    }
    if (factoryMap.has(name)) {
        const instance = factoryMap.get(name)();
        instanceMap.set(name, instance);
        return instance;
    }
    console.warn(`di-kit ${name} not provided`);
    return {};
}

const createInitializer = (name, self) => () => {
    Object.setPrototypeOf(self, getInstance(name));
};

class InstanceAccessor {
    constructor(name) {
        this.name = name;
        this[INIT_FN] = createInitializer(name, this);
    }
}

export const provide = (name, ctor) => {
    if (typeof ctor === "function") {
        factoryMap.set(name, ctor);
        return;
    }
    instanceMap.set(name, ctor);
}

export const inject = (name) => accessorMap.has(name)
    ? accessorMap.get(name)
    : accessorMap.set(name, new InstanceAccessor(name)).get(name);

export const init = () => {
    for (const accessor of accessorMap.values()) {
        accessor[INIT_FN]();
    }
}
