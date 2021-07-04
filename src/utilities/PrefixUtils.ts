import configurations from "../../configurations.json";

import {permutation} from "./ArrayUtils";

export interface Prefix {
    type: string,
    value: string,
    suffixEnabled: boolean
}

export function hasValidPrefix(command: string): [Prefix | null, boolean] {
    let result = false;
    let usedPrefix: Prefix | null = null;
    permutation(configurations.PREFIXES, configurations.SUFFIXES).forEach((value) => {
        if (result) return;

        let prefix: Prefix = value[0];
        let suffix: string = value[1];

        usedPrefix = prefix;

        result =
            (command.startsWith(`${prefix.value} `) || command == prefix.value) ||
            (prefix.suffixEnabled && (command.startsWith(`${prefix.value}${suffix} `) || command == `${prefix.value}${suffix}`));
    });
    return [usedPrefix, result];
}

export function getPrefixLength(command: string) {
    let result = -1;
    permutation(configurations.PREFIXES, configurations.SUFFIXES).forEach((value) => {
        if (result != -1) return;

        let prefix: Prefix = value[0];
        let suffix: string = value[1];

        if (command.startsWith(`${prefix.value} `)) {
            result = `${prefix.value} `.length;
        } else if (prefix.suffixEnabled && command.startsWith(`${prefix.value}${suffix} `)) {
            result = `${prefix.value}${suffix} `.length;
        } else if (command == prefix.value) {
            result = `${prefix.value}`.length;
        } else if (prefix.suffixEnabled && command == `${prefix.value}${suffix}`) {
            result = `${prefix.value}${suffix}`.length;
        }
    });
    return result;
}