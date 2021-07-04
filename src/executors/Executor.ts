import configurations from "../../configurations.json";

import {ResponseData} from "../response/FriesResponse";

import {random} from "../utilities/ArrayUtils";
import {access, entries} from "../utilities/ObjectUtils";
import {User} from "discord.js";

interface ArgumentData {
    arguments: string[],
    argumentKey?: string,
    argument?: string
}

abstract class Executor {

    abstract Name: string;
    abstract Aliases: string[];
    abstract Suffixes: string[];

    abstract DescriptionAsHelp: string;
    abstract DescriptionAsArg: string;

    abstract ChildExecutors: { [key: string]: Executor };

    abstract Args: { [key: string]: string };
    abstract ArgAliases: { [key: string]: string[] };
    abstract ArgAliasSuffixes: { [key: string]: string[] };
    abstract ArgDescriptions: { [key: string]: string };

    abstract WrongMessages: string[][];

    WrongOperationCount = 0;

    statisticHelpLabel = "(도움말)";
    statisticUnknownLabel = "(알 수 없는 명령)";
    statisticErrorLabel = "(에러가 발생한 명령)";

    abstract exec(command: string[], statistic: string[], sender: User): ResponseData;

    generateArgumentData(command: string[]): ArgumentData {
        let args = command.slice(1, command.length);

        if (args.length == 0)
            return {arguments: args};

        let argKey = this.getArgument(args[0].toLowerCase());
        let arg = argKey ? access(this.Args, argKey) : null;

        if (arg != null) this.WrongOperationCount = 0;

        const result: ArgumentData = {arguments: args};
        if (arg) result["argument"] = arg;
        if (argKey) result["argumentKey"] = argKey;

        return result;
    }

    abstract exec(command: string[], username: string): ResponseData;

    generateHelp(): ResponseData {
        let aliases = map(this.Aliases, (alias) => `**${alias}**`).join(" | ");
        let argumentHelp = map(
            entries(this.Args),
            (argEntry) => {
                let aliases = map(this.ArgAliases[argEntry.key], (alias) => `**${alias}**`).join(" | ");
                return `> ${configurations.PREFIXES[0].value} ... [ **${argEntry.value}**${aliases.length > 0 ? " | " : ""}${aliases} ]: ${this.ArgDescriptions[argEntry.key]}`;
            }
        ).join("\n");

        statistic.push(this.statisticHelpLabel);

        return {
            type: "strings",
            data: [
                `${this.DescriptionAsHelp}`,
                `이 커맨드는 [ ${aliases} ] 중 하나를 입력해도 실행할 수 있어!!`,
                `\n이 뒤에는 다음을 입력할 수 있어: \n${argumentHelp}`
            ],
            statistic: statistic
        };
    }

    getArgument(word: string): string | null {
        let result: string | null = null;
        entries(this.Args).forEach((argEntry) => {
            if (result) return;

            let argAliasEntry = {key: argEntry.key, value: this.ArgAliases[argEntry.key]};
            let argAliasSuffixes = this.ArgAliasSuffixes[argEntry.key] && this.ArgAliasSuffixes[argEntry.key].length !== 0
                ? this.ArgAliasSuffixes[argEntry.key] : [""];

            argAliasSuffixes.forEach((argAliasSuffix) => {
                if (result) return;

                if (argEntry.value === word || `${argEntry.value}${argAliasSuffix}` === word) result = argEntry.key;

                let originalArgAliases: string[] = JSON.parse(JSON.stringify(argAliasEntry.value));
                let argsWithSuffix: string[] = argAliasEntry.value.map((arg) => `${arg}${argAliasSuffix}`);

                if (originalArgAliases.includes(word) || argsWithSuffix.includes(word)) result = argEntry.key;
            });
        });
        return result;
    }

    getWrongOperationMessage(wrongArg: string): string {
        return random(this.WrongMessages[this.WrongOperationCount]).replace("%%wrong-arg%%", wrongArg)
    }

}

export default Executor;