import configurations from "../../configurations.json";

import {permutation} from "./ArrayUtils";
import {Prefix} from "../types";

export function hasValidPrefix(command: string) {
    let result = false;
    permutation(configurations.PREFIXES, configurations.SUFFIXES).forEach((value) => {
        if (result) return;

        let prefix: Prefix = value[0];
        let suffix: string = value[1];

        result =
            (command.startsWith(`${prefix.value} `) || command == prefix.value) ||
            (prefix.suffixEnabled && (command.startsWith(`${prefix.value}${suffix} `) || command == `${prefix.value}${suffix}`));
    });
    return result;
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