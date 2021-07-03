import {ResponseData} from "../../types";

import Executor from "../Executor";

import {map, random} from "../../utilities/ArrayUtils";

const printTemplate = [
    "나는 '%%select-result%%'를 고르겠어.",
    "'%%select-result%%' 이걸로.",
    "음... '%%select-result%%' 이게 괜찮아 보임.",
    "어디보자, '%%select-result%%' 이걸로 가볼까.",
    "%%select-result%%",
    "오늘은 '%%select-result%%' 이거다!!"
];

class SelectExecutor extends Executor {

    Name = "선택봇";
    Aliases = [ "선택해줘" ];
    Suffixes = [];
    DescriptionAsHelp = "선택 커맨드야!!";
    DescriptionAsArg = "선택봇 가동!!";

    ChildExecutors = {};

    Args = {};
    ArgAliases = {};
    ArgAliasSuffixes = {};
    ArgDescriptions = {};

    WrongMessages = [];

    exec(command: string[], username: string): ResponseData {

        let args = command.slice(1, command.length);

        if (args.length === 0)
            return {
                type: "strings",
                data: [
                    `${this.DescriptionAsHelp}`,
                    `이 커맨드는 [ ${map(this.Aliases, (alias) => `**${alias}**`)} ] 를 입력해도 실행할 수 있어!`,

                    "이 뒤에는 선택하고 싶은 여러 항목들을 띄어쓰기로 구분해서 입력하면 돼. 그러면 봇이 그 중 하나를 골라줄거야!"
                ]
            };

        let selectArgs = args.slice(1, args.length);

        return {
            type: "strings",
            data: [random(printTemplate).replace("%%select-result%%", `**${random(selectArgs)}**`)]
        };

    }

}

export default SelectExecutor;