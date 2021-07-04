import configurations from "../../../configurations.json";

import Executor from "../Executor";

import MinecraftExecutor from "./MinecraftExecutor";
import DevExecutor from "./DevExecutor";
import SelectExecutor from "./SelectExecutor";
import HowdyExecutor from "./HowdyExecutor";

import {ResponseData} from "../../response/FriesResponse";

import {random} from "../../utilities/ArrayUtils";
import {access, entries, values} from "../../utilities/ObjectUtils";
import FriesDataUtils from "../../utilities/FriesDataUtils";
import {MessageEmbed, User} from "discord.js";

class Main extends Executor {

    Name = "";
    Aliases = [];
    Suffixes = [];
    DescriptionAsHelp = "";
    DescriptionAsArg = "";

    ChildExecutors = {
        MINECRAFT: new MinecraftExecutor(),
        DEV: new DevExecutor(),
        SELECT: new SelectExecutor(),
        HOWDY: new HowdyExecutor()
    };

    Args = {
        MINECRAFT: this.ChildExecutors.MINECRAFT.Name,
        DEV: this.ChildExecutors.DEV.Name,
        SELECT: this.ChildExecutors.SELECT.Name,
        HOWDY: this.ChildExecutors.HOWDY.Name,
        HELP: "도움말",
        INFORMATION: "정보",
        STATISTICS: "통계"  // this arg must be last.
    };

    ArgAliases = {
        MINECRAFT: this.ChildExecutors.MINECRAFT.Aliases,
        DEV: this.ChildExecutors.DEV.Aliases,
        SELECT: this.ChildExecutors.SELECT.Aliases,
        HOWDY: this.ChildExecutors.HOWDY.Aliases,
        HELP: ["도와줘", "모르겠어"],
        INFORMATION: ["뭐야", "누구야"],
        STATISTICS: ["통계보여줘"]
    };

    ArgAliasSuffixes = {
        MINECRAFT: this.ChildExecutors.MINECRAFT.Suffixes,
        DEV: this.ChildExecutors.DEV.Suffixes,
        SELECT: this.ChildExecutors.SELECT.Suffixes,
        HOWDY: this.ChildExecutors.HOWDY.Suffixes,
        HELP: [ "!!" ],
        INFORMATION: [ "?" ],
        STATISTICS: []
    };

    ArgDescriptions = {};

    WrongMessages = [
        ["뭘 해달라는거야? 이상한거 시키지 말라구!!!", "틀린 명령이야!! 그런 거 없어!!!"],
        ["왜 자꾸 이상한거 시키냐고!!", "알 수 없다고!! 뭘 시킨건지 모르겠어!!!"],
        ["모른다고!!", "알 수 없다니까!!!"],
        ["모르겠다니까!!", "일부러 그러는건 아니지??"],
        ["이상한 명령 멈춰!!", "멈춰!! 제대로 된 명령 내놔!!"],
        ["... ... 다른 할거 없어?", "...다른 할 일을 찾는게 어떨까?"]
    ];

    NoOperationDefinedCount = 0;

    NoOperationDefinedMessages = [
        ["명령을 입력해!! 불러놓고 왜 멍하니 있냐...", "명령 내놔!! 불러놓고 멍때리지 말고!!"],
        ["명령을 입력하라고!!", "명령을 달라고!!", "명령을 내놓으라고!!"],
        ["명령 입력하라니까??", "명령 없어??", "명령!! 명령!!!!"],
        ["(???) 아니 왜 아무 말이 없으세요", "뭐라도 시켜주지 않을래...", "괴롭히는거야?? 난 그런 취향 아니거든!!"],
        ["심심해?", "할 거 없어?", "... ..."],
        ["다른 할 일이 있지 않아?"]
    ]

