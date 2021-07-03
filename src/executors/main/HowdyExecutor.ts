import {ResponseData} from "../../types";

import Executor from "../Executor";

import {random} from "../../utilities/ArrayUtils";

const messages = [
    ["**undefined**", "'.replace' is not a function."],
    ["cannot read property of 'undefined'"],
    ["나랑 마인크래프트 할래?"],
    ["오늘은 좀 일찍 자보는게 어떨까"],
    ["**%%username%% 멋지다!!**"],
    ["**%%username%% 귀엽다!!**"],
    ["같이 스타벅스가자", "가서 노트북 뚜들기기..."],
    ["봇에 추가할만한 아이디어 있으면 추천해줘", "재미있는거 뭐 없을까..."],
    ["**감자튀김 맛있어...**", "내가 맛있다고 (???)"],
    ["**감자튀김 취향은 어디임?**", "죠는 감튀면 아무대나 잘먹음"],
    ["커맨드를 입력할 때 []안에 무언가를 입력하면 그 부분은 무시할 수 있어.", "예를 들면, '감튀야 선택해줘 [감자튀김 취향은 어디야?] 버거킹 맘스터치 롯데리아' 라고 하면 질문은 빼고 3개 중에 골라줄거야."],
    ["마크 재밌어!! 같이하자!!!"],
    ["같이 감자튀김먹으러 갈래?"],
    ["스불재를 조심해, 나도 모르는 사이에 당한다고."],
    ["님도 같이 디코봇 만들자, 생각보다 어렵지 않던데."],
    ["같이 오락실가자", "가서 노스탤지어 쳐야지 히히"],
    ["뭐하고 놀까!", "재미있는거 추천해줘!!"],
    ["얼마전에 보드게임을 처음 해봤는데 겁나 재미있더라", "기회 되면 몇 번 더 해보고싶기도."],
    ["(대충 디버그 막대기를 꺼내며) 이거 들고 **%%username%%**군 우클릭해보고싶다 (...)"],
    ["나 생각보다 맛있어(미친 발언)", "물론 감자튀김 얘기라구"],
    ["혀엉 밥사주세요...", "맛난거 사줘..."]
];

class HowdyExecutor extends Executor {

    Name = "심심해";
    Aliases = [ "놀아줘" ];
    Suffixes = [ "....", "...", "..", "!!!", "!!", "!" ];
    DescriptionAsHelp = "아무말을 던지는 커맨드야!!"; // 볼 수 없음.
    DescriptionAsArg = "아무말을 던짐.";

    ChildExecutors = {};

    Args = {};
    ArgAliases = {};
    ArgAliasSuffixes = {};
    ArgDescriptions = {};

    WrongMessages = [];

    exec(command: string[], username: string): ResponseData {
        let messageList = random(messages);
        let resultTarget: string[] = [];

        messageList.forEach((message: string) =>
            resultTarget.push(
                message.replace(/%%username%%/g, username)
            )
        );

        return {
            type: "strings",
            data: resultTarget
        };
    }

}

export default HowdyExecutor;