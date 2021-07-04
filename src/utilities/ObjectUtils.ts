interface Entry<T> {
    key: string,
    value: T
}

export function entries<T>(target: {[k: string]: T}): Entry<T>[] {
    return map(Object.entries(target), (value) => {return {key: value[0], value: value[1]}});
}

export function values(target: object): any[] {
    return Object.values(target);
}

export function access<K>(object: {[key: string]: K}, key: keyof {[key: string]: K}): K {
    return object[key];
}