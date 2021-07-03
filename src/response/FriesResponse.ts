import {Message, MessageAttachment, MessageEmbed} from "discord.js";
import File from "fs";

import {EmbedData, ResponseData} from "../types";
import {log} from "../utilities/Logger";

class FriesResponse {

    message: Message | null = null;
    count: number = 0;

    constructor(message: Message) {
        this.message = message;
    }

    embed(embedTarget: EmbedData) {
        if (!FriesResponse.isMessageValid(this.message, "parent message"))
            return;

        const thumbnail = `resources/minecraft/${embedTarget.type}s/${embedTarget.thumbnail}.png`;
        const thumbnailExists = File.existsSync(thumbnail);

        const embed = new MessageEmbed()
            .setColor("#999999")
            .setTitle(embedTarget.title)
            .setDescription(`${embedTarget.description}${embedTarget.thumbnail && !thumbnailExists ? " \n이미지는 어째선지 찾을 수 없었어... 궁금하면 인터넷을 찾아보자!" : ""}`);

        if (thumbnailExists)
            embed
                .attachFiles([new MessageAttachment(thumbnail, `${embedTarget.thumbnail}.png`)])
                .setThumbnail(`attachment://${embedTarget.thumbnail}.png`);

        this.message!!.channel?.send(embed).then();
    }

    strings(sendTarget: string[], editTarget: Message | null) {
        if (!FriesResponse.isMessageValid(this.message, "parent message"))
            return;

        let isFirst = this.count === 0;
        let isLast = sendTarget.length - 1 == this.count;
        let isFinished = sendTarget.length == this.count;
        let editing = sendTarget.length > 1 && !isLast;

        if (isFinished) return;

        if (!isFirst && !FriesResponse.isMessageValid(editTarget, "edit target message"))
            return;

        setTimeout(() => {
            if (isFirst)
                this.message!!.channel?.send(`${editing ? "_writing_\n" : ""}${sendTarget.slice(0, ++this.count).join("\n")}`).then((message) => {
                    this.strings(sendTarget, message);
                });
            else
                editTarget!!.edit(`${editing ? "_writing_\n" : ""}${sendTarget.slice(0, ++this.count).join("\n")}`).then((message) => {
                    this.strings(sendTarget, message);
                });
        }, 25 * sendTarget[this.count].length);
    }

    do(target: ResponseData) {
        if (target.type == "strings") {
            this.strings(target.data, null);
        } else if (target.type == "embed") {
            this.embed(target.data);
        } else {
            log(`invalid response type!!`);
            log(`... but this is not possible, haha.`);
        }
    }

    private static isMessageValid(message: Message | null, messageType: string) {
        if (message == null)
            log(`Error sending message: ${messageType} is null!!`);
        return message != null;
    }

}

export default FriesResponse;