import Executor from "../Executor";

import {ResponseData} from "../../response/FriesResponse";

import {random} from "../../utilities/ArrayUtils";
import {values} from "../../utilities/ObjectUtils";
import {User} from "discord.js";

const names = [
    [
        "bug-free", "korogaru", "super", "fizzy", "laughing", "hop-step", "reimagined", "glowing", "stunning", "ideal",
        "invalid", "turbo", "crispy", "legendary", "programming", "kawaii", "ookina", "stekina", "kirameku", "waraeru",
        "blue", "moving", "natsu-no"
    ],
    [
        "pancake", "fries", "potato", "memory", "adventure", "enigma", "blackstone", "nether", "pixel", "fiesta",
        "ice-cream", "robot", "doodle", "spoon", "usotsuki", "inu", "kuma", "sekai", "diamond", "gold",
        "hikari", "constructor", "burst"
    ],
];
const printTemplates = [
    "이런 이름이 나왔어: **'%%content%%'**",
    "**'%%content%%'** 이건 어때?",
    "**'%%content%%'** 라는데, 약간 이상한가...",
    "이런것도 있어 -> **'%%content%%'**",
    "어렵다... **'%%content%%'** 이건 이상한가",
    "**'%%content%%'** 이거..."
]

class DevExecutor extends Executor {

    Name = "개발";
    Aliases = [ "멍발" ];
    Suffixes = [];
    DescriptionAsHelp = "개발 커맨드야!!";
    DescriptionAsArg = "개발 커맨드.";

    ChildExecutors = {};

    Args = { REPO_NAME: "저장소이름지어줘" };
    ArgAliases = { REPO_NAME: [] };
    ArgAliasSuffixes = { REPO_NAME: [] };
    ArgDescriptions = { REPO_NAME: "깃 저장소 이름을 추천해줌" };

    WrongMessages = [
        ["개발로 뭘 하라는건지 모르겠어!!", "멍멍... 멍발자는 멍발로 뭘하라는건지 모르겠소요"],
        ["모르겠다니까!!", "서술어가 부정확해...", "(대충 모르겠다는 표정)"],
        ["여전히 모르겠어, 오타가 있는지 확인해볼래?", "어렵네... 이번에도 모르겠어."],
        ["아직도 어딘가 이상해. '**%%wrong-arg%%**'를 확인해봐.", "모르겠어. '**%%wrong-arg%%**'와 그 뒤쪽을 확인해봐."],
        ["일부러 그러는건 아니지?", "일부러 이러는건 아닐거라 믿는다"],
        ["(낡고 지침)", "명령을 다시 한 번 확인해줘..."],
        ["... ... (반응이 없다)"]
    ];

    exec(command: string[], statistic: string[], sender: User): ResponseData {

        statistic.push(this.Name);

        if (args.length === 0)
            return this.generateHelp();

        let argKey = this.getArgument(args[0].toLowerCase());
        let arg = argKey ? access(this.Args, argKey) : null;

        if (arg != null) this.WrongOperationCount = 0;

        switch (arg) {
            case this.Args.REPO_NAME:
                statistic.push(this.Args.REPO_NAME);
                return {
                    type: "strings",
                    data: [random(printTemplates).replace("%%content%%", `${random(names[0])}-${random(names[1])}`)],
                    statistic: statistic
                };
            case null:
                let result = [this.getWrongOperationMessage(command[0])];
                if (this.WrongOperationCount == 0)
                    result.push(`[ ${values(this.Args).map((arg) => `**${arg}**`).join(" | ")} ]중 하나, 혹은 그 별칭을 입력해줘!!`);

                this.WrongOperationCount++;

                statistic.push(this.statisticUnknownLabel);

                return {type: "strings", data: result, statistic: statistic};
            default:
                statistic.push(this.statisticErrorLabel);
                return {type: "strings", data: [ "This can not be happened, haha....? Really?" ], statistic: statistic};
        }

    }

}

export default DevExecutor;