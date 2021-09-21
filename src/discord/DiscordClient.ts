import { DiscordWs } from "./ws/DiscordWs";

export class DiscordClient {
    readonly ws = new DiscordWs(this)

    login() {
        this.ws.login()
    }

    close() {
        this.ws.close()
    }
}