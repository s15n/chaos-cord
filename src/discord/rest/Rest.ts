import { DiscordClient } from "../DiscordClient";

const noop = () => {}; // eslint-disable-line no-empty-function
const methods = ['get', 'post', 'delete', 'patch', 'put']
const reflectors = [
  'toString',
  'valueOf',
  'inspect',
  'constructor',
  Symbol.toPrimitive,
  Symbol.for('nodejs.util.inspect.custom')
];

export function Rest(api: string) {
    const route = [api]
    const handler: ProxyHandler<() => void> = {
        get(_, path) {
            if (reflectors.includes(path)) return () => route.join('/')

            if (typeof path !== 'string') return

            if (methods.includes(path)) {
                return (props?: RequestInit) => {
                    return fetch("", {
                        method: path,
                        ...props
                    })
                }
            }

            route.push(path)
            return new Proxy(noop, handler)
        },
    }
    return new Proxy(noop, handler) as any
}

export const API = null

export const API_ROOT = "https://discord.com/api"