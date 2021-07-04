import * as Discord from "discord.js";
import {TextChannel} from "discord.js";

import configurations from "../configurations.json";

import FriesResponse from "./response/FriesResponse";
import Main from "./executors/main/Main";
import FriesDataUtils from "./utilities/FriesDataUtils";

import {getPrefixLength, hasValidPrefix} from "./utilities/PrefixUtils";

const client = new Discord.Client();

const mainExecutor = new Main();

FriesDataUtils.init();

client.on("ready", () => {
    console.log(`Bot is Ready!! [client.user.tag: ${client.user?.tag}]`);
});

client.on("guildCreate", (guild) => {
    let channel = guild.channels.cache.find((channel) => channel.name == "general" || channel.name == "일반");
    try {
        (channel as TextChannel).send("헤에... 감자튀김이야.\n'감튀야 도와줘' 혹은 '감자튀김 형 도와줘' 를 입력해봐!!").then();
    } catch(e) {
        console.log(e);
    }
});

client.on("message", (message) => {
    if (!hasValidPrefix(message.content)) return;

    let commands = message.content.substring(getPrefixLength(message.content), message.content.length)
        .replace(/\[.+]/gs, "")
        .replace(/\n/g, " ")
        .replace(/\s+/g," ")
        .split(" ");
    if (commands.indexOf("") !== -1)
        commands.splice(commands.indexOf(''), 1);

    try {
        let responseData = mainExecutor.exec(commands, [configurations.PREFIXES[0].value], message.author)
        new FriesResponse(message).do(responseData);

        if ((responseData.type == "embed" || responseData.type == "strings") && responseData.statistic.length > 0) {
            let operationCounts = FriesDataUtils.get().operationCounts[message.author.tag];
            operationCounts = operationCounts ? operationCounts : 0;
            FriesDataUtils.set("operationCounts", message.author.tag, operationCounts + 1);
            FriesDataUtils.applyStatistics(message.author.tag, responseData.statistic.join(" "), prefix);
        }
    } catch (e) {
        console.log(e);
        message.channel.send("\nERROR!! ERROR!! 삐리리↘.").then();
    }
});

client.login(configurations.PUBLISH_TOKEN).then(() => {
    console.log(`Login!!`);
});