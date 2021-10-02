import { DiscordClient } from "../DiscordClient"

export const DISCORD_IMAGE_BASE_URL = "https://cdn.discordapp.com"

export interface StaticImageURLOptions {
    format: 'webp' | 'gif' | 'png' | 'jpg' | 'jpeg' | 'json'
    size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096
}

export function parseStaticImageURLOptions(options?: Partial<StaticImageURLOptions>) {
    if (!options) return ''
    const size = options.size
    return `.${options.format ?? 'webp'}${size ? `?size=${size}` : ''}`
}

export class CachedManager<V extends { id: string }> {
    readonly client: DiscordClient
    readonly cache: Map<string, V> = new Map()

    protected loaded = false

    resolve(idOrInstance: string | V) {
        return typeof idOrInstance === 'string' ? this.cache.get(idOrInstance) : idOrInstance
    }

    resolveId(idOrInstance: string | V) {
        return typeof idOrInstance === 'string' ? idOrInstance : idOrInstance.id
    }

    clear() {
        this.cache.clear()
    }

    filter(predicate: (value: V) => unknown) {
        const result: V[] = []
        this.cache.forEach(v => {
            if (predicate(v)) result.push(v)
        })
        return result
    }

    constructor(client: DiscordClient) {
        this.client = client
    }
}