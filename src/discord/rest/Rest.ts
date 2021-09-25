import { DiscordClient } from "../DiscordClient";

/*
type X<T> = {
    [P in keyof T]: T[P]
}*/

export class Rest<T> {
    private readonly client: DiscordClient
    constructor(client: DiscordClient) {
        this.client = client
        this.api = new Router()
    }

    api: Router
}

class Router {
    [P: string]: Router | any

    get(queryParams: {}, ...args: any[]) {
        
    }
}