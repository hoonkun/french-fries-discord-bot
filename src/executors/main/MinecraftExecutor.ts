import File from "fs";

import Executor from "../Executor";
import MinecraftGetExecutor from "./MinecraftGetExecutor";

import {map, random} from "../../utilities/ArrayUtils";
import {access} from "../../utilities/ObjectUtils";

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

    exec(command: string[], username: string): ResponseData {

        let args = command.slice(1, command.length);

        if (args.length === 0)
            return this.generateHelp();

        let argKey = this.getArgument(args[0].toLowerCase());
        let arg = argKey ? access(this.Args, argKey) : null;

        if (arg != null) this.WrongOperationCount = 0;

        switch (arg) {
            case this.Args.TITLE:
                return {
                    type: "strings",
                    data: [random(titles)]
                };
            case null:
                let result = [this.getWrongOperationMessage(command[0])];
                if (this.WrongOperationCount == 0)
                    result.push(`[ ${map(Object.values(this.Args), (arg) => `**${arg}**`).join(" | ")} ]중 하나, 혹은 그 별칭을 입력해줘!!`);

                this.WrongOperationCount++;

                return {type: "strings", data: result};
            default:
                if (argKey)
                    return access<Executor>(this.ChildExecutors, argKey).exec(args, username);
                else
                    return {type: "strings", data: ["뭔가 많이 잘못되었어... 개발한 놈 누구냐..."]};
        }

    }

}

export default MinecraftExecutor;