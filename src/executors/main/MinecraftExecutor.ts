import File from "fs";

import Executor from "../Executor";
import MinecraftGetExecutor from "./MinecraftGetExecutor";

import {ResponseData} from "../../response/FriesResponse";

import {random} from "../../utilities/ArrayUtils";
import {access, values} from "../../utilities/ObjectUtils";
import {User} from "discord.js";

const titles = File.readFileSync("resources/minecraft/titles.txt", {encoding: "utf-8"}).toString().split("\n");

class MinecraftExecutor extends Executor {

    Name = "마인크래프트";
    Aliases = [ "마크", "マイクレ" ];
    Suffixes = [];
    DescriptionAsHelp = "마인크래프트 커맨드야!!";
    DescriptionAsArg = "마인크래프트 커맨드."

    ChildExecutors = {
        GET: new MinecraftGetExecutor()
    }

    Args = { GET: this.ChildExecutors.GET.Name, TITLE: "아무말해줘" };
    ArgAliases = { GET: this.ChildExecutors.GET.Aliases, TITLE: [] };
    ArgAliasSuffixes = { GET: this.ChildExecutors.GET.Suffixes, TITLE: [] };
    ArgDescriptions = { GET: this.ChildExecutors.GET.DescriptionAsArg, TITLE: "아무말(영어)를 던짐" };

    WrongMessages = [
        ["마인크래프트로 뭘 하라는건지 모르겠어!!", "마인크래프트로 뭘 해야할지 모르겠어."],
        ["여전히 명령에 문제가 있어...", "아직 문제가 있어!!"],
        ["(대충 디버그 막대기를 꺼내며) '**%%wrong-arg%%**'에 문제가 있어.", "(대충 로그를 쳐다보며) '**%%wrong-arg%%**'에 문제가 있어."],
        ["어쩌라고!! 모르겠다고!!", "아잇... 커맨드블럭으로 맞아볼래?? 뭔 말인지 모르겠다고!!"],
        ["(네더라이트 검을 꺼낸다)", "이상한 명령 멈춰!!"],
        ["심심하면 마인크래프트를 켜!! 나한테 이러지 말고!!!!", "나랑 마인크래프트 할래?"],
        ["... ... (반응이 없다)"]
    ];

    exec(command: string[], statistic: string[], sender: User): ResponseData {

        statistic.push(this.Name);

        let argData = this.generateArgumentData(command);

        if (argData.arguments.length == 0)
            return this.generateHelp(command[0], statistic);

        switch (argData.argument) {
            case this.Args.TITLE:
                statistic.push(this.Args.TITLE);
                return {
                    type: "strings",
                    data: [random(titles)],
                    statistic: statistic
                };
            case null: case undefined:
                let result = [this.getWrongOperationMessage(command[0])];
                if (this.WrongOperationCount == 0)
                    result.push(`[ ${values(this.Args).map((arg) => `**${arg}**`).join(" | ")} ]중 하나, 혹은 그 별칭을 입력해줘!!`);

                this.WrongOperationCount++;

                statistic.push(this.statisticUnknownLabel);
                return {type: "strings", data: result, statistic: statistic};
            default:
                if (argData.argumentKey)
                    return access<Executor>(this.ChildExecutors, argData.argumentKey).exec(argData.arguments, statistic, sender);
                else {
                    statistic.push(this.statisticErrorLabel);
                    return {type: "strings", data: ["뭔가 많이 잘못되었어... 개발한 놈 누구냐..."], statistic: statistic};
                }
        }

    }

}

export default MinecraftExecutor;