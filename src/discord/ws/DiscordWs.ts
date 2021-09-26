import { dateToHHMMSS } from "../../utils"
import { DiscordData, DiscordIdentify, DiscordResume, DiscordSocketPayload, OPOut } from "../discord-classes"
import { DiscordClient } from "../DiscordClient"
import { DiscordEvent, handlers, isDiscordEventType } from "./handlers/handlers"

export class DiscordWs {
    readonly client: DiscordClient

    constructor(client: DiscordClient) {
        this.client = client
    }

    latency: number | null = null
    socket: WebSocket | null = null
    sessionId: string | null = null
    
    _hbInterval!: number
    _hbTimerId!: number
    _lastHb!: number
    _sequenceId: number | null = null
    
    login(token: string, resume: boolean = false) {
        console.log(resume ? 'Resuming...': 'Discord login start')
    
        const socket = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json') //TODO: get gateway
    
        socket.addEventListener('open', () => {
            console.log('Connected to websocket')
            this.socket = socket
        })
    
        socket.addEventListener('close', event => {
            console.warn(`Discord WS Closed! "${event.reason}", Code: ${event.code}`)
            window.clearInterval(this._hbTimerId)
            if (event.code !== 1000) this.login(token, true)
        })
    
        socket.addEventListener('message', event => {
            if (!this.socket) {
                console.warn('UNHANDLED MESSAGE')
            }

            const object: any = JSON.parse(event.data)
            console.debug(object)
            const op: number = object.op
            const t: DiscordEvent = object.t
            const s: number = object.s
            const d: any = object.d
    
            switch (op) {
            case 10:
                this._handleHello(token, resume, d)
                break
            case 11:
                    this.latency = Date.now() - this._lastHb
                    console.log(`...Received (latency: ${this.latency})`)
                    break
            case 0:
                this._sequenceId = s
                if (!this._handleEvent(t, d)) this._logUnknownEvent(object)
                break
            case 7:
            case 9:
                //this.close()
                this.login(token, true)
                break
            default:
                this._logUnknownEvent(object)
            }
        });
    }
    
    close() {
        if (!this.socket) return
        console.log('Shutting down discord')
        this.socket.close(1000)
    }

    send<OP extends OPOut>(op: OP, data: DiscordData<OP>) {
        const payload = JSON.stringify({
            op: op,
            d: data
        })
        console.log(`>>> ${payload}`)
        this.socket?.send(payload)
    }

    _handleEvent(t: string, d: any) {
        if (!isDiscordEventType(t)) return false
        const handler = handlers.get(t)
        if (!handler) return false
        handler.then(v => v(this.client, d))
        return true
    }
    
    _logUnknownEvent(event: {}) {
        console.log('Unknown event:')
        console.log(event);
    }
    
    _heartbeat(sequenceId: number | null) {
        if (this._hbTimerId !== window.currentDiscordHbTimerId) {
            //console.log('Heartbeat cancelled')
            window.clearInterval(this._hbTimerId)
            //this.socket.close(1000)
        } else {
            console.log(`[${dateToHHMMSS(new Date())}]: Heartbeat... (${this.sessionId})`)
            this.socket?.send(JSON.stringify({
                op: 1,
                d: sequenceId
            }))
        }
        return Date.now()
    }

    _handleHello(token: string, resume: boolean, d: { heartbeat_interval: number }) {
        // Manage heartbeats
        this._hbInterval = d.heartbeat_interval
        console.log(`Heartbeat interval: ${this._hbInterval}`)
        this._hbTimerId = window.setInterval(() => {
            this._lastHb = this._heartbeat(this._sequenceId)
        }, this._hbInterval)
        window.currentDiscordHbTimerId = this._hbTimerId
        console.log(window.currentDiscordHbTimerId)

        // Identify
        if (!resume) {
            console.log('Identifying')
            this.send(2, {
                token: token,
                capabilities: 125,
                presence: {
                    activities: [/*{
                        name: 'Live',
                        type: 1,
                        url: 'https://twitch.tv/hallowelt100',
                        
                    }*/],
                    afk: false,
                    status: 'online'
                },
                properties: {
                    os: 'Windows',
                    browser: 'Chrome'
                }
            } as DiscordIdentify)
        } else {
            this.send(6, {
                token: token,
                session_id: this.sessionId,
                seq: this._sequenceId
            } as DiscordResume)
        }
    }
}