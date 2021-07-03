import * as Discord from "discord.js";
import {TextChannel} from "discord.js";

import configurations from "../configurations.json";

import FriesResponse from "./response/FriesResponse";
import Main from "./executors/main/Main";

import {getPrefixLength, hasValidPrefix} from "./utilities/PrefixUtils";

const client = new Discord.Client();

const mainExecutor = new Main();

client.on("ready", () => {
    console.log(`Bot is Ready!! [client.user.tag: ${client.user?.tag}]`);
});

client.on("messageReactionAdd", (reaction, user) => {

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
        new FriesResponse(message).do(mainExecutor.exec(commands, message.author.username));
    } catch (e) {
        console.log(e);
        message.channel.send("\nERROR!! ERROR!! 삐리리↘.").then();
    }
});

client.login(configurations.PUBLISH_TOKEN).then(() => {
    console.log(`Login!!`);
});