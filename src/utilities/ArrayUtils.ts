export function random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

export function map<T>(array: T[], action: (value: T) => any): any[] {
    let result: any[] = [];
    array.forEach((value) => {
        result.push(action(value));
    });
    return result;
}

export function filter<T>(array: T[], criteria: (value: T) => boolean): T[] {
    let result: any[] = [];
    array.forEach((value) => {
        if (criteria(value)) result.push(value);
    });
    return result;
}

export function permutation(...arrays: any[][]): any[][] {
    let depth = 0;

    let result: any[][] = [];
    let recursive = function(before: any[]) {
        if (depth < 0) return;

        arrays[depth].forEach((current: any) => {
            if (depth < arrays.length - 1) {
                depth++;
                before.push(current);
                recursive(before);
            } else {
                let clone: any[] = JSON.parse(JSON.stringify(before));
                clone.push(current);
                result.push(clone);
            }
        });

        before.pop();
        depth--;
    }
    recursive([]);

    return result;
}
