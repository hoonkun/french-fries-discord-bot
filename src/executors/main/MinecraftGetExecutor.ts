import {MinecraftResult, ResponseData} from "../../types";

import Executor from "../Executor";

import {spawnSync} from "child_process";
import {random} from "../../utilities/ArrayUtils";
import {values} from "../../utilities/ObjectUtils";

import {ResponseData} from "../../response/FriesResponse";
import {User} from "discord.js";

type MinecraftResult = MinecraftResultMaterial | MinecraftResultDeathMessage;

interface MinecraftResultMaterial {
    type: "material",
    ko: string,
    en: string,
    key: string
}

interface MinecraftResultDeathMessage {
    type: "death_message",
    state: "NO_TRANSLATION" | "OK",
    ko: string,
    en: string
}

const deathMessageTemplates = [
    "는 죽었어... %%death-message%% ...라는데.",
    "의 전생 계기는... %%death-message%% ...라네.",
    "는 장렬하게 전사했다. 그 이유는! %%death-message%% 라는군.",
    "의 인생 2회차는 %%death-message%% 같은 이유로 시작되었다고 하는데.",
    "는 지금 이 세계에 없어. %%death-message%% 라는 이유로 전생했을걸."
];

class MinecraftGetExecutor extends Executor {

    Name = "줘";
    Aliases = ["내놔"];
    Suffixes = [];
    DescriptionAsHelp = "랜덤하게 마인크래프트의 무언가를 뽑는 커맨드야!!";
    DescriptionAsArg = "마크의 무언가를 뽑음"

    ChildExecutors = {};

    Args = {BLOCK: "블럭", ITEM: "아이템", DEATH_MESSAGE: "인생2회차"};
    ArgAliases = {BLOCK: ["블록"], ITEM: [], DEATH_MESSAGE: []};
    ArgAliasSuffixes = {BLOCK: [], ITEM: [], DEATH_MESSAGE: []};
    ArgDescriptions = {BLOCK: "블럭을 뽑음", ITEM: "아이템을 뽑음", DEATH_MESSAGE: "사망 메시지를 뽑음"};

    WrongMessages = [
        ["뭘 뽑으라는건지 모르겠어!!", "그건 뽑을 수 없어!!", "그건 못 뽑는 요소야!!"],
        ["그걸 뽑고싶은게 확실해? 오타는 없어?", "아직 추가되지 않은 요소인데, 필요하면 개발자에게 시켜봐!!"],
        ["일단 '**%%wrong-arg%%**'에 문제가 있어. 의도한게 아니라면 수정해봐!", "(대충 커맨드블럭 출력을 보며) '**%%wrong-arg%%**'가 잘못되었어!!"],
        ["수정한 거 맞아...? 여전히 '**%%wrong-arg%%**'에 문제가 있어.", "다시 한 번 눈을 크게 뜨고 잘 봐봐!! '**%%wrong-arg%%**'가 여전히 잘못되었어!!"],
        ["'**%%wrong-arg%%**'는 아직 스크립트에 없어, 재미있을 것 같다면 개발자에게 시켜봐. 나는 스크립트에 없는건 해줄 수 없어...", "... 일부러 그러는거지?"],
        ["(대충 만든 사람을 다급하게 부름)", "아무튼 없어, 없다고!! 그만해!!"],
        ["... ... (반응이 없다)"]
    ];

    exec(command: string[], statistic: string[], sender: User): ResponseData {

        statistic.push(this.Name);

        if (args.length === 0)
            return this.generateHelp();

        let argKey = this.getArgument(args[0].toLowerCase());
        let arg = argKey ? access(this.Args, argKey) : null;

        if (argKey != null) this.WrongOperationCount = 0;

        let spawnArgs = "";
        switch(arg) {
            case this.Args.BLOCK: spawnArgs = "block"; break;
            case this.Args.ITEM: spawnArgs = "item"; break;
            case this.Args.DEATH_MESSAGE: spawnArgs = "died"; break;
        }

        const process = spawnSync(
            "java", ["-jar", "-Dfile.encoding=UTF-8", `${__dirname}/../../../libs/fries-mc-module.jar`, spawnArgs],
            {encoding: "utf8"}
        );

        if (process.stderr.trim() !== "")
            console.log(process.stderr);

        let processResult: MinecraftResult | null = null;
        if (process.stdout) processResult = JSON.parse(process.stdout);

        switch (arg) {
            case this.Args.BLOCK: case this.Args.ITEM:
                if (processResult != null && processResult.type == "material") {
                    statistic.push(argData.argument);
                    return {
                        type: "embed",
                        data: {
                            type: arg == this.Args.BLOCK ? "block" : "item",
                            title: processResult.ko,
                            description: `${processResult.en}\n위와 같은 ${arg == this.Args.BLOCK ? "블럭" : "아이템"}이 나왔어!`,
                            thumbnail: processResult.key
                        },
                        statistic: statistic
                    };
                } else {
                    statistic.push(this.statisticErrorLabel);
                    return {type: "strings", data: ["This cannot be happen, maybe..."], statistic: statistic};
                }
            case this.Args.DEATH_MESSAGE:
                if (processResult != null && processResult.type == "death_message") {
                    statistic.push(this.Args.DEATH_MESSAGE);
                    return {
                        type: "strings",
                        data: [
                            processResult.state === "NO_TRANSLATION" ?
                                `뭐지... 번역이 없대. 원문은 아래와 같다네. \n> ${processResult.en.replace(/%%name%%/g, username)}`
                                :
                                `**${username}**` +
                                random(deathMessageTemplates)
                                    .replace(
                                        "%%death-message%%",
                                        `\n> **${processResult.ko.replace(/%%name%%/g, username)}**\n> ${processResult.en.replace(/%%name%%/g, username)}\n`
                                    )
                        ],
                        statistic: statistic
                    };
                } else {
                    statistic.push(this.statisticErrorLabel);
                    return {type: "strings", data: ["This cannot be happen, maybe...?"], statistic: statistic};
                }
            case null:
                let result = [this.getWrongOperationMessage(command[0])];
                if (this.WrongOperationCount == 0)
                    result.push(`[ ${map(Object.values(this.Args), (arg) => `**${arg}**`).join(" | ")} ]중 하나, 혹은 그 별칭을 입력해줘!!`);

                this.WrongOperationCount++;

                statistic.push(this.statisticUnknownLabel);

                return {type: "strings", data: result, statistic: statistic};
            default:
                statistic.push(this.statisticErrorLabel);
                return {type: "strings", data: [ "This can not be happened, haha." ], statistic: statistic};
        }

    }

}

export default MinecraftGetExecutor;