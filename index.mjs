export const createActivator = (namespace = "unknown") => {

    const ACTIVATOR_FN = Symbol('activator-fn');
    const INIT_FN = Symbol('init-fn');

    const accessorMap = new Map();
    const factoryMap = new Map();
    const instanceMap = new Map();

    const singleshot = (run) => {
        let isInitComplete = false;
        let runValue = undefined;
        return () => {
            if (isInitComplete) {
                return runValue;
            }
            isInitComplete = true;
            return runValue = run();
        }
    };

    const getInstance = (name) => {
        if (instanceMap.has(name)) {
            return instanceMap.get(name);
        }
        if (factoryMap.has(name)) {
            const instance = factoryMap.get(name)();
            instanceMap.set(name, instance);
            return instance;
        }
        console.warn(`di-kit namespace=${namespace} name=${name} not provided`);
        return {};
    }
    
    const createActivator = (name, self) => 
        singleshot(() => {
            Object.setPrototypeOf(self, getInstance(name));
        });

    const createInitializer = (self) => 
        singleshot(() => {
            self.init && self.init();
        });

    class InstanceAccessor {
        constructor(name) {
            this.name = name;
            this[ACTIVATOR_FN] = createActivator(name, this);
            this[INIT_FN] = createInitializer(this);
        }
    }
    
    const provide = (name, ctor) => {
        if (typeof ctor === "function") {
            factoryMap.set(name, ctor);
            return;
        }
        instanceMap.set(name, ctor);
    };
    
    const inject = (name) => accessorMap.has(name)
        ? accessorMap.get(name)
        : accessorMap.set(name, new InstanceAccessor(name)).get(name);
    
    const init = () => {
        for (const accessor of accessorMap.values()) {
            accessor[ACTIVATOR_FN]();
        }
        for (const accessor of accessorMap.values()) {
            accessor[INIT_FN]();
        }
    };
    
    return {
        provide,
        inject,
        init,
    };
}

export const { provide, inject, init } = createActivator('root');
