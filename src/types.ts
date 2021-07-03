type EmbedType = "block" | "item";

export interface Entry<T> {
    key: string,
    value: T
}

export interface Prefix {
    type: string,
    value: string,
    suffixEnabled: boolean
}

export interface EmbedData {
    type: EmbedType,
    title: string,
    description: string,
    thumbnail: string,
    extras?: object
}

interface StringResponse {
    type: "strings",
    data: string[]
}

interface EmbedResponse {
    type: "embed",
    data: EmbedData
}

export type MinecraftResult = MinecraftResultMaterial | MinecraftResultDeathMessage;

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

export type ResponseData = StringResponse | EmbedResponse;