    exec(command: string[], statistic: string[], sender: User): ResponseData {

        const isFirstOperation = FriesDataUtils.get().isFirstOperation.hasOwnProperty(sender.tag) ? FriesDataUtils.get().isFirstOperation[sender.tag] : true;

        if (command.length === 0 && !isFirstOperation) {
            let result = [this.getNoOperationDefinedMessage()];
            let args = values(this.Args)
                .filter((_: string, index: number, array: string[]) => index < array.length - 1)
                .map((arg) => `**${arg}**`)
                .join(" | ");

            if (this.NoOperationDefinedCount == 0)
                result.push(`\n가능한 명령에는 다음과 같은 것들이 있어:\n[ ${args} ]\n봇을 사용한 통계를 보고싶다면 '**!! 통계보여줘**'명령을 사용하면 돼.`);

            this.NoOperationDefinedCount++;

            statistic.push("(빈 명령)")

            return {type: "strings", data: result, statistic: statistic};
        } else if (command.length === 0 && isFirstOperation) {
            FriesDataUtils.set("isFirstOperation", sender.tag, false);
            command.push("도움말");
        }

        this.NoOperationDefinedCount = 0;

        let argKey = this.getArgument(command[0].toLowerCase());
        let arg = argKey ? access(this.Args, argKey) : null;

        if (arg != null) this.WrongOperationCount = 0;

        switch (arg) {
            case this.Args.HELP:
                statistic.push(this.Args.HELP);

                let prefixes = configurations.PREFIXES.filter((prefix) => prefix.type === "normal")
                    .map((prefix) => `**${prefix.value}**`)
                    .join(" | ");
                let args = values(this.Args).filter((_: string, index: number, array: string[]) => index < array.length - 1).map((arg) => `**${arg}**`).join(" | ");

                return {
                    type: "strings",
                    data: [
                        `명령 접두사인 [ ${prefixes} ] 중 하나를 입력하고 한 칸 띄운 뒤에, 다음과 같은 명령을 입력할 수 있어:`,
                        `[ ${args} ]`, `\n봇을 사용한 통계를 보고싶다면 '**!! 통계보여줘**' 명령을 사용하면 돼.`,
                        isFirstOperation ?
                            `\n다음에 이 문구를 다시 보고싶다면 명령 접두사 뒤에 '**${this.Args.HELP}**'을 입력해줘!!` :
                            `\n${(command[0].toLowerCase() === this.Args.HELP ? `\n*참고로 이 명령은 [ ${this.ArgAliases.HELP.map((alias) => `**${alias}**`).join(" | ")} ]이라는 별칭으로도 실행할 수 있어!` : ``)}`
                    ],
                    statistic: statistic
                };
            case this.Args.INFORMATION:
                statistic.push(this.Args.INFORMATION);

                let target = ["HoonKun(@hoon_kiwicraft)가 심심해서 만든 봇이야!\n별로 재미있는건 없지만 암튼 그렇대."];

                if (command.length == 1 || command.length > 1 && command[1].toLowerCase() != "tmi")
                    target.push(`좀 더 자세한 정보를 원하면 다음 커맨드를 입력해:\n> !! 정보 TMI`);
                else if (command.length > 1 && command[1].toLowerCase() == "tmi") {
                    target.push(
                        "이 디코봇은 typescript 라는 언어를 사용했고, nodejs 라는 서버 구축 플랫폼과 Discord.js 라는 라이브러리를 사용해 만들어졌어.",
                        "총 개발 기간은 3일 정도였고, javascript로 작성했던걸 typescript로 바꾸는 과정에 1일이 추가로 쓰였어.",
                        "이것 저것 요소를 추가하다보니 좀 더럽고 어렵게 짜였는데, 훨씬 간단하게도 짤 수 있어.",
                        "\n소스코드를 보고싶으면 이쪽으로 가봐:\n> https://github.com/gohoon-k/french-fries-discord-bot",
                        "말했듯 별로 재미난 건 없지만 추가되었으면 하는게 있다면 말해주면 추가해볼게!!"
                    );
                }

                if (command[0].toLowerCase() === this.Args.INFORMATION)
                    target.push(`\n*참고로 이 명령은 [ ${this.ArgAliases.INFORMATION.map((alias) => `**${alias}**`).join(" | ")} ]이라는 별칭으로도 실행할 수 있어!`);
                return {
                    type: "strings",
                    data: target,
                    statistic: statistic
                };
            case this.Args.STATISTICS:
                if (FriesDataUtils.get().statistics[sender.tag]) {
                    let count = FriesDataUtils.get().operationCounts[sender.tag];
                    let commands = entries(FriesDataUtils.get().statistics[sender.tag].commands)
                        .sort((a, b) => b.value - a.value)
                        .map((entry) => `${entry.key}\t\t→\t\t${entry.value}회`)
                        .join("\n");

                    let prefixes = entries(FriesDataUtils.get().statistics[sender.tag].prefixes)
                        .sort((a, b) => b.value - a.value)
                        .map((entry) => `${entry.key}\t\t→\t\t${entry.value}회`)
                        .join("\n");

                    let resultEmbed = new MessageEmbed()
                        .setColor("#0070b8")
                        .setThumbnail(sender.displayAvatarURL())
                        .setTitle(`${sender.username}의 통계야!!`)
                        .setDescription(`총 ${count ? count : 0}번의 명령을 사용했어:\n\n${commands}\n\n명령 접두사는 다음과 같이 썼어:\n\n${prefixes}`);

                    return {
                        type: "statistic",
                        data: resultEmbed
                    }
                } else {
                    return {
                        type: "strings",
                        data: [ "표시할 수 있는 통계가 없어!!" ],
                        statistic: []
                    }
                }
            case null:
                let result = [this.getWrongOperationMessage(command[0])];
                if (this.WrongOperationCount == 0)
                    result.push(`잘 모르겠으면 '**감자튀김 형 도와줘**'를 입력해!!`);

                this.WrongOperationCount++;

                return {type: "strings", data: result, statistic: statistic};
            default:
                if (argKey)
                    return access<Executor>(this.ChildExecutors, argKey).exec(command, statistic, sender);
                else {
                    statistic.push(this.statisticErrorLabel);
                    return {type: "strings", data: ["뭔가 많이 잘못되었어... 개발한 놈 누구냐..."], statistic: statistic};
                }
        }

    }

    getNoOperationDefinedMessage(): string {
        return random(this.NoOperationDefinedMessages[this.NoOperationDefinedCount]);
    }

}

export default Main;