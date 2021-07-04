import File from "fs";

interface FriesData {
    isFirstOperation: { [key: string]: boolean },
    operationCounts: { [key: string]: number },
    statistics: {
        [username: string]: { commands: {[command: string]: number}, prefixes: {[prefix: string]: number} }
    }
}

class FriesDataUtils {

    private static defaultValue: FriesData = {
        isFirstOperation: {},
        operationCounts: {},
        statistics: {}
    }

    private static data: FriesData;

    static init() {
        if (!File.existsSync("./data.json")) {
            File.writeFileSync("./data.json", JSON.stringify(FriesDataUtils.defaultValue), {encoding: "utf-8"});
        }

        FriesDataUtils.data = JSON.parse(File.readFileSync("./data.json", {encoding: "utf-8"}));
    }

    static get() {
        return FriesDataUtils.data;
    }

    static set(key: keyof FriesData, username: string, value: number | boolean) {
        FriesDataUtils.data[key][username] = value;
        this.save();
    }

    static applyStatistics(username: string, command: string, prefix: string) {
        if (!this.data.statistics.hasOwnProperty(username)) {
            this.data.statistics[username] = { commands: {}, prefixes: {} };
        }
        if (!this.data.statistics[username].commands.hasOwnProperty(command)) {
            this.data.statistics[username].commands[command] = 0;
        }
        if (!this.data.statistics[username].prefixes.hasOwnProperty(prefix)) {
            this.data.statistics[username].prefixes[prefix] = 0;
        }
        this.data.statistics[username].commands[command] = this.data.statistics[username].commands[command] + 1;
        this.data.statistics[username].prefixes[prefix] = this.data.statistics[username].prefixes[prefix] + 1;
        this.save();
    }

    static save() {
        File.writeFileSync("./data.json", JSON.stringify(FriesDataUtils.data, null, 4));
    }

}

export default FriesDataUtils